'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/contexts/SettingsContext'

export default function DebugPage() {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('test1')
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  // Test 1: Basic Button Click
  const testBasicClick = () => {
    addResult('✅ Basic button click works')
  }

  // Test 2: Router Back
  const testRouterBack = () => {
    try {
      router.back()
      addResult('✅ Router.back() called successfully')
    } catch (error) {
      addResult(`❌ Router.back() failed: ${error}`)
    }
  }

  // Test 3: Router Push
  const testRouterPush = () => {
    try {
      router.push('/')
      addResult('✅ Router.push() called successfully')
    } catch (error) {
      addResult(`❌ Router.push() failed: ${error}`)
    }
  }

  // Test 4: State Update
  const testStateUpdate = () => {
    const newTab = activeTab === 'test1' ? 'test2' : 'test1'
    setActiveTab(newTab)
    addResult(`✅ State updated to: ${newTab}`)
  }

  // Test 5: Settings Context
  const testSettingsContext = () => {
    try {
      if (settings) {
        addResult('✅ Settings context is working')
        addResult(`Current theme: ${settings.appearance?.theme || 'undefined'}`)
      } else {
        addResult('❌ Settings context is null/undefined')
      }
    } catch (error) {
      addResult(`❌ Settings context error: ${error}`)
    }
  }

  // Test 6: API Call
  const testApiCall = async () => {
    try {
      addResult('🔄 Testing API call...')
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: 'https://example.com', 
          enableMarketResearch: false 
        })
      })
      
      if (response.ok) {
        addResult('✅ API endpoint is reachable')
      } else {
        addResult(`⚠️ API responded with status: ${response.status}`)
      }
    } catch (error) {
      addResult(`❌ API call failed: ${error}`)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            🐛 ClickSprout Debug Console
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Controls */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Run Tests
              </h2>
              
              <div className="space-y-3">
                <Button onClick={testBasicClick} className="w-full">
                  Test Basic Click
                </Button>
                
                <Button onClick={testRouterBack} variant="outline" className="w-full">
                  Test Router Back
                </Button>
                
                <Button onClick={testRouterPush} variant="outline" className="w-full">
                  Test Router Push (Home)
                </Button>
                
                <Button onClick={testStateUpdate} variant="secondary" className="w-full">
                  Test State Update (Tab: {activeTab})
                </Button>
                
                <Button onClick={testSettingsContext} variant="secondary" className="w-full">
                  Test Settings Context
                </Button>
                
                <Button onClick={testApiCall} variant="ghost" className="w-full">
                  Test API Call
                </Button>
                
                <Button onClick={clearResults} variant="outline" className="w-full">
                  Clear Results
                </Button>
              </div>
            </div>

            {/* Test Results */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Test Results
              </h2>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center">No tests run yet...</p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="text-sm font-mono p-2 bg-white dark:bg-gray-800 rounded border"
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Test Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Tab Switching Test
            </h2>
            
            <div className="flex space-x-2 mb-4">
              {['test1', 'test2', 'test3'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    console.log('Tab clicked:', tab)
                    setActiveTab(tab)
                    addResult(`Tab switched to: ${tab}`)
                  }}
                  className={`px-4 py-2 rounded ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-blue-800 dark:text-blue-200">
                Active Tab: <strong>{activeTab}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
