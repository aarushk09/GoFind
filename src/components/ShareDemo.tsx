'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ShareDemoProps {
  shareUrl: string
  gameTitle: string
}

export default function ShareDemo({ shareUrl, gameTitle }: ShareDemoProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl">🔗</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shareable Link Created!
          </h3>
          <p className="text-gray-600 mb-4">
            Your results for &quot;{gameTitle}&quot; can now be shared with anyone. 
            They don&apos;t need to sign in to view the results.
          </p>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-700 flex-1 mr-3 truncate">
                {shareUrl}
              </code>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                }`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={shareUrl}
              target="_blank"
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              👁️ Preview
            </Link>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm font-medium"
            >
              📤 Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
