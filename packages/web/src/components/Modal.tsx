import React, { useCallback, useEffect, useRef } from "react"
import { ModalSize } from "./types"

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal content */
  children: React.ReactNode
  /** Optional footer content (typically action buttons) */
  footer?: React.ReactNode
  /** Modal size */
  size?: ModalSize
  /** Whether to close on backdrop click */
  closeOnBackdropClick?: boolean
  /** Whether to close on Escape key */
  closeOnEscape?: boolean
  /** Additional CSS classes for modal content */
  className?: string
  /** Whether to show close button */
  showCloseButton?: boolean
}

/**
 * Get size-specific CSS classes
 */
const getSizeClasses = (size: ModalSize): string => {
  const sizes: Record<ModalSize, string> = {
    [ModalSize.Small]: "max-w-md",
    [ModalSize.Medium]: "max-w-lg",
    [ModalSize.Large]: "max-w-2xl",
    [ModalSize.XLarge]: "max-w-4xl",
  }
  return sizes[size]
}

/**
 * Modal Component
 *
 * An accessible modal dialog with backdrop, focus trapping, and keyboard support.
 * Supports various sizes and customizable content.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   footer={
 *     <>
 *       <Button variant={ButtonVariant.Secondary} onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button variant={ButtonVariant.Primary} onClick={handleConfirm}>Confirm</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = ModalSize.Medium,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle escape key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  // Focus trap effect
  useEffect(() => {
    if (!isOpen) return

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Focus the modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements?.[0] as HTMLElement
    firstFocusable?.focus()

    // Add escape key listener
    document.addEventListener("keydown", handleEscape)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscape)
      // Restore focus to previous element
      previousFocusRef.current?.focus()
    }
  }, [isOpen, handleEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = getSizeClasses(size)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses} transform transition-all animate-scale-in ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
