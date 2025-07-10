'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/contexts/SettingsContext'
import { 
  Settings, 
  User, 
  Key, 
  Palette, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Image,
  X,
  Check,
  Trash2,
  ArrowLeft
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  
  const { 
    settings, 
    updateSettings, 
    updateNestedSettings, 
    saveSettings, 
    resetSettings, 
    exportSettings, 
    importSettings,
    uploadLogo,
    uploadFavicon,
    resetLogo,
    resetFavicon,
    hasUnsavedChanges,
    isLoading
  } = useSettings()
  
  const [activeTab, setActiveTab] = useState<string>('branding')
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      await uploadLogo(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) {
        logoInputRef.current.value = ''
      }
    }
  }

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFavicon(true)
    try {
      await uploadFavicon(file)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload favicon')
    } finally {
      setUploadingFavicon(false)
      if (faviconInputRef.current) {
        faviconInputRef.current.value = ''
      }
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
    
    if (importInputRef.current) {
      importInputRef.current.value = ''
    }
  }

  const tabs = [
    { id: 'branding', name: 'Branding', icon: Image },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'apiKeys', name: 'API Keys', icon: Key },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Back Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-4 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Settings className="w-8 h-8 mr-3 text-blue-600" />
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your ClickSprout preferences and configuration
                </p>
              </div>
            </div>
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-3">
                <span className="text-orange-600 dark:text-orange-400 text-sm">
                  You have unsaved changes
                </span>
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSettings}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                
                <div>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => importInputRef.current?.click()}
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              
              {/* BRANDING TAB - PRIMARY FEATURE */}
              {activeTab === 'branding' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Branding & Logo</h2>
                  
                  <div className="space-y-8">
                    {/* Logo Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Logo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload your custom logo to replace the default ClickSprout logo in the sidebar and header.
                      </p>
                      
                      <div className="flex items-start space-x-6">
                        {/* Logo Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {settings.branding?.useCustomLogo && settings.branding?.customLogo ? (
                              <img 
                                src={settings.branding.customLogo} 
                                alt="Custom Logo"
                                className="w-20 h-20 object-contain"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">C</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Logo Controls */}
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                              <Button
                                onClick={() => logoInputRef.current?.click()}
                                disabled={uploadingLogo}
                                className="flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                              </Button>
                            </div>
                            
                            {settings.branding?.useCustomLogo && (
                              <Button
                                variant="outline"
                                onClick={resetLogo}
                                className="flex items-center text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Logo
                              </Button>
                            )}
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Requirements:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Supported formats: PNG, JPG, GIF, SVG</li>
                              <li>Maximum file size: 2MB</li>
                              <li>Recommended size: 32x32px to 256x256px</li>
                              <li>Square aspect ratio preferred</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Favicon Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Favicon</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Upload a custom favicon to replace the default browser tab icon.
                      </p>
                      
                      <div className="flex items-start space-x-6">
                        {/* Favicon Preview */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                            {settings.branding?.useCustomFavicon && settings.branding?.customFavicon ? (
                              <img 
                                src={settings.branding.customFavicon} 
                                alt="Custom Favicon"
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">C</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Favicon Controls */}
                        <div className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <input
                                ref={faviconInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFaviconUpload}
                                className="hidden"
                              />
                              <Button
                                onClick={() => faviconInputRef.current?.click()}
                                disabled={uploadingFavicon}
                                className="flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                              </Button>
                            </div>
                            
                            {settings.branding?.useCustomFavicon && (
                              <Button
                                variant="outline"
                                onClick={resetFavicon}
                                className="flex items-center text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Favicon
                              </Button>
                            )}
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Requirements:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Supported formats: PNG, ICO preferred</li>
                              <li>Maximum file size: 1MB</li>
                              <li>Recommended size: 16x16px or 32x32px</li>
                              <li>Square aspect ratio required</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs for completeness */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'apiKeys' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">API Keys</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        OpenAI API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKeys.openai ? 'text' : 'password'}
                          value={settings.apiKeys.openai}
                          onChange={(e) => updateSettings('apiKeys', 'openai', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="sk-..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showApiKeys.openai ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                  
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
                            <div className={`w-6 h-6 rounded-full ${scheme.color}`}>
                              {settings.appearance.colorScheme === scheme.name && (
                                <Check className="w-6 h-6 text-white" />
                              )}
                            </div>
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

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Settings</h2>
                  
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
                    {/* Privacy Toggles */}
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

                    {/* Data Retention */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Data Retention Period
                      </label>
                      <select
                        value={settings.privacy.dataRetention}
                        onChange={(e) => updateSettings('privacy', 'dataRetention', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

                    {/* Danger Zone */}
                    <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                      <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        This action will permanently delete all your data and cannot be undone.
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All Data
                      </Button>
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
