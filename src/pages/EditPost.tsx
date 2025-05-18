
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 max-w-3xl mx-auto"
    >
      <motion.h1 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-3xl font-bold mb-6"
      >
        Edit Post
      </motion.h1>
      
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
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
                className="dark:bg-gray-800 dark:border-gray-700"
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
                className="min-h-[300px] dark:bg-gray-800 dark:border-gray-700"
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
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              
              {featured_image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2"
                >
                  <img 
                    src={featured_image} 
                    alt="Featured" 
                    className="max-h-[200px] object-cover rounded-md" 
                    onError={() => toast.error("Invalid image URL")}
                  />
                </motion.div>
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
            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              {isSaving ? "Saving..." : "Update Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
