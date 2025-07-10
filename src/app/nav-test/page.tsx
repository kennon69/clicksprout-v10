'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NavigationTestPage() {
  const router = useRouter()

  const testBack = () => {
    console.log('Testing router.back()')
    try {
      router.back()
    } catch (error) {
      console.error('Error with router.back():', error)
    }
  }

  const testPush = (path: string) => {
    console.log(`Testing router.push(${path})`)
    try {
      router.push(path)
    } catch (error) {
      console.error(`Error with router.push(${path}):`, error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Navigation Test Page</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Router Navigation</h2>
            <div className="space-y-3">
              <Button onClick={testBack} variant="outline" className="w-full">
                Test router.back()
              </Button>
              <Button onClick={() => testPush('/')} className="w-full">
                Test router.push('/')
              </Button>
              <Button onClick={() => testPush('/settings')} className="w-full">
                Test router.push('/settings')
              </Button>
              <Button onClick={() => testPush('/dashboard')} className="w-full">
                Test router.push('/dashboard')
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Link Navigation</h2>
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button variant="secondary" className="w-full">
                  Link to Home
                </Button>
              </Link>
              <Link href="/settings" className="block">
                <Button variant="secondary" className="w-full">
                  Link to Settings
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="secondary" className="w-full">
                  Link to Dashboard
                </Button>
              </Link>
              <Link href="/submit" className="block">
                <Button variant="secondary" className="w-full">
                  Link to Submit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Button Click Test</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => console.log('Simple button clicked')} 
              className="mr-3"
            >
              Simple Click Test
            </Button>
            <Button 
              onClick={() => alert('Alert button clicked')} 
              variant="outline"
              className="mr-3"
            >
              Alert Test
            </Button>
            <Button 
              onClick={() => {
                const elem = document.getElementById('test-result')
                if (elem) elem.textContent = 'Button click worked!'
              }}
              variant="ghost"
            >
              DOM Update Test
            </Button>
          </div>
          <div id="test-result" className="mt-4 p-3 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  )
}
