"use client"

import { useParams } from "next/navigation"

/**
 * Story Tree Editing Page
 *
 * This page will allow parents to edit the story tree structure,
 * modify nodes, add/delete scenes, and manage choices.
 *
 * @todo Implement story tree visualization and editing features
 */
export default function StoryTreePage() {
  const params = useParams()
  const storyId = params.storyId as string

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Story Tree Editor
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600">
            Story ID: <span className="font-mono font-semibold">{storyId}</span>
          </p>
          <p className="text-gray-500 mt-4">
            Story tree editing interface coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
