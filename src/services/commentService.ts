
import api from '@/lib/api';
import { Comment } from '@/types';
import { toast } from 'sonner';

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get(`/comments/${postId}`);
    console.log("Comments data received:", response.data);
    
    // Normalize the response data
    let comments: Comment[] = [];
    
    if (Array.isArray(response.data)) {
      comments = response.data;
    } else if (response.data && Array.isArray(response.data.comments)) {
      comments = response.data.comments;
    } else if (response.data && typeof response.data === 'object') {
      // If it's an object but not in the expected format, try to extract comments
      comments = Object.values(response.data).filter(item => 
        typeof item === 'object' && item !== null && 'content' in item
      );
    }
    
    // Sort comments by date (newest first)
    return comments.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    toast.error("Failed to load comments");
    return [];
  }
};

export const createComment = async (postId: string, content: string): Promise<Comment> => {
  try {
    console.log(`Creating comment for post ${postId}:`, content);
    const response = await api.post(`/comments/${postId}`, { content });
    console.log("Comment created:", response.data);
    
    // Ensure the response has the expected format
    const comment = response.data;
    if (!comment.createdAt) {
      comment.createdAt = new Date().toISOString();
    }
    
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
