
import { useState, useEffect } from "react";
import { getAllPosts } from "@/services/blogService";
import { Post } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/PostCard";
import { toast } from "sonner";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
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

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = posts.filter(
      post =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery) ||
        post.author?.name.toLowerCase().includes(lowerCaseQuery) ||
        (post.tags && post.tags.some(tag => tag.name.toLowerCase().includes(lowerCaseQuery)))
    );

    setFilteredPosts(results);
  }, [searchQuery, posts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered in useEffect
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Posts</h1>
        <p className="text-muted-foreground mb-6">Find posts by title, content, author, or tag</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-muted rounded-md"></div>
          ))}
        </div>
      ) : (
        <>
          {searchQuery && (
            <p className="mb-4 text-sm">
              Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} 
              for "{searchQuery}"
            </p>
          )}

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try using different keywords or browse all posts.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
