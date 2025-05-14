
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        title,
        content,
        featured_image: featuredImage || undefined
      };

      const post = await createPost(postData);
      toast.success("Post created successfully!");
      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Post</h1>
        <p className="text-muted-foreground">Share your thoughts with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter your post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
          <Input
            id="featuredImage"
            placeholder="https://example.com/image.jpg"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
          />
          {featuredImage && (
            <div className="mt-2">
              <img
                src={featuredImage}
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
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px]"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
