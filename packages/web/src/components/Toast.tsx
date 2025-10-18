import React, { useEffect, useState } from "react"
import { ToastVariant } from "./types"

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /** Message to display */
  message: string
  /** Toast variant */
  variant?: ToastVariant
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration?: number
  /** Whether the toast is visible */
  isVisible: boolean
  /** Callback when toast is dismissed */
  onDismiss: () => void
}

/**
 * Get variant-specific CSS classes
 */
const getVariantClasses = (variant: ToastVariant): string => {
  const variants: Record<ToastVariant, string> = {
    [ToastVariant.Success]:
      "bg-green-50 border-green-200 text-green-800",
    [ToastVariant.Error]:
      "bg-red-50 border-red-200 text-red-800",
    [ToastVariant.Info]:
      "bg-blue-50 border-blue-200 text-blue-800",
    [ToastVariant.Warning]:
      "bg-yellow-50 border-yellow-200 text-yellow-800",
  }
  return variants[variant]
}

/**
 * Get variant-specific icon
 */
const getVariantIcon = (variant: ToastVariant): React.ReactNode => {
  const icons: Record<ToastVariant, React.ReactNode> = {
    [ToastVariant.Success]: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    [ToastVariant.Error]: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    [ToastVariant.Info]: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    [ToastVariant.Warning]: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }
  return icons[variant]
}

/**
 * Toast Component
 *
 * A notification toast that appears at the top of the screen.
 * Supports auto-dismiss and manual dismissal.
 *
 * @example
 * ```tsx
 * <Toast
 *   message="Story created successfully!"
 *   variant={ToastVariant.Success}
 *   duration={3000}
 *   isVisible={showToast}
 *   onDismiss={() => setShowToast(false)}
 * />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  variant = ToastVariant.Info,
  duration = 3000,
  isVisible,
  onDismiss,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)

      // Auto-dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss()
        }, duration)

        return () => clearTimeout(timer)
      }
    } else {
      setIsAnimating(false)
    }
  }, [isVisible, duration, onDismiss])

  if (!isVisible && !isAnimating) {
    return null
  }

  const variantClasses = getVariantClasses(variant)
  const icon = getVariantIcon(variant)

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ${
        isAnimating && isVisible
          ? "transform translate-y-0 opacity-100"
          : "transform -translate-y-2 opacity-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex items-start p-4 rounded-lg border shadow-lg ${variantClasses}`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

