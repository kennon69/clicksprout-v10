'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function EditorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Editor</h1>
            <p className="text-gray-600 mb-6">
              This is a minimal version of the editor to test if the build works.
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
    </div>
  )
}
