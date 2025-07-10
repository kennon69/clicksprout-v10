export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ClickSprout v1.0
        </h1>
        <p className="text-gray-600 mb-8">
          Transform product links into viral content
        </p>
        <div className="space-x-4">
          <a 
            href="/submit"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </a>
          <a 
            href="/campaigns"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </a>
          <a 
            href="/settings"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  )
}
