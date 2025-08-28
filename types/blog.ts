// Blog types for the enhanced blog store

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  authorId: string
  featuredImage?: string
  status: 'draft' | 'published'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateBlogPostInput {
  title: string
  content: string
  excerpt?: string
  authorId: string
  featuredImage?: string
  status?: 'draft' | 'published'
}

export interface UpdateBlogPostInput {
  title?: string
  content?: string
  excerpt?: string
  authorId?: string
  featuredImage?: string
  status?: 'draft' | 'published'
}

export interface BlogComment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentInput {
  postId: string
  authorName: string
  authorEmail: string
  content: string
}
