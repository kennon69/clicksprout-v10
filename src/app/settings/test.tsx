'use client'

import React from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'

export default function SettingsTestPage() {
  const { 
    settings, 
    updateSettings, 
    saveSettings, 
    hasUnsavedChanges 
  } = useSettings()

  const testFunction = () => {
    console.log('Test button clicked!')
    console.log('Current settings:', settings)
    updateSettings('profile', 'name', 'Test User')
    console.log('Updated name to Test User')
  }

  const testSave = async () => {
    console.log('Save button clicked!')
    try {
      await saveSettings()
      console.log('Settings saved successfully!')
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings Test Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <pre className="text-sm">{JSON.stringify(settings, null, 2)}</pre>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
            <div className="space-x-4">
              <Button onClick={testFunction}>
                Test Update Settings
              </Button>
              <Button onClick={testSave} variant="outline">
                Test Save Settings
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Has unsaved changes: {hasUnsavedChanges ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current name: {settings.profile.name}
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            Open browser console (F12) to see function logs.
          </div>
        </div>
      </div>
    </div>
  )
}
