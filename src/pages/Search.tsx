
import { useState, useEffect } from "react";
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
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
