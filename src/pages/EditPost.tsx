
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "@/services/blogService";
import { Post, PostUpdateData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featured_image, setFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      if (!id) return;

      try {
        setIsLoading(true);
        const postData = await getPostById(id);
        
        // Check if the post belongs to the current user
        if (postData.author.id !== user?.id) {
          toast.error("You can only edit your own posts");
          navigate("/my-posts");
          return;
        }
        
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setFeaturedImage(postData.featured_image || "");
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        navigate("/my-posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, isAuthenticated, navigate, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      setIsSaving(true);
      
      const updateData: PostUpdateData = {
        id,
        title,
        content,
        featured_image: featured_image || undefined
      };
      
      await updatePost(updateData);
      toast.success("Post updated successfully");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse space-y-6 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content"
                required
                className="min-h-[300px]"
              />
            </div>
            
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium mb-1">
                Featured Image URL (optional)
              </label>
              <Input
                id="featured_image"
                value={featured_image}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Enter image URL"
              />
              
              {featured_image && (
                <div className="mt-2">
                  <img 
                    src={featured_image} 
                    alt="Featured" 
                    className="max-h-[200px] object-cover rounded-md" 
                    onError={() => toast.error("Invalid image URL")}
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/post/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
