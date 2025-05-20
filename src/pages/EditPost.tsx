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
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

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
        toast.error("You must be logged in to edit posts");
        navigate("/login");
        return;
      }

      if (!id) return;

      try {
        setIsLoading(true);
        const postData = await getPostById(id);
        console.log("Fetched post data:", postData);
        
        // Check if the post belongs to the current user - compare IDs as strings to handle type mismatches
        if (postData.author.id.toString() !== user?.id?.toString()) {
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
      
      console.log("Sending update data:", updateData);
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
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container max-w-4xl py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
              <Input
                id="featuredImage"
                value={featured_image}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {featured_image && (
                <div className="mt-2">
                  <img
                    src={featured_image}
                    alt="Featured"
                    className="w-full h-auto max-h-[200px] object-cover rounded-md"
                    onError={() => {
                      toast.error("Invalid image URL");
                      setFeaturedImage("");
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="min-h-[300px]"
                required
              />
            </div>

            <CardFooter className="flex justify-end gap-2 px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
