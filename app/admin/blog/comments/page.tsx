import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function AdminCommentsPageContent() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-poppins font-bold text-white">Comment Moderation</h1>
            <p className="text-slate-400 font-inter mt-2">Manage and approve user comments</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-slate-600">💬</span>
          </div>
          <h3 className="text-lg font-poppins font-semibold text-white mb-2">Comment Management</h3>
          <p className="text-slate-400 font-inter">Comment management functionality will be available here soon.</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminCommentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminCommentsPageContent />
    </Suspense>
  )
} 
