
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, likePost, unlikePost, bookmarkPost, removeBookmark } from "@/services/blogService";
import { getComments, createComment } from "@/services/commentService";
import { Post, Comment } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/blog/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BookmarkIcon, Heart, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPostById(id),
          getComments(id)
        ]);
        
        // Ensure likes is a number
        if (postData) {
          if (postData.likes === undefined || postData.likes === null || isNaN(Number(postData.likes))) {
            postData.likes = 0;
          } else {
            postData.likes = Number(postData.likes);
          }
          
          if (postData.comments === undefined || postData.comments === null || isNaN(Number(postData.comments))) {
            postData.comments = commentsData?.length || 0;
          }
        }
        
        setPost(postData);
        setComments(commentsData || []);
      } catch (error) {
        console.error("Error fetching post details:", error);
        toast.error("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!post) return;

    try {
      const newIsLiked = !post.isLiked;
      const currentLikes = typeof post.likes === 'number' ? post.likes : 0;
      
      setPost({
        ...post,
        isLiked: newIsLiked,
        likes: newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
      });

      if (newIsLiked) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like");
      // Revert UI change on error
      if (id) {
        const updatedPost = await getPostById(id);
        setPost(updatedPost);
      }
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!post) return;

    try {
      const newIsBookmarked = !post.isBookmarked;
      setPost({
        ...post,
        isBookmarked: newIsBookmarked
      });

      if (newIsBookmarked) {
        await bookmarkPost(post.id);
        toast.success("Added to bookmarks");
      } else {
        await removeBookmark(post.id);
        toast.success("Removed from bookmarks");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Failed to update bookmark");
      // Revert UI change on error
      if (id) {
        const updatedPost = await getPostById(id);
        setPost(updatedPost);
      }
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    try {
      const newComment = await createComment(postId, content);
      
      // Create a properly formatted comment with author info that matches Comment type
      const commentWithAuthor: Comment = {
        ...newComment,
        author: {
          id: user?.id || '',
          name: user?.name || 'Anonymous',
          avatar: user?.avatar || '',
          email: user?.email || '',
          // Add required fields for User type
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      setComments(prevComments => [commentWithAuthor, ...prevComments]);
      
      // Update comment count in post
      if (post) {
        const newCommentCount = (post.comments || 0) + 1;
        setPost({
          ...post,
          comments: newCommentCount
        });
      }
      
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse space-y-6 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
        
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post?.author?.avatar} alt={post?.author?.name} />
            <AvatarFallback>{getInitials(post?.author?.name || '')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post?.author?.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(post?.createdAt)}
            </div>
          </div>
        </div>

        {post?.featured_image && (
          <div className="mb-6">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 ${post?.isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart size={18} className={post?.isLiked ? "fill-red-500" : ""} /> {typeof post?.likes === 'number' ? post.likes : 0}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => {
              const commentSection = document.querySelector('#comments-section');
              if (commentSection) {
                commentSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <MessageSquare size={18} /> {post?.comments || 0}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={post?.isBookmarked ? "text-blue-500" : ""}
            onClick={handleBookmark}
          >
            <BookmarkIcon size={18} className={post?.isBookmarked ? "fill-blue-500" : ""} />
          </Button>
        </div>

        {post?.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
      </article>
      
      <Separator className="my-8" />
      
      <div id="comments-section">
        <CommentSection 
          comments={comments} 
          postId={post?.id || ''} 
          onAddComment={handleAddComment} 
        />
      </div>
    </div>
  );
}
