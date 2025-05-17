
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { formatDate, truncateText } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { BookmarkIcon, Heart, MessageSquare } from "lucide-react";

interface FeaturedPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export function FeaturedPost({ post, onLike, onBookmark }: FeaturedPostProps) {
  const navigate = useNavigate();
  
  // Ensure likes is always a number
  const likeCount = typeof post.likes === 'number' ? post.likes : 0;
  const commentCount = typeof post.comments === 'number' ? post.comments : 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {post.featured_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="hover:text-blue-500 cursor-pointer text-2xl" onClick={() => navigate(`/post/${post.id}`)}>
          {post.title}
        </CardTitle>
        <div className="flex items-center space-x-2 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author?.avatar} alt={post.author?.name || ""} />
            <AvatarFallback>{getInitials(post.author?.name || "")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author?.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {truncateText(post.contentPreview || post.content, 150)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 ${post.isLiked ? "text-red-500" : ""}`}
            onClick={() => onLike?.(post.id)}
          >
            <Heart size={16} className={post.isLiked ? "fill-red-500" : ""} /> {likeCount}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate(`/post/${post.id}#comments-section`)}
          >
            <MessageSquare size={16} /> {commentCount}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={post.isBookmarked ? "text-blue-500" : ""}
            onClick={() => onBookmark?.(post.id)}
          >
            <BookmarkIcon size={16} className={post.isBookmarked ? "fill-blue-500" : ""} />
          </Button>
        </div>
        <Button variant="ghost" onClick={() => navigate(`/post/${post.id}`)}>
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
