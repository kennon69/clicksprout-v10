'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft, Save, Upload } from 'lucide-react'

interface ContentData {
  id: string
  url: string
  title: string
  description: string
  content: string
  price?: string
  images: string[]
  videos?: string[]
  hashtags: string[]
  createdAt: string
  updatedAt?: string
}

export default function EditorPage() {
  const router = useRouter()
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadContentData = async () => {
      try {
        const savedContent = localStorage.getItem('currentContent')
        if (savedContent) {
          const parsed = JSON.parse(savedContent)
          setContentData(parsed)
        }
      } catch (error) {
        console.error('Error loading content data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContentData()
  }, [])

  const handleSave = async () => {
    if (!contentData || isSaving) return

    setIsSaving(true)
    
    try {
      const updatedData = {
        ...contentData,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem('currentContent', JSON.stringify(updatedData))
      setContentData(updatedData)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateContentData = (updates: Partial<ContentData>) => {
    if (!contentData) return
    
    const updatedData = {
      ...contentData,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    setContentData(updatedData)
    localStorage.setItem('currentContent', JSON.stringify(updatedData))
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading editor...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!contentData) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Content to Edit</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please submit a product link first to generate content that you can edit.
            </p>
            <button 
              onClick={() => router.push('/submit')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Submit Product Link</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Editor</h1>
                  <p className="text-gray-600 dark:text-gray-400">Edit and optimize your content</p>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product URL
                </label>
                <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                  {contentData.url}
                </p>
              </div>
              {contentData.price && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white font-semibold">
                    {contentData.price}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={contentData.title}
                  onChange={(e) => updateContentData({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={contentData.description}
                  onChange={(e) => updateContentData({ description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={contentData.hashtags.join(' ')}
                  onChange={(e) => updateContentData({ hashtags: e.target.value.split(' ').filter(tag => tag.length > 0) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter hashtags separated by spaces"
                />
              </div>
            </div>
          </div>

          {contentData.images && contentData.images.length > 0 && (
            <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contentData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => {
                          const newImages = contentData.images.filter((_, i) => i !== index)
                          updateContentData({ images: newImages })
                        }}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Upload</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  files.forEach(file => {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const imageUrl = event.target?.result as string
                      updateContentData({
                        images: [...(contentData.images || []), imageUrl]
                      })
                    }
                    reader.readAsDataURL(file)
                  })
                }}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Click to upload images or drag and drop
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
