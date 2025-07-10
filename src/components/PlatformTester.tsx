'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Play, Loader2 } from 'lucide-react'

interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

interface PlatformTestProps {
  platforms: Platform[]
}

interface TestResult {
  platform: string
  authenticated: boolean
  status: string
  error?: string
  testPost?: {
    success: boolean
    postId?: string
    url?: string
    error?: string
  }
}

export default function PlatformTester({ platforms }: PlatformTestProps) {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})

  const testPlatform = async (platform: Platform, includeTestPost: boolean = false) => {
    setTesting(prev => ({ ...prev, [platform.id]: true }))
    
    try {
      // Test authentication
      const authResponse = await fetch(`/api/test-platform?platform=${platform.id}`)
      const authResult = await authResponse.json()
      
      let testResult: TestResult = {
        platform: platform.name,
        authenticated: authResult.authenticated,
        status: authResult.status,
        error: authResult.error
      }

      if (includeTestPost && authResult.authenticated) {
        // Test posting
        const postResponse = await fetch('/api/test-platform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform: platform.id,
            testPost: true
          })
        })

        const postResult = await postResponse.json()
        testResult.testPost = {
          success: postResult.success,
          postId: postResult.postId,
          url: postResult.url,
          error: postResult.error
        }
      }

      setTestResults(prev => ({ ...prev, [platform.id]: testResult }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [platform.id]: {
          platform: platform.name,
          authenticated: false,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    } finally {
      setTesting(prev => ({ ...prev, [platform.id]: false }))
    }
  }

  const testAllPlatforms = async () => {
    for (const platform of platforms) {
      await testPlatform(platform, false)
    }
  }

  const getStatusIcon = (result: TestResult) => {
    if (result.authenticated) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (result.status === 'error') {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (result: TestResult) => {
    if (result.authenticated) {
      return 'Connected'
    } else if (result.status === 'authentication_required') {
      return 'Authentication Required'
    } else if (result.status === 'error') {
      return 'Error'
    } else {
      return 'Not Tested'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Platform Connection Test
        </h3>
        <button
          onClick={testAllPlatforms}
          disabled={Object.values(testing).some(t => t)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Test All</span>
        </button>
      </div>

      <div className="space-y-4">
        {platforms.map((platform) => {
          const result = testResults[platform.id]
          const isTestingPlatform = testing[platform.id]

          return (
            <div
              key={platform.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                  {platform.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {platform.name}
                  </h4>
                  {result && (
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(result)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusText(result)}
                      </span>
                    </div>
                  )}
                  {result?.error && (
                    <p className="text-xs text-red-500 mt-1">{result.error}</p>
                  )}
                  {result?.testPost && (
                    <div className="mt-2 text-xs">
                      {result.testPost.success ? (
                        <span className="text-green-600">
                          ✓ Test post successful
                          {result.testPost.url && (
                            <a
                              href={result.testPost.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:underline"
                            >
                              View Post
                            </a>
                          )}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ✗ Test post failed: {result.testPost.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => testPlatform(platform, false)}
                  disabled={isTestingPlatform}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  {isTestingPlatform ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Test</span>
                </button>
                {result?.authenticated && (
                  <button
                    onClick={() => testPlatform(platform, true)}
                    disabled={isTestingPlatform}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    {isTestingPlatform ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Test Post</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Test Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-green-600 font-semibold">
                {Object.values(testResults).filter(r => r.authenticated).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Connected</div>
            </div>
            <div>
              <div className="text-yellow-600 font-semibold">
                {Object.values(testResults).filter(r => !r.authenticated && r.status === 'authentication_required').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Need Auth</div>
            </div>
            <div>
              <div className="text-red-600 font-semibold">
                {Object.values(testResults).filter(r => r.status === 'error').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
