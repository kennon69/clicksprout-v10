'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SubmitTestPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTest = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Testing with URL:', url)
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          enableMarketResearch: false,
          saveToDatabase: false 
        })
      })

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape')
      }

      setResult(data)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Submit Test Page</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test URL:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <Button 
              onClick={handleTest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Scraping'}
            </Button>
            
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-green-100 border border-green-400 rounded">
                <h3 className="font-semibold mb-2">Success! Scraped Data:</h3>
                <pre className="text-sm overflow-auto bg-white p-2 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
