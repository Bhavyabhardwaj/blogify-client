<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "@/services/blogService";
import { Post } from "@/types";
=======

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "@/services/blogService";
import { Post, PostUpdateData } from "@/types";
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { Label } from "@/components/ui/label";
=======
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featured_image, setFeaturedImage] = useState("");
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
=======
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated, user } = useAuth();
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
<<<<<<< HEAD
      if (!isAuthenticated || !user?.id) {
        console.log("User not authenticated or missing ID:", { isAuthenticated, userId: user?.id });
        toast.error("Please log in to edit posts");
=======
      if (!isAuthenticated) {
        toast.error("You must be logged in to edit posts");
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
        navigate("/login");
        return;
      }

<<<<<<< HEAD
      if (!id) {
        toast.error("Post ID is missing");
        navigate("/");
        return;
      }

      try {
        const postData = await getPostById(id);
        console.log("Fetched post data:", postData);
        console.log("Current user:", user);
        
        if (!postData) {
          toast.error("Post not found");
          navigate("/");
          return;
        }

        // Check if the current user is the author
        const postAuthorId = Number(postData.author?.id);
        const currentUserId = Number(user.id);
        
        console.log("Post author ID:", postAuthorId);
        console.log("Current user ID:", currentUserId);

        // if (postAuthorId !== currentUserId) {
        //   toast.error("You can only edit your own posts");
        //   navigate("/");
        //   return;
        // }

=======
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
        
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setFeaturedImage(postData.featured_image || "");
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
<<<<<<< HEAD
        navigate("/");
=======
        navigate("/my-posts");
      } finally {
        setIsLoading(false);
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
      }
    };

    fetchPost();
<<<<<<< HEAD
  }, [id, navigate, isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to edit posts");
      navigate("/login");
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const updateData = {
        id: id!,
=======
  }, [id, isAuthenticated, navigate, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      setIsSaving(true);
      
      const updateData: PostUpdateData = {
        id,
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
        title,
        content,
        featured_image: featured_image || undefined
      };
      
<<<<<<< HEAD
      await updatePost(updateData);
      toast.success("Post updated successfully");
      navigate(`/post/${id}`);
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user?.id) {
    return null;
=======
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
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
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
<<<<<<< HEAD
              <Label htmlFor="title">Title</Label>
=======
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
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
<<<<<<< HEAD
              <Label htmlFor="content">Content</Label>
=======
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
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
<<<<<<< HEAD
              <Label htmlFor="featured_image">Featured Image URL (optional)</Label>
=======
              <label htmlFor="featured_image" className="block text-sm font-medium mb-1">
                Featured Image URL (optional)
              </label>
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
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
<<<<<<< HEAD
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
=======
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              {isSaving ? "Saving..." : "Update Post"}
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
