// Test import of DashboardLayout
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowLeft } from 'lucide-react'

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1>Test Page</h1>
        <ArrowLeft className="w-5 h-5" />
      </div>
    </DashboardLayout>
  )
}
