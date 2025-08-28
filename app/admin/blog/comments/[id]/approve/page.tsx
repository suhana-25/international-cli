import { redirect } from 'next/navigation'
import { approveComment } from '@/lib/actions/blog.actions'

export default async function ApproveCommentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  await approveComment(resolvedParams.id)
  redirect('/admin/blog')
} 