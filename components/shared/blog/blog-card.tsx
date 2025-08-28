import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  authorId: string
  status: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt = post.excerpt || post.content.substring(0, 120) + '...'
  const publishDate = post.publishedAt || post.createdAt
  const isPublished = post.status === 'published'

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300">
        {/* Featured Image */}
        {post.featuredImage ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">NH</span>
              </div>
              <p className="text-sm">Handicraft Story</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Date */}
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {formatDate(publishDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Read More */}
          <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900 transition-colors">
            <span className="font-medium text-sm">Read Story</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  )
}
