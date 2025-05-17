
import api from '@/lib/api';
import { Post, PostCreateData, PostUpdateData } from '@/types';

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts/all');
    console.log("API response for getAllPosts:", response.data);
    
    // Check if response.data is an object with a posts property (array)
    if (response.data && typeof response.data === 'object' && Array.isArray(response.data.posts)) {
      return response.data.posts;
    }
    
    // If response.data is already an array, return it
    if (Array.isArray(response.data)) {
      return response.data;
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
    
    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data.posts)) {
        return response.data.posts;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
    }
    
    console.warn("Unexpected user posts response format:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
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
    return response.data;
  } catch (error: any) {
    console.error("Error from API:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePost = async (postData: PostUpdateData): Promise<Post> => {
  const response = await api.put(`/posts/${postData.id}`, postData);
  return response.data;
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
        return response.data.likes;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
    }
    
    return Array.isArray(response.data) ? response.data : [];
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

export const getBookmarks = async (): Promise<Post[]> => {
  try {
    console.log("Fetching bookmarks");
    const response = await api.get('/bookmarks');
    console.log("Detailed bookmarks response:", response.data);
    
    // More extensive logging to help debug
    console.log("Bookmarks response type:", typeof response.data);
    
    // If response is empty, return empty array immediately
    if (!response.data) {
      console.log("Empty response data from bookmarks endpoint");
      return [];
    }
    
    // Enhanced logging for debugging
    if (typeof response.data === 'object') {
      console.log("Response object keys:", Object.keys(response.data));
    }
    
    // Try all possible response formats
    if (response.data && typeof response.data === 'object') {
      // Format 1: { bookmarks: Post[] }
      if (response.data.bookmarks && Array.isArray(response.data.bookmarks)) {
        console.log("Found bookmarks array in response.data.bookmarks");
        return response.data.bookmarks;
      }
      
      // Format 2: { posts: Post[] }
      if (response.data.posts && Array.isArray(response.data.posts)) {
        console.log("Found bookmarks array in response.data.posts");
        return response.data.posts;
      }
      
      // Format 3: { data: Post[] }
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log("Found bookmarks array in response.data.data");
        return response.data.data;
      }
      
      // Format 4: Post[]
      if (Array.isArray(response.data)) {
        console.log("Found bookmarks array directly in response.data");
        return response.data;
      }
    }
    
    console.error("Unexpected bookmarks response format:", response.data);
    return []; // Return empty array on unexpected format
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return []; // Return empty array on error
  }
};
