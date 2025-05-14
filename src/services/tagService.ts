
import api from '@/lib/api';
import { Post, Tag } from '@/types';

export const createTag = async (name: string): Promise<Tag> => {
  const response = await api.post('/tags', { name });
  return response.data;
};

export const addTagToPost = async (tagId: string, postId: string): Promise<void> => {
  await api.post(`/tags/${tagId}/posts`, { postId });
};

export const getPostsByTag = async (tagId: string): Promise<Post[]> => {
  const response = await api.get(`/tags/${tagId}/posts`);
  return response.data;
};
