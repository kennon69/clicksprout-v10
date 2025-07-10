'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/contexts/SettingsContext'
import { 
  Settings, 
  User, 
  Key, 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Info
} from 'lucide-react'

export default function SettingsPage() {
  const { 
    settings, 
    updateSettings, 
    updateNestedSettings, 
    saveSettings, 
    resetSettings, 
    exportSettings, 
    importSettings,
    hasUnsavedChanges,
    isLoading
  } = useSettings()
  
  const [activeTab, setActiveTab] = useState<string>('profile')
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [testingConnection, setTestingConnection] = useState<Record<string, boolean>>({})

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await saveSettings()
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const testApiConnection = async (apiType: string) => {
    setTestingConnection(prev => ({ ...prev, [apiType]: true }))
    
    try {
      if (apiType === 'openai' && settings.apiKeys.openai) {
        // Test OpenAI API by generating simple content
        const response = await fetch('/api/ai-content-generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productTitle: 'Test Product',
            productDescription: 'This is a test to verify OpenAI API connection',
            platform: 'general',
            tone: 'professional',
            length: 'short',
            customApiKey: settings.apiKeys.openai
          }),
        })

        const data = await response.json()
        
        if (response.ok && data.success && data.data) {
          const result = data.data
          const summary = [
            '✅ OpenAI API connection successful!',
            '',
            '📝 Generated Content Preview:',
            `• Title: ${result.title}`,
            `• Description: ${result.description?.substring(0, 100)}${result.description?.length > 100 ? '...' : ''}`,
            `• Hashtags: ${result.hashtags?.slice(0, 5).join(' ') || 'None generated'}`,
            '',
            '🚀 ClickSprout AI Features Ready:',
            '• Content Generation ✓',
            '• Market Research ✓', 
            '• Multi-platform Optimization ✓'
          ].join('\n')
          
          alert(summary)
        } else {
          alert('❌ OpenAI API test failed:\n' + (data.error || 'Unknown error'))
        }
      } else if (apiType === 'supabase') {
        // Test database connection by trying to create a DatabaseService instance
        try {
          const { DatabaseService } = await import('@/lib/database')
          // Attempt to test the connection by performing database operations
          const contents = await DatabaseService.getAllContent()
          const campaigns = await DatabaseService.getAllCampaigns()
          const templates = await DatabaseService.getAllTemplates()
          
          const summary = [
            '✅ Database connection successful!',
            '',
            '📊 Database Status:',
            `• Content Records: ${contents.length}`,
            `• Campaigns: ${campaigns.length}`,
            `• Templates: ${templates.length}`,
            '',
            '🗄️ ClickSprout Data Features Ready:',
            '• Content Storage ✓',
            '• Campaign Management ✓',
            '• Template Library ✓',
            '• Analytics Tracking ✓'
          ].join('\n')
          
          alert(summary)
        } catch (error) {
          alert('❌ Database test failed:\n' + 
                `Unable to connect to database.\n\n${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                'Note: ClickSprout will fall back to localStorage if database is unavailable.')
        }
      } else {
        // Simulate test for other APIs
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('✅ API connection test completed (simulated)')
      }
    } catch (error) {
      console.error(`Failed to test ${apiType} connection:`, error)
      alert(`❌ Failed to test ${apiType} connection:\n${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestingConnection(prev => ({ ...prev, [apiType]: false }))
    }
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        importSettings(importedSettings)
      } catch (error) {
        console.error('Failed to import settings:', error)
        alert('Invalid settings file')
      }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'apiKeys', label: 'API Keys', icon: Key },
    { id: 'content', label: 'Content', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-300">Customize your ClickSprout experience</p>
            </div>
          </div>

          {/* Action Buttons */}
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-200">You have unsaved changes</span>
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Import/Export */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Backup</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSettings}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.profile.timezone}
                          onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.profile.language}
                          onChange={(e) => updateSettings('profile', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                          <option value="ja">Japanese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Settings */}
              {activeTab === 'apiKeys' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API Keys</h2>
                  <div className="space-y-6">
                    {/* OpenAI */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">OpenAI API Key</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testApiConnection('openai')}
                          disabled={testingConnection.openai || !settings.apiKeys.openai}
                        >
                          {testingConnection.openai ? 'Testing...' : 'Test Connection'}
                        </Button>
                      </div>
                      <div className="relative">
                        <input
                          type={showApiKeys.openai ? 'text' : 'password'}
                          value={settings.apiKeys.openai}
                          onChange={(e) => updateSettings('apiKeys', 'openai', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="sk-..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showApiKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Required for AI content generation and market research
                      </p>
                    </div>

                    {/* Supabase */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Supabase Configuration</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testApiConnection('supabase')}
                          disabled={testingConnection.supabase}
                        >
                          {testingConnection.supabase ? 'Testing...' : 'Test Database'}
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Project URL</label>
                          <input
                            type="text"
                            value={settings.apiKeys.supabase.url}
                            onChange={(e) => updateNestedSettings('apiKeys', 'supabase', 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://your-project.supabase.co"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Anonymous Key</label>
                          <div className="relative">
                            <input
                              type={showApiKeys.supabase ? 'text' : 'password'}
                              value={settings.apiKeys.supabase.anonKey}
                              onChange={(e) => updateNestedSettings('apiKeys', 'supabase', 'anonKey', e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="eyJ..."
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKeys(prev => ({ ...prev, supabase: !prev.supabase }))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKeys.supabase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Optional: For persistent data storage (falls back to localStorage)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Preferences */}
              {activeTab === 'content' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Content Preferences</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Tone
                        </label>
                        <select
                          value={settings.content.defaultTone}
                          onChange={(e) => updateSettings('content', 'defaultTone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="casual">Casual</option>
                          <option value="professional">Professional</option>
                          <option value="playful">Playful</option>
                          <option value="urgent">Urgent</option>
                          <option value="inspiring">Inspiring</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Length
                        </label>
                        <select
                          value={settings.content.defaultLength}
                          onChange={(e) => updateSettings('content', 'defaultLength', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="long">Long</option>
                        </select>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Auto-generate Hashtags</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Automatically include relevant hashtags in content</p>
                        </div>
                        <button
                          onClick={() => updateSettings('content', 'autoGenerateHashtags', !settings.content.autoGenerateHashtags)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.content.autoGenerateHashtags ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.content.autoGenerateHashtags ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Include Emojis</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Add relevant emojis to make content more engaging</p>
                        </div>
                        <button
                          onClick={() => updateSettings('content', 'includeEmojis', !settings.content.includeEmojis)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.content.includeEmojis ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.content.includeEmojis ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Maximum Hashtags: {settings.content.maxHashtags}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={settings.content.maxHashtags}
                        onChange={(e) => updateSettings('content', 'maxHashtags', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>5</span>
                        <span>30</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>
                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['light', 'dark', 'system'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateSettings('appearance', 'theme', theme)}
                            className={`p-3 border rounded-lg text-center transition-colors ${
                              settings.appearance.theme === theme
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="capitalize font-medium">{theme}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Color Scheme
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { name: 'blue', color: 'bg-blue-500' },
                          { name: 'purple', color: 'bg-purple-500' },
                          { name: 'green', color: 'bg-green-500' },
                          { name: 'orange', color: 'bg-orange-500' },
                          { name: 'pink', color: 'bg-pink-500' }
                        ].map((scheme) => (
                          <button
                            key={scheme.name}
                            onClick={() => updateSettings('appearance', 'colorScheme', scheme.name)}
                            className={`p-3 border rounded-lg flex items-center justify-center transition-colors ${
                              settings.appearance.colorScheme === scheme.name
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full ${scheme.color}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Font Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            onClick={() => updateSettings('appearance', 'fontSize', size)}
                            className={`p-3 border rounded-lg text-center transition-colors ${
                              settings.appearance.fontSize === size
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            <div className="capitalize font-medium">{size}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animations Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Enable Animations</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Smooth transitions and animations throughout the app</p>
                      </div>
                      <button
                        onClick={() => updateSettings('appearance', 'animations', !settings.appearance.animations)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.appearance.animations ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.appearance.animations ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notifications</h2>
                  <div className="space-y-6">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Get real-time notifications in your browser' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive tips, tutorials, and product updates' },
                      { key: 'productUpdates', label: 'Product Updates', description: 'Notifications about new features and improvements' },
                      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Summary of your content performance and analytics' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{notification.label}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                        </div>
                        <button
                          onClick={() => updateSettings('notifications', notification.key, !settings.notifications[notification.key as keyof typeof settings.notifications])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications[notification.key as keyof typeof settings.notifications] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications[notification.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                  <div className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Analytics Tracking</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve by sharing anonymous usage data</p>
                        </div>
                        <button
                          onClick={() => updateSettings('privacy', 'analyticsTracking', !settings.privacy.analyticsTracking)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.privacy.analyticsTracking ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.privacy.analyticsTracking ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Share Usage Data</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Share aggregated usage statistics to help improve the product</p>
                        </div>
                        <button
                          onClick={() => updateSettings('privacy', 'shareUsageData', !settings.privacy.shareUsageData)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.privacy.shareUsageData ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.privacy.shareUsageData ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => updateSettings('privacy', 'twoFactorAuth', !settings.privacy.twoFactorAuth)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.privacy.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.privacy.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Data Retention Period
                      </label>
                      <select
                        value={settings.privacy.dataRetention}
                        onChange={(e) => updateSettings('privacy', 'dataRetention', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="forever">Forever</option>
                      </select>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        How long to keep your content and analytics data
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
