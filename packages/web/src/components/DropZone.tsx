import React, { ChangeEvent, DragEvent, useRef, useState } from "react"

/**
 * Props for the DropZone component
 */
export interface DropZoneProps {
  /** Callback when file is dropped or selected */
  onDrop: (file: File) => void
  /** Accepted file types (e.g., ['image/png', 'image/jpeg']) */
  acceptedTypes?: string[]
  /** Optional preview component to render */
  preview?: React.ReactNode
  /** Current image URL for preview */
  currentImage?: string
  /** Maximum file size in bytes */
  maxSize?: number
  /** Whether the dropzone is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Error message to display */
  error?: string
}

/**
 * Format bytes to human-readable string
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

/**
 * DropZone Component
 *
 * A drag-and-drop file upload zone with click-to-select functionality.
 * Supports file validation, preview, and error handling.
 *
 * @example
 * ```tsx
 * <DropZone
 *   onDrop={handleFileUpload}
 *   acceptedTypes={['image/png', 'image/jpeg']}
 *   currentImage={imageUrl}
 *   maxSize={5 * 1024 * 1024} // 5MB
 * />
 * ```
 */
export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  acceptedTypes = ["image/*"],
  preview,
  currentImage,
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className = "",
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string>("")

  /**
   * Validate file type and size
   */
  const validateFile = (file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const baseType = type.split("/")[0]
        return file.type.startsWith(baseType + "/")
      }
      return file.type === type
    })

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`
    }

    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatBytes(maxSize)}`
    }

    return null
  }

  /**
   * Handle file selection
   */
  const handleFile = (file: File) => {
    setValidationError("")
    const error = validateFile(file)

    if (error) {
      setValidationError(error)
      return
    }

    onDrop(file)
  }

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  /**
   * Handle click to select file
   */
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const displayError = error || validationError
  const acceptAttribute = acceptedTypes.join(",")

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-400 hover:bg-blue-50"
          }
          ${displayError ? "border-red-500 bg-red-50" : ""}
        `}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload zone"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptAttribute}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          aria-label="File input"
        />

        {currentImage && !preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <div className="mt-3 text-sm text-gray-600">
              Click or drag to replace image
            </div>
          </div>
        ) : preview ? (
          <>{preview}</>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-700 font-medium mb-1">
              {isDragging ? "Drop file here" : "Drag & drop file here"}
            </p>
            <p className="text-gray-500 text-sm mb-2">or click to browse</p>
            <p className="text-xs text-gray-400">
              Max size: {formatBytes(maxSize)}
            </p>
          </div>
        )}
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600 flex items-start" role="alert">
          <svg
            className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  )
}
