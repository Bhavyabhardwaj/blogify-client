
import { useState, useEffect } from "react";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/services/blogService";
import { Post } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { likePost, unlikePost, bookmarkPost, removeBookmark } from "@/services/blogService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        // Ensure posts is an array before setting state
        if (Array.isArray(allPosts)) {
          setPosts(allPosts);
        } else {
          console.error("Expected array of posts but received:", allPosts);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]); // Initialize with empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      });

      setPosts(updatedPosts);

      if (post.isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like");
      // Revert UI change on error
      const originalPosts = await getAllPosts();
      setPosts(originalPosts);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedPosts = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: !p.isBookmarked
          };
        }
        return p;
      });

      setPosts(updatedPosts);

      if (post.isBookmarked) {
        await removeBookmark(postId);
        toast.success("Removed from bookmarks");
      } else {
        await bookmarkPost(postId);
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Failed to update bookmark");
      // Revert UI change on error
      const originalPosts = await getAllPosts();
      setPosts(originalPosts);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-52 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Safely handle posts - ensure it's an array before using slice
  const featuredPost = Array.isArray(posts) && posts.length > 0 ? posts[0] : null;
  const regularPosts = Array.isArray(posts) ? posts.slice(1) : [];

  return (
    <div>
      <section className="flex flex-col items-center justify-center py-8 text-center">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Welcome to Blogify</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Discover stories, thinking, and expertise from writers on any topic
          </p>
          
          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Button size="lg" onClick={() => navigate("/register")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>

      {featuredPost && (
        <section className="pt-4 pb-8">
          <h2 className="text-2xl font-semibold mb-6">Featured Post</h2>
          <FeaturedPost 
            post={featuredPost} 
            onLike={handleLike} 
            onBookmark={handleBookmark} 
          />
        </section>
      )}

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike} 
                onBookmark={handleBookmark} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No posts found. Be the first to create a post!
          </div>
        )}
      </section>
    </div>
  );
}
