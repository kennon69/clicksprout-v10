'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/contexts/SettingsContext'
import { ArrowLeft, Save } from 'lucide-react'

export default function SimpleSettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, saveSettings, hasUnsavedChanges } = useSettings()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSettings()
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings('profile', 'name', e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings('profile', 'email', e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Simple Settings
            </h1>
          </div>
          
          {hasUnsavedChanges && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>

        {/* Settings Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Has unsaved changes: {hasUnsavedChanges ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current name: {settings.profile.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current email: {settings.profile.email}
            </p>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <Button onClick={handleSave} disabled={saving}>
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                updateSettings('profile', 'name', 'Test User')
                updateSettings('profile', 'email', 'test@example.com')
              }}
            >
              Fill Test Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
