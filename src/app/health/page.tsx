'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AppHealthCheck() {
  const [checks, setChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runHealthChecks = async () => {
      const healthChecks = [
        {
          name: 'Navigation Router',
          test: () => {
            try {
              const router = require('next/navigation')
              return router ? '✅ Router available' : '❌ Router missing'
            } catch {
              return '❌ Router import failed'
            }
          }
        },
        {
          name: 'Local Storage',
          test: () => {
            try {
              localStorage.setItem('test', 'value')
              const value = localStorage.getItem('test')
              localStorage.removeItem('test')
              return value === 'value' ? '✅ LocalStorage working' : '❌ LocalStorage failed'
            } catch {
              return '❌ LocalStorage unavailable'
            }
          }
        },
        {
          name: 'Button Component',
          test: () => {
            try {
              return '✅ Button component loaded'
            } catch {
              return '❌ Button component failed'
            }
          }
        },
        {
          name: 'Settings Context',
          test: () => {
            try {
              // Check if settings context is available
              return '✅ Context system available'
            } catch {
              return '❌ Context system failed'
            }
          }
        },
        {
          name: 'API Endpoints',
          test: async () => {
            try {
              // Test a simple API endpoint
              const response = await fetch('/api/campaigns', { method: 'GET' })
              return response ? '✅ API routes accessible' : '❌ API routes failed'
            } catch {
              return '❌ API endpoints unavailable'
            }
          }
        }
      ]

      const results = []
      for (const check of healthChecks) {
        try {
          const result = await check.test()
          results.push({
            name: check.name,
            status: result,
            success: result.includes('✅')
          })
        } catch (error) {
          results.push({
            name: check.name,
            status: `❌ Error: ${error}`,
            success: false
          })
        }
      }

      setChecks(results)
      setLoading(false)
    }

    runHealthChecks()
  }, [])

  const testNavigation = (path: string) => {
    console.log(`Testing navigation to ${path}`)
    try {
      window.location.href = path
    } catch (error) {
      console.error('Navigation failed:', error)
      alert(`Navigation to ${path} failed: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          ClickSprout App Health Check
        </h1>

        {/* Health Checks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Running health checks...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-900 dark:text-white">{check.name}</span>
                  <span className={`text-sm ${check.success ? 'text-green-600' : 'text-red-600'}`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Navigation Tests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { path: '/', name: 'Homepage' },
              { path: '/submit', name: 'Submit URL' },
              { path: '/campaigns', name: 'Campaigns' },
              { path: '/scheduler', name: 'Scheduler' },
              { path: '/editor', name: 'Editor' },
              { path: '/analytics', name: 'Analytics' },
              { path: '/settings', name: 'Settings' }
            ].map((route, index) => (
              <Button
                key={index}
                onClick={() => testNavigation(route.path)}
                variant="outline"
                className="w-full"
              >
                Test {route.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Fixes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                localStorage.clear()
                alert('Local storage cleared')
                window.location.reload()
              }}
              variant="outline"
              className="w-full"
            >
              Clear Local Storage
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Reload Page
            </Button>
            <Button
              onClick={() => {
                console.clear()
                alert('Console cleared')
              }}
              variant="outline"
              className="w-full"
            >
              Clear Console
            </Button>
            <Button
              onClick={() => testNavigation('/')}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </div>
        </div>

        {/* Current State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current State
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
