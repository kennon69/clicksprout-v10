'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SchedulerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Scheduler error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Scheduler Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was a problem with the content scheduler. This might be due to missing content or a temporary issue.
          </p>

          <div className="space-y-3">
            <Button onClick={reset} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/submit')}
              className="w-full"
            >
              Create New Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
