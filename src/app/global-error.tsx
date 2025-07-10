'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Critical Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Error Content */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Critical Error
              </h1>
              <p className="text-gray-600 mb-6">
                ClickSprout encountered a critical error and needs to restart. We apologize for the inconvenience.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="text-sm font-medium text-gray-900 mb-2">Error Details:</p>
                  <code className="text-xs text-red-600 break-all">
                    {error.message}
                  </code>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Restart Application
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Reload Page
                </button>
              </div>

              {/* Branding */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span className="font-semibold text-gray-900">ClickSprout</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Smart Product Promotion Tool
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
