import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/lib/actions/blog.actions'
import { APP_NAME } from '@/lib/constants'
import BlogEditForm from './blog-edit-form'

interface BlogEditPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: `Edit Blog Post - ${APP_NAME}`,
}

export default async function BlogEditPage({ params }: BlogEditPageProps) {
  const resolvedParams = await params
  const post = await getBlogPostById(resolvedParams.id)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground">
          Update your blog post content and settings.
        </p>
      </div>
      
      <BlogEditForm post={post} />
    </div>
  )
} 