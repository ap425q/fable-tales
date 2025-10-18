import React, { useState } from "react"
import { ImageVersion } from "../types"

/**
 * Props for the ImageViewer component
 */
export interface ImageViewerProps {
  /** URL of the currently displayed image */
  imageUrl: string | null
  /** Alt text for the image */
  alt: string
  /** Callback when regenerate button is clicked */
  onRegenerate?: () => void
  /** Callback when a version is selected */
  onSelectVersion?: (versionId: string) => void
  /** Array of image versions */
  versions?: ImageVersion[]
  /** Currently selected version ID */
  selectedVersionId?: string
  /** Whether the image is currently being generated */
  loading?: boolean
  /** Optional error message */
  error?: string
  /** Additional CSS classes */
  className?: string
  /** Show version history */
  showVersionHistory?: boolean
}

/**
 * ImageViewer Component
 *
 * Displays an image with zoom capability, version history, and regeneration options.
 * Supports loading states and version selection.
 *
 * @example
 * ```tsx
 * <ImageViewer
 *   imageUrl={sceneImage}
 *   alt="Scene 1"
 *   versions={imageVersions}
 *   selectedVersionId={currentVersionId}
 *   onRegenerate={handleRegenerate}
 *   onSelectVersion={handleSelectVersion}
 *   showVersionHistory
 * />
 * ```
 */
export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  alt,
  onRegenerate,
  onSelectVersion,
  versions = [],
  selectedVersionId,
  loading = false,
  error,
  className = "",
  showVersionHistory = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
  }

  const handleVersionSelect = (versionId: string) => {
    if (onSelectVersion && versionId !== selectedVersionId) {
      onSelectVersion(versionId)
      setImageError(false) // Reset error state when selecting new version
    }
  }

  const hasVersions = versions.length > 0

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main Image Display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-gray-50">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-600 font-medium">Generating image...</p>
            </div>
          </div>
        ) : error || imageError || !imageUrl ? (
          <div className="flex items-center justify-center h-64 bg-gray-50">
            <div className="text-center px-4">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 font-medium mb-1">
                {error || "No image available"}
              </p>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Generate Image
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt}
              onError={handleImageError}
              className={`w-full h-auto object-contain cursor-zoom-in transition-transform duration-200 ${
                isZoomed ? "scale-150" : ""
              }`}
              onClick={handleZoomToggle}
            />

            {/* Zoom indicator */}
            <button
              onClick={handleZoomToggle}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isZoomed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                )}
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!loading && onRegenerate && (
        <div className="mt-3">
          <button
            onClick={onRegenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Regenerate
          </button>
        </div>
      )}

      {/* Version History */}
      {showVersionHistory && hasVersions && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Version History ({versions.length})
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {versions.map((version, index) => (
              <button
                key={version.versionId}
                onClick={() => handleVersionSelect(version.versionId)}
                className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  version.versionId === selectedVersionId
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                aria-label={`Version ${versions.length - index}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={version.url}
                  alt={`Version ${versions.length - index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-0.5 text-center">
                  v{versions.length - index}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
