import React from "react"
import { SpinnerColor, SpinnerSize } from "./types"

/**
 * Props for the LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize
  /** Color of the spinner */
  color?: SpinnerColor
  /** Optional loading message to display */
  message?: string
  /** Center the spinner in its container */
  centered?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Get size-specific CSS classes
 */
const getSizeClasses = (size: SpinnerSize): string => {
  const sizes: Record<SpinnerSize, string> = {
    [SpinnerSize.Small]: "w-4 h-4",
    [SpinnerSize.Medium]: "w-8 h-8",
    [SpinnerSize.Large]: "w-12 h-12",
    [SpinnerSize.XLarge]: "w-16 h-16",
  }
  return sizes[size]
}

/**
 * Get color-specific CSS classes
 */
const getColorClasses = (color: SpinnerColor): string => {
  const colors: Record<SpinnerColor, string> = {
    [SpinnerColor.Primary]: "text-blue-600",
    [SpinnerColor.Secondary]: "text-gray-600",
    [SpinnerColor.White]: "text-white",
    [SpinnerColor.Gray]: "text-gray-400",
  }
  return colors[color]
}

/**
 * Get message size based on spinner size
 */
const getMessageSizeClasses = (size: SpinnerSize): string => {
  const sizes: Record<SpinnerSize, string> = {
    [SpinnerSize.Small]: "text-sm",
    [SpinnerSize.Medium]: "text-base",
    [SpinnerSize.Large]: "text-lg",
    [SpinnerSize.XLarge]: "text-xl",
  }
  return sizes[size]
}

/**
 * LoadingSpinner Component
 *
 * An animated loading spinner with optional message text.
 * Supports multiple sizes and colors for various contexts.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size={SpinnerSize.Medium} message="Loading..." />
 *
 * <LoadingSpinner size={SpinnerSize.Large} color={SpinnerColor.Primary} centered />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = SpinnerSize.Medium,
  color = SpinnerColor.Primary,
  message,
  centered = false,
  className = "",
}) => {
  const sizeClasses = getSizeClasses(size)
  const colorClasses = getColorClasses(color)
  const messageSizeClasses = getMessageSizeClasses(size)

  const containerClasses = centered
    ? "flex flex-col items-center justify-center"
    : "inline-flex flex-col items-center"

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        className={`animate-spin ${sizeClasses} ${colorClasses}`}
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
      {message && (
        <p className={`mt-3 ${messageSizeClasses} ${colorClasses} font-medium`}>
          {message}
        </p>
      )}
      <span className="sr-only">{message || "Loading..."}</span>
    </div>
  )
}
