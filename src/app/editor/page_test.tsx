'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Calendar, RefreshCw, Upload } from 'lucide-react'

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
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<number>(0)

  useEffect(() => {
    const loadContentData = async () => {
      try {
        const savedContent = localStorage.getItem('currentContent')
        if (savedContent) {
          const parsed = JSON.parse(savedContent)
          setContentData(parsed)
          setIsLoading(false)
          return
        }

        const scrapedData = localStorage.getItem('scrapedData')
        if (scrapedData) {
          const parsed = JSON.parse(scrapedData)
          console.log('Loading scraped data:', parsed)

          let generatedContent = ''
          let hashtags: string[] = []

          try {
            console.log('Generating AI content for scraped data...')
            const generateResponse = await fetch('/api/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: parsed.title,
                description: parsed.description,
                url: parsed.url,
                type: 'complete'
              }),
            })

            if (generateResponse.ok) {
              const generated = await generateResponse.json()
              generatedContent = generated.generatedContent || generated.content || ''
              hashtags = generated.hashtags || []
              console.log('AI content generated successfully')
            }
          } catch (error) {
            console.error('Failed to generate AI content:', error)
          }

          const editorData: ContentData = {
            id: `content-${Date.now()}`,
            url: parsed.url,
            title: parsed.title || 'Untitled Product',
            description: parsed.description || '',
            content: generatedContent,
            price: parsed.price,
            images: parsed.images || [],
            videos: parsed.videos || [],
            hashtags: hashtags,
            createdAt: new Date().toISOString()
          }

          setContentData(editorData)
          localStorage.setItem('currentContent', JSON.stringify(editorData))
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

    const now = Date.now()
    if (now - lastSaveTime < 2000) {
      console.log('Save prevented: too frequent')
      return
    }

    setIsSaving(true)
    setLastSaveTime(now)
    
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading editor...</span>
      </div>
    )
  }

  if (!contentData) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Content to Edit</h1>
          <p className="text-gray-600 mb-6">
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
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
                <p className="text-gray-600">Edit and optimize your content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product URL
              </label>
              <p className="text-sm text-blue-600 truncate">
                {contentData.url}
              </p>
            </div>
            {contentData.price && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <p className="text-sm text-gray-900 font-semibold">
                  {contentData.price}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={contentData.title}
                onChange={(e) => updateContentData({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={contentData.description}
                onChange={(e) => updateContentData({ description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {contentData.images && contentData.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {contentData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
