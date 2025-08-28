import { redirect } from 'next/navigation'
import { deleteComment } from '@/lib/actions/blog.actions'

export default async function DeleteCommentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  await deleteComment(resolvedParams.id)
  redirect('/admin/blog')
} 