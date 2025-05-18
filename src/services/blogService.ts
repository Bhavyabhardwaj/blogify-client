
import api from '@/lib/api';
import { Post, PostCreateData, PostUpdateData } from '@/types';

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts/all');
    console.log("API response for getAllPosts:", response.data);
    
    // Get user likes to mark which posts are liked
    const userLikes = await getLikes();
    
    // Get user bookmarks
    const userBookmarks = await getBookmarkIds();
    
    // Check if response.data is an object with a posts property (array)
    if (response.data && typeof response.data === 'object' && Array.isArray(response.data.posts)) {
      return response.data.posts.map(post => 
        normalizePostData(post, userLikes, userBookmarks));
    }
    
    // If response.data is already an array, return it
    if (Array.isArray(response.data)) {
      return response.data.map(post => 
        normalizePostData(post, userLikes, userBookmarks));
    }
    
    console.error("Unexpected response format from API:", response.data);
    return []; // Return empty array on unexpected format to prevent errors
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return []; // Return empty array on error to prevent slice errors
  }
};

export const getUserPosts = async (): Promise<Post[]> => {
  try {
    console.log("Fetching user posts");
    const response = await api.get('/posts');
    console.log("User posts response:", response.data);
    
    // Get user likes
    const userLikes = await getLikes();
    
    // Get user bookmarks
    const userBookmarks = await getBookmarkIds();
    
    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.posts)) {
        return response.data.posts.map(post => 
          normalizePostData(post, userLikes, userBookmarks));
      } else if (Array.isArray(response.data)) {
        return response.data.map(post => 
          normalizePostData(post, userLikes, userBookmarks));
      }
    }
    
    console.warn("Unexpected user posts response format:", response.data);
    return Array.isArray(response.data) 
      ? response.data.map(post => normalizePostData(post, userLikes, userBookmarks)) 
      : [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await api.get(`/posts/${id}`);
    
    // Get user likes to check if this post is liked
    const userLikes = await getLikes();
    
    // Get user bookmarks
    const userBookmarks = await getBookmarkIds();
    
    return normalizePostData(response.data, userLikes, userBookmarks);
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw error;
  }
};

export const createPost = async (postData: PostCreateData): Promise<Post> => {
  try {
    console.log("Original post data:", postData);
    
    // Format the data according to the API requirements
    const formattedData = {
      title: postData.title,
      content: postData.content,
      featured_image: postData.featured_image || null, // Ensure null instead of undefined
      tags: [], // Always include an empty tags array if none provided
      tagIds: postData.tagIds || [] // Ensure we always send an array even if empty
    };
    
    console.log("Formatted post data being sent to API:", JSON.stringify(formattedData));
    
    const response = await api.post('/posts', formattedData);
    console.log("API response:", response.data);
    return normalizePostData(response.data);
  } catch (error: any) {
    console.error("Error from API:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePost = async (postData: PostUpdateData): Promise<Post> => {
  const response = await api.put(`/posts/${postData.id}`, postData);
  return normalizePostData(response.data);
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

export const likePost = async (id: string): Promise<void> => {
  try {
    console.log(`Liking post with ID: ${id}`);
    const response = await api.post(`/likes/${id}`);
    console.log("Like post response:", response.data);
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const unlikePost = async (id: string): Promise<void> => {
  try {
    console.log(`Unliking post with ID: ${id}`);
    const response = await api.delete(`/likes/${id}`);
    console.log("Unlike post response:", response.data);
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

export const getLikes = async (): Promise<string[]> => {
  try {
    console.log("Fetching user likes");
    const response = await api.get('/likes');
    console.log("User likes response:", response.data);
    
    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.likes)) {
        return response.data.likes.map((like: any) => like.postId || like.id);
      } else if (Array.isArray(response.data)) {
        return response.data.map((like: any) => like.postId || like.id);
      }
    }
    
    return Array.isArray(response.data) 
      ? response.data.map((like: any) => like.postId || like.id) 
      : [];
  } catch (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
};

export const bookmarkPost = async (postId: string): Promise<void> => {
  try {
    console.log(`Bookmarking post with ID: ${postId}`);
    const response = await api.post('/bookmarks', { postId });
    console.log("Bookmark response:", response.data);
  } catch (error) {
    console.error("Error bookmarking post:", error);
    throw error;
  }
};

export const removeBookmark = async (id: string): Promise<void> => {
  try {
    console.log(`Removing bookmark with ID: ${id}`);
    await api.delete(`/bookmarks/${id}`);
    console.log("Successfully removed bookmark");
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

// New function to get just the bookmarked post IDs
export const getBookmarkIds = async (): Promise<string[]> => {
  try {
    console.log("Fetching bookmark IDs");
    const response = await api.get('/bookmarks');
    console.log("Bookmarks response for IDs:", response.data);
    
    // Try to extract post IDs based on possible response formats
    if (response.data) {
      // Format 1: { bookmarks: Post[] }
      if (response.data.bookmarks && Array.isArray(response.data.bookmarks)) {
        return response.data.bookmarks.map((item: any) => item.id || item.postId);
      }
      // Format 2: { posts: Post[] }
      else if (response.data.posts && Array.isArray(response.data.posts)) {
        return response.data.posts.map((item: any) => item.id || item.postId);
      }
      // Format 3: Post[]
      else if (Array.isArray(response.data)) {
        return response.data.map((item: any) => item.id || item.postId);
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching bookmark IDs:", error);
    return [];
  }
};

export const getBookmarks = async (): Promise<Post[]> => {
  try {
    console.log("Fetching bookmarks");
    const response = await api.get('/bookmarks');
    console.log("Bookmarks response:", response.data);
    
    // Get user likes to mark which posts are liked
    const userLikes = await getLikes();
    
    // Get user bookmarks (this is redundant but keeping for consistency)
    const userBookmarks = await getBookmarkIds();
    
    // Try all possible response formats
    let bookmarksData = [];
    
    if (response.data && typeof response.data === 'object') {
      // Format 1: { bookmarks: Post[] }
      if (response.data.bookmarks && Array.isArray(response.data.bookmarks)) {
        console.log("Found bookmarks array in response.data.bookmarks");
        bookmarksData = response.data.bookmarks;
      }
      // Format 2: { posts: Post[] }
      else if (response.data.posts && Array.isArray(response.data.posts)) {
        console.log("Found bookmarks array in response.data.posts");
        bookmarksData = response.data.posts;
      }
      // Format 3: { data: Post[] }
      else if (response.data.data && Array.isArray(response.data.data)) {
        console.log("Found bookmarks array in response.data.data");
        bookmarksData = response.data.data;
      }
      // Format 4: Post[]
      else if (Array.isArray(response.data)) {
        console.log("Found bookmarks array directly in response.data");
        bookmarksData = response.data;
      }
    }
    
    // Make sure each bookmark has isBookmarked set to true 
    return bookmarksData.map(post => {
      const normalizedPost = normalizePostData(post, userLikes, userBookmarks);
      normalizedPost.isBookmarked = true; // Ensure this is always true for bookmarks page
      return normalizedPost;
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return []; // Return empty array on error
  }
};

// Updated helper function to normalize post data
function normalizePostData(post: any, userLikes: string[] = [], userBookmarks: string[] = []): Post {
  if (!post) return post;

  // Make sure likes is a number 
  if (post.likes === undefined || post.likes === null || isNaN(Number(post.likes))) {
    post.likes = 0;
  } else {
    post.likes = Number(post.likes);
  }

  // Make sure comments is a number
  if (post.comments === undefined || post.comments === null || isNaN(Number(post.comments))) {
    post.comments = 0;
  } else {
    post.comments = Number(post.comments);
  }

  // Ensure createdAt and updatedAt are valid dates
  if (!post.createdAt || isNaN(new Date(post.createdAt).getTime())) {
    post.createdAt = new Date().toISOString();
  }
  
  if (!post.updatedAt || isNaN(new Date(post.updatedAt).getTime())) {
    post.updatedAt = post.createdAt || new Date().toISOString();
  }

  // Ensure author is properly structured
  if (!post.author) {
    post.author = {
      id: 'unknown',
      name: 'Anonymous',
      email: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  // Check if this post is liked by the user
  post.isLiked = userLikes.includes(post.id);
  
  // Check if this post is bookmarked by the user
  post.isBookmarked = userBookmarks.includes(post.id);

  return post;
}
