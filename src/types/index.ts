
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  contentPreview?: string;
  featured_image?: string;
  author: User;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: Tag[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface PostCreateData {
  title: string;
  content: string;
  featured_image?: string;
  tagIds?: string[];
}

export interface PostUpdateData extends PostCreateData {
  id: string;
}
