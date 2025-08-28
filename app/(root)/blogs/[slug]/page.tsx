import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'
import BlogDetailClient from './blog-detail-client'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPostBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/blog?slug=${slug}`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)
  if (!post) {
    return { title: 'Blog Post Not Found' }
  }
  return {
    title: `${post.title} - ${APP_NAME}`,
    description: post.excerpt || (post.content ? post.content.substring(0, 160) : 'Read our latest blog post'),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getBlogPostBySlug(resolvedParams.slug)
  if (!post) notFound()

  return <BlogDetailClient post={post} />
} 