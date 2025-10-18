/**
 * LeatherCard Component
 *
 * A leather-bound card for parent mode UI elements.
 * Styled to look like a leather-covered book or journal with gold accents.
 */

import { motion } from "framer-motion"
import React from "react"

export interface LeatherCardProps {
  /** Card content */
  children: React.ReactNode
  /** Optional title */
  title?: string
  /** Optional subtitle */
  subtitle?: string
  /** Show gold corner decoration */
  showCornerDecoration?: boolean
  /** Click handler */
  onClick?: () => void
  /** Hover effect */
  hoverable?: boolean
  /** Custom className */
  className?: string
  /** Padding size */
  padding?: "sm" | "md" | "lg"
  /** Color variant */
  variant?: "default" | "dark" | "light"
}

const PADDING_SIZES = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

const VARIANTS = {
  default: {
    bg: "linear-gradient(145deg, #8B7355 0%, #6B5744 50%, #8B7355 100%)",
    border: "#5C4A3A",
  },
  dark: {
    bg: "linear-gradient(145deg, #6B5744 0%, #5C4A3A 50%, #6B5744 100%)",
    border: "#4A3828",
  },
  light: {
    bg: "linear-gradient(145deg, #A89885 0%, #8B7355 50%, #A89885 100%)",
    border: "#8B7355",
  },
}

export const LeatherCard: React.FC<LeatherCardProps> = ({
  children,
  title,
  subtitle,
  showCornerDecoration = true,
  onClick,
  hoverable = false,
  className = "",
  padding = "md",
  variant = "default",
}) => {
  const isClickable = Boolean(onClick)
  const shouldAnimate = hoverable || isClickable
  const colorScheme = VARIANTS[variant]

  const CardWrapper = shouldAnimate ? motion.div : "div"
  const cardProps = shouldAnimate
    ? {
        whileHover: {
          y: -4,
          boxShadow: `
            0 12px 32px rgba(44, 36, 22, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15),
            inset 0 -2px 4px rgba(0, 0, 0, 0.4)
          `,
        },
        whileTap: isClickable
          ? {
              y: 0,
              boxShadow: `
            0 6px 20px rgba(44, 36, 22, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
          `,
            }
          : undefined,
        transition: { duration: 0.2 },
      }
    : {}

  // Use type assertion to satisfy TypeScript
  const WrapperComponent = CardWrapper as React.ElementType

  return (
    <WrapperComponent
      onClick={onClick}
      className={`
        leather-texture leather-shadow
        rounded-2xl
        relative
        transition-all duration-200
        ${PADDING_SIZES[padding]}
        ${isClickable ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        background: colorScheme.bg,
        border: `3px solid ${colorScheme.border}`,
        boxShadow: `
          0 8px 24px rgba(44, 36, 22, 0.4),
          inset 0 1px 2px rgba(255, 255, 255, 0.1),
          inset 0 -2px 4px rgba(0, 0, 0, 0.3)
        `,
      }}
      {...(cardProps as any)}
    >
      {/* Leather texture overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle at 20% 30%,
              transparent 0,
              rgba(0, 0, 0, 0.1) 1px,
              transparent 2px
            ),
            repeating-radial-gradient(
              circle at 80% 70%,
              transparent 0,
              rgba(0, 0, 0, 0.08) 1px,
              transparent 2px
            )
          `,
        }}
      />

      {/* Gold corner decoration */}
      {showCornerDecoration && (
        <>
          <div
            className="absolute top-3 right-3 text-gold text-xl opacity-70"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-3 left-3 text-gold text-xl opacity-70"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            ✦
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Title and subtitle */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3
                className="text-xl font-bold text-cream embossed text-heading mb-1"
                style={{ color: "var(--cream-page) !important" }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-parchment opacity-80 text-ui">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Main content */}
        {children}
      </div>
    </WrapperComponent>
  )
}

/**
 * PaperCard Component
 *
 * A paper-style card for lighter content (alternative to leather)
 */
export const PaperCard: React.FC<{
  children: React.ReactNode
  title?: string
  className?: string
  hoverable?: boolean
}> = ({ children, title, className = "", hoverable = false }) => {
  const CardWrapper = hoverable ? motion.div : "div"
  const cardProps = hoverable
    ? {
        whileHover: {
          y: -2,
          boxShadow: "0 6px 16px rgba(44, 36, 22, 0.2)",
        },
        transition: { duration: 0.2 },
      }
    : {}

  // Use type assertion to satisfy TypeScript
  const WrapperComponent = CardWrapper as React.ElementType

  return (
    <WrapperComponent
      className={`
        paper-texture page-shadow
        rounded-xl p-6
        relative
        ${className}
      `}
      style={{
        background: "linear-gradient(to bottom, #F5F1E8 0%, #EDE4D5 100%)",
        border: "2px solid #D4C4A8",
      }}
      {...cardProps}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 rounded-xl"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.03) 2px,
              rgba(139, 115, 85, 0.03) 4px
            )
          `,
        }}
      />

      <div className="relative z-10">
        {title && (
          <h3 className="text-lg font-bold text-text-primary text-heading mb-4">
            {title}
          </h3>
        )}
        {children}
      </div>
    </WrapperComponent>
  )
}

export default LeatherCard
