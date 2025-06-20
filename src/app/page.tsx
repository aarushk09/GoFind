import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-gray-900">GoFind</span>
        </div>
        <div className="fixed top-0 right-0 p-4 lg:static lg:p-0">
          <div className="flex space-x-4">
            <Link
              href="/auth/login"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Host Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center text-center max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="text-6xl">🤖</div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Scavenger Hunt
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Create interactive scavenger hunts powered by AI. Like Kahoot, but for real-world exploration and discovery!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Create Your First Hunt
          </Link>
          <Link
            href="/join"
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Join a Hunt
          </Link>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-6">
        <div className="group rounded-xl border border-purple-200 bg-white px-6 py-8 transition-all hover:border-purple-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Create Rooms
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Set up interactive scavenger hunt rooms with custom challenges and AI-powered clues.
          </p>
        </div>

        <div className="group rounded-xl border border-blue-200 bg-white px-6 py-8 transition-all hover:border-blue-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            AI-Powered Hints
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Get intelligent clues and hints that adapt to player progress and location.
          </p>
        </div>

        <div className="group rounded-xl border border-green-200 bg-white px-6 py-8 transition-all hover:border-green-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Real-time Play
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Watch teams compete in real-time with live leaderboards and instant feedback.
          </p>
        </div>

        <div className="group rounded-xl border border-yellow-200 bg-white px-6 py-8 transition-all hover:border-yellow-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Analytics & Insights
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Track performance, engagement, and learning outcomes with detailed analytics.
          </p>
        </div>
      </div>
    </main>
  )
}










