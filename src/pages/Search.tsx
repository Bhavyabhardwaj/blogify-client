
import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Input } from "@/components/ui/input";
import { getAllPosts } from "@/services/blogService";
import { Post } from "@/types";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts for search:", error);
      } finally {
=======
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPosts, likePost, unlikePost, bookmarkPost, removeBookmark } from "@/services/blogService";
import { Post } from "@/types";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => {
      const titleMatch = post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const authorMatch = post.author?.name && post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if post has tags and search through them
      const tagMatch = post.tags?.some(tag => 
        tag.name && tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return titleMatch || contentMatch || authorMatch || tagMatch;
    });

    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSearchClear = () => {
    setSearchQuery("");
    setFilteredPosts(posts);
  };

  const handleLike = (postId: string) => {
    // Redirect to login if not authenticated or handle like functionality
    navigate(`/post/${postId}`);
  };

  const handleBookmark = (postId: string) => {
    // Redirect to login if not authenticated or handle bookmark functionality
    navigate(`/post/${postId}`);
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
=======
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

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      // Find the post
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;

      const post = posts[postIndex];
      const newLikedStatus = !post.isLiked;
      
      // Optimistically update UI
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...post,
        isLiked: newLikedStatus,
        likes: newLikedStatus ? post.likes + 1 : Math.max(0, post.likes - 1)
      };
      
      setPosts(updatedPosts);
      
      // Update server
      if (newLikedStatus) {
        await likePost(postId);
      } else {
        await unlikePost(postId);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like");
      // Revert on error by re-fetching posts
      const refreshedPosts = await getAllPosts();
      setPosts(refreshedPosts);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      // Find the post
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return;

      const post = posts[postIndex];
      const newBookmarkedStatus = !post.isBookmarked;
      
      // Optimistically update UI
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...post,
        isBookmarked: newBookmarkedStatus
      };
      
      setPosts(updatedPosts);
      
      // Update server
      if (newBookmarkedStatus) {
        await bookmarkPost(postId);
      } else {
        await removeBookmark(postId);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast.error("Failed to update bookmark");
      // Revert on error by re-fetching posts
      const refreshedPosts = await getAllPosts();
      setPosts(refreshedPosts);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
        
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search by title, content, author or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xl"
          />
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">Start searching</h3>
                <p className="text-muted-foreground">
                  Type in the search box to find posts
                </p>
              </>
            )}
            
            <Button 
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
