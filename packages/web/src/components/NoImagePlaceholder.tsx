import React from "react"

/**
 * Props for the NoImagePlaceholder component
 */
export interface NoImagePlaceholderProps {
  /** Optional custom height class */
  height?: string
  /** Optional custom icon */
  icon?: string
  /** Optional custom text */
  text?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * NoImagePlaceholder Component
 *
 * A placeholder component to display when there's no image available.
 * Shows a book icon and "No Image" text with a subtle gradient background.
 *
 * @example
 * ```tsx
 * <NoImagePlaceholder />
 * <NoImagePlaceholder height="h-32" text="No Cover" />
 * ```
 */
export const NoImagePlaceholder: React.FC<NoImagePlaceholderProps> = ({
  height = "h-48",
  icon = "📖",
  text = "No Image",
  className = "",
}) => {
  return (
    <div
      className={`w-full ${height} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
    >
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-sm font-medium">{text}</div>
      </div>
    </div>
  )
}
