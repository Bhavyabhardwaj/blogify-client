<<<<<<< HEAD
=======

>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment: (postId: string, content: string) => Promise<void>;
}

export function CommentSection({
  comments,
  postId,
  onAddComment,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate content
    if (!content.trim() || isSubmitting) {
      return;
    }

=======
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim() || isSubmitting) {
      return;
    }

>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Submit comment
    setIsSubmitting(true);
    try {
      await onAddComment(postId, content.trim());
      setContent(""); // Clear form on successful submission
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
<<<<<<< HEAD
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments ? comments.length : 0})
      </h3>

=======
      <h3 className="text-xl font-semibold mb-4">Comments ({comments ? comments.length : 0})</h3>
      
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-2 min-h-[100px]"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? "Adding Comment..." : "Add Comment"}
          </Button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg text-center">
          <p className="mb-2">Sign in to leave a comment</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      )}
<<<<<<< HEAD

=======
      
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
      {comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="animate-fade-in">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
<<<<<<< HEAD
                  <AvatarImage
                    src={comment.author?.avatar}
                    alt={comment.author?.name}
                  />
                  <AvatarFallback>
                    {getInitials(comment.author?.name || "")}
                  </AvatarFallback>
=======
                  <AvatarImage src={comment.author?.avatar} alt={comment.author?.name} />
                  <AvatarFallback>{getInitials(comment.author?.name || "")}</AvatarFallback>
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
                </Avatar>
                <div className="w-full">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium">
<<<<<<< HEAD
                      {comment.author?.name || user?.name || "Anonymous"}{" "}
=======
                      {comment.author?.name || "Anonymous"}
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
}
