'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function TestButtons() {
  const handleTestClick = (destination: string) => {
    console.log(`🔥 Test button clicked: ${destination}`)
    alert(`Button clicked: ${destination}`)
    // Force navigation
    window.location.href = destination
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Button Test Page
        </h1>
        <div className="space-y-4">
          <Button 
            onClick={() => handleTestClick('/submit')}
            className="w-full"
          >
            Test Submit Button
          </Button>
          <Button 
            onClick={() => handleTestClick('/campaigns')}
            variant="secondary"
            className="w-full"
          >
            Test Campaigns Button
          </Button>
          <Button 
            onClick={() => handleTestClick('/scheduler')}
            variant="outline"
            className="w-full"
          >
            Test Scheduler Button
          </Button>
          <Button 
            onClick={() => handleTestClick('/analytics')}
            variant="ghost"
            className="w-full"
          >
            Test Analytics Button
          </Button>
        </div>
      </div>
    </div>
  )
}
