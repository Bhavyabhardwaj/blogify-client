
import { useState, useEffect } from "react";
import { getBookmarks, removeBookmark, bookmarkPost } from "@/services/blogService";
import { Post } from "@/types";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      console.log("Starting to fetch bookmarks");
      const userBookmarks = await getBookmarks();
      console.log("Finished fetching bookmarks:", userBookmarks);
      
      if (Array.isArray(userBookmarks)) {
        setBookmarks(userBookmarks);
        if (userBookmarks.length === 0) {
          console.log("No bookmarks found for user");
        }
      } else {
        console.error("Expected array but received:", userBookmarks);
        setError("Received invalid data from server");
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setError("Failed to load your bookmarks");
      toast.error("Failed to load your bookmarks");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    fetchBookmarks();
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

  if (error) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bookmarked Posts</h1>
          <p className="text-muted-foreground">Posts you've saved for later</p>
        </div>
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2 text-red-500">{error}</h3>
          <p className="text-muted-foreground mb-4">
            There was an error retrieving your bookmarks. Please try again later.
          </p>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            {isRefreshing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookmarked Posts</h1>
          <p className="text-muted-foreground">Posts you've saved for later</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          {isRefreshing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
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
