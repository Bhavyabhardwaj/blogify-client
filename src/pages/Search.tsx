import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPosts, likePost, unlikePost, bookmarkPost, removeBookmark } from "@/services/blogService";
import { Post } from "@/types";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const contentMatch = post.content.toLowerCase().includes(query);
      
      // Safely check tags
      const tagMatch = post.tags && Array.isArray(post.tags) 
        ? post.tags.some(tag => tag.name.toLowerCase().includes(query))
        : false;
      
      // Safely check author name
      const authorMatch = post.author && post.author.name
        ? post.author.name.toLowerCase().includes(query)
        : false;
        
      return titleMatch || contentMatch || tagMatch || authorMatch;
    });
    
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSearchClear = () => {
    setSearchQuery("");
    setFilteredPosts(posts);
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isLiked) {
        await unlikePost(postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes - 1, isLiked: false }
            : p
        ));
      } else {
        await likePost(postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes + 1, isLiked: true }
            : p
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
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

      if (post.isBookmarked) {
        await removeBookmark(postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, isBookmarked: false }
            : p
        ));
      } else {
        await bookmarkPost(postId);
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, isBookmarked: true }
            : p
        ));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark status");
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
      
      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search-input"
          placeholder="Search by title, content, author or tags..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={handleSearchClear}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[320px] bg-muted/40 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-medium mb-2">No matching posts found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or browse all posts
              </p>
              <Button onClick={() => navigate("/")}>
                Browse All Posts
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
