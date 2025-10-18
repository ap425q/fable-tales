import React from "react"
import { CardPadding } from "./types"

/**
 * Props for the Card component
 */
export interface CardProps {
  /** Card title */
  title?: string
  /** Main card content */
  children: React.ReactNode
  /** Optional footer content */
  footer?: React.ReactNode
  /** Optional image URL to display at the top */
  image?: string
  /** Image alt text for accessibility */
  imageAlt?: string
  /** Click handler for the entire card */
  onClick?: () => void
  /** Enable hover effect (elevation on hover) */
  hoverable?: boolean
  /** Additional CSS classes */
  className?: string
  /** Card padding size */
  padding?: CardPadding
  /** Whether the card is selected/active */
  selected?: boolean
}

/**
 * Get padding classes based on padding prop
 */
const getPaddingClasses = (padding: CardPadding): string => {
  const paddings: Record<CardPadding, string> = {
    [CardPadding.None]: "",
    [CardPadding.Small]: "p-3",
    [CardPadding.Medium]: "p-4",
    [CardPadding.Large]: "p-6",
  }
  return paddings[padding]
}

/**
 * Card Component
 *
 * A flexible card container with optional title, image, and footer.
 * Supports hover effects and click interactions.
 *
 * @example
 * ```tsx
 * <Card
 *   title="Story Title"
 *   image="/story-cover.png"
 *   footer={<Button>Read More</Button>}
 *   hoverable
 * >
 *   <p>Story description goes here...</p>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  image,
  imageAlt = "",
  onClick,
  hoverable = false,
  className = "",
  padding = CardPadding.Medium,
  selected = false,
}) => {
  const isClickable = !!onClick

  const baseClasses =
    "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200"
  const hoverClasses = hoverable ? "hover:shadow-xl hover:-translate-y-1" : ""
  const clickableClasses = isClickable ? "cursor-pointer" : ""
  const selectedClasses = selected ? "ring-2 ring-blue-500 shadow-lg" : ""

  const combinedClasses =
    `${baseClasses} ${hoverClasses} ${clickableClasses} ${selectedClasses} ${className}`.trim()

  const contentPaddingClasses = getPaddingClasses(padding)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={combinedClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={selected}
    >
      {image && (
        <div className="w-full h-48 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className={contentPaddingClasses}>
        {title && (
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        )}

        <div className="text-gray-700">{children}</div>
      </div>

      {footer && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}
