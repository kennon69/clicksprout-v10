'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default function EditorPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Editor</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This is a test version of the editor to check if DashboardLayout works with @ alias.
            </p>
            <button
              onClick={() => router.push('/submit')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Submit Page
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
