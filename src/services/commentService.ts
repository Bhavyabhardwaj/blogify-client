
import api from '@/lib/api';
import { Comment } from '@/types';

export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const createComment = async (postId: string, content: string): Promise<Comment> => {
  const response = await api.post(`/comments/${postId}`, { content });
  return response.data;
};
