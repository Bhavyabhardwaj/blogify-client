
import api from '@/lib/api';
import { Post, PostCreateData, PostUpdateData } from '@/types';

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts/all');
  return response.data;
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
  const response = await api.post('/posts', postData);
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
