import api from '@/lib/api';
import { Post, PostCreateData, PostUpdateData } from '@/types';

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return []; // Return empty array on error to prevent slice errors
  }
};

export const getUserPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: PostCreateData): Promise<Post> => {
  // Format the data according to the API requirements
  const formattedData = {
    title: postData.title,
    content: postData.content,
    featured_image: postData.featured_image || null, // Ensure null instead of undefined
    tagIds: postData.tagIds || [] // Ensure we always send an array even if empty
  };

  const response = await api.post('/posts', formattedData);
  return response.data;
};

export const updatePost = async (postData: PostUpdateData): Promise<Post> => {
  const response = await api.put(`/posts/${postData.id}`, postData);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

export const likePost = async (id: string): Promise<void> => {
  await api.post(`/likes/${id}`);
};

export const unlikePost = async (id: string): Promise<void> => {
  await api.delete(`/likes/${id}`);
};

export const getLikes = async (): Promise<string[]> => {
  const response = await api.get('/likes');
  return response.data;
};

export const bookmarkPost = async (postId: string): Promise<void> => {
  await api.post('/bookmarks', { postId });
};

export const removeBookmark = async (id: string): Promise<void> => {
  await api.delete(`/bookmarks/${id}`);
};

export const getBookmarks = async (): Promise<Post[]> => {
  const response = await api.get('/bookmarks');
  return response.data;
};
