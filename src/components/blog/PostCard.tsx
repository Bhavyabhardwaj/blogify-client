
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { formatDate, truncateText, getInitials } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookmarkIcon, Heart, MessageSquare } from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export function PostCard({ post, onLike, onBookmark }: PostCardProps) {
  const navigate = useNavigate();

  // Ensure likes and comments are always numbers
  const likeCount = typeof post.likes === 'number' ? post.likes : 0;
  const commentCount = typeof post.comments === 'number' ? post.comments : 0;

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col dark:border-gray-700">
        {post.featured_image && (
          <div className="aspect-video w-full overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-0">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author?.avatar} alt={post.author?.name || ""} />
              <AvatarFallback>{getInitials(post.author?.name || "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author?.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
          <motion.h3 
            whileHover={{ x: 3 }}
            className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer" 
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {post.title}
          </motion.h3>
          <p className="text-sm text-muted-foreground">
            {truncateText(post.contentPreview || post.content, 100)}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 h-8 ${post.isLiked ? "text-red-500" : ""}`}
              onClick={() => onLike?.(post.id)}
            >
              <Heart size={15} className={post.isLiked ? "fill-red-500" : ""} /> 
              <span className="ml-1 text-xs">{formatCount(likeCount)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8" onClick={() => navigate(`/post/${post.id}#comments-section`)}>
              <MessageSquare size={15} /> 
              <span className="ml-1 text-xs">{formatCount(commentCount)}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 h-8 ${post.isBookmarked ? "text-blue-500" : ""}`}
              onClick={() => onBookmark?.(post.id)}
            >
              <BookmarkIcon size={15} className={post.isBookmarked ? "fill-blue-500" : ""} />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs hover:bg-primary/10 transition-colors"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            Read
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
