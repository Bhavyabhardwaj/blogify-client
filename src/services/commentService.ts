
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
      const extractedComments = Object.values(response.data).filter(item => 
        typeof item === 'object' && item !== null && 'content' in item
      );
      
      // Make sure all extracted items conform to Comment type
      comments = extractedComments.map((item: any) => ({
        id: item.id || `temp-${Math.random()}`,
        content: item.content || '',
        author: item.author || {
          id: item.authorId || 'unknown',
          name: item.authorName || item.userName || 'Anonymous',
          email: item.email || '',
          avatar: item.avatar || '',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        },
        postId: item.postId || postId,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      }));
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
    
    // If author is not present in the response, add a placeholder
    if (!comment.author) {
      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      let user = null;
      
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
      
      comment.author = {
        id: user?.id || 'unknown',
        name: user?.name || 'Anonymous',
        email: user?.email || '',
        avatar: user?.avatar || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
