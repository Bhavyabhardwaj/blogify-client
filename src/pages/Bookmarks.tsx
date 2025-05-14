
import { useState, useEffect } from "react";
import { getBookmarks, removeBookmark } from "@/services/blogService";
import { Post } from "@/types";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const userBookmarks = await getBookmarks();
        setBookmarks(userBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to load your bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, navigate]);

  const handleRemoveBookmark = async (postId: string) => {
    try {
      await removeBookmark(postId);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== postId));
      toast.success("Removed from bookmarks");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse space-y-6 w-full">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookmarked Posts</h1>
        <p className="text-muted-foreground">Posts you've saved for later</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(post => (
            <PostCard 
              key={post.id}
              post={{ ...post, isBookmarked: true }}
              onBookmark={handleRemoveBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't bookmarked any posts. Browse and save interesting posts for later!
          </p>
          <Button onClick={() => navigate("/")}>
            Browse Posts
          </Button>
        </div>
      )}
    </div>
  );
}
