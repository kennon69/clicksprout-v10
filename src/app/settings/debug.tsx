'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function DebugSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings Debug Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Settings Debug</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a simple debug page to test if the settings route works without the SettingsContext.
          </p>
          
          <div className="space-y-4">
            <Button>Test Button</Button>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                If you can see this page, the issue is with the SettingsContext, not the route.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
