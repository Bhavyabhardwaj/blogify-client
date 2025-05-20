import { useState, useEffect } from "react";
import { getUserPosts, deletePost } from "@/services/blogService";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const userPosts = await getUserPosts();
        
<<<<<<< HEAD
        // Process the posts to ensure valid date formats and number types
        const processedPosts = userPosts.map(post => ({
          ...post,
          // Ensure createdAt is a valid date string or null/undefined, parse explicitly
          createdAt: post.createdAt ? parseISO(post.createdAt) : null, // Use parseISO here
=======
        // Process the posts to ensure valid date formats
        const processedPosts = userPosts.map(post => ({
          ...post,
          // Do not override existing createdAt dates
          createdAt: post.createdAt || new Date().toISOString(),
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
          // Ensure likes and comments are numbers
          likes: typeof post.likes === 'number' ? post.likes : 0,
          comments: typeof post.comments === 'number' ? post.comments : 0
        }));
        
        setPosts(processedPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to load your posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, navigate]);

  const handleEdit = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (post: Post) => {
    try {
      await deletePost(post.id);
      setPosts(posts.filter(p => p.id !== post.id));
      toast.success("Post deleted successfully");
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button onClick={() => navigate("/create-post")}>
          Create New Post
        </Button>
      </div>

      {posts.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <div className="truncate max-w-[400px]">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto justify-start text-left"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      {post.title}
                    </Button>
                  </div>
                </TableCell>
<<<<<<< HEAD
                <TableCell>{
                  post.createdAt ?
                  format(post.createdAt, 'PPpp') :
                  'Unknown date'
                }</TableCell>
=======
                <TableCell>{formatDate(post.createdAt)}</TableCell>
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
                <TableCell>{post.likes || 0}</TableCell>
                <TableCell>{post.comments || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(post.id)}
<<<<<<< HEAD
=======
                      className="hover:bg-primary/10 transition-colors"
>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setPostToDelete(post)}
                      className="hover:bg-destructive/10 transition-colors"
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any blog posts yet.
          </p>
          <Button onClick={() => navigate("/create-post")}>
            Create Your First Post
          </Button>
        </div>
      )}

      <Dialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPostToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => postToDelete && handleDelete(postToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}