/**
 * ChoiceButton Component
 *
 * A beautiful choice button styled as an embossed paper card
 * with 3D effects and color-coding by index.
 */

import { motion } from "framer-motion"
import React from "react"

export interface ChoiceButtonProps {
  /** Choice text to display */
  text: string
  /** Choice index (0-based) for color coding */
  index: number
  /** Click handler */
  onClick: () => void
  /** Disabled state */
  disabled?: boolean
  /** Icon/emoji to display */
  icon?: string
  /** Custom className */
  className?: string
}

const CHOICE_COLORS = [
  {
    bg: "linear-gradient(145deg, #E8F4F8 0%, #D4E9F0 100%)", // Soft blue
    border: "#B8D4E0",
    hoverBg: "linear-gradient(145deg, #D4E9F0 0%, #C0DDE8 100%)",
    icon: "💙",
    shadow: "rgba(91, 124, 153, 0.2)",
  },
  {
    bg: "linear-gradient(145deg, #E8F5E9 0%, #D4EBD5 100%)", // Soft green
    border: "#B8D9B8",
    hoverBg: "linear-gradient(145deg, #D4EBD5 0%, #C0E0C0 100%)",
    icon: "💚",
    shadow: "rgba(74, 103, 65, 0.2)",
  },
  {
    bg: "linear-gradient(145deg, #FFF8E1 0%, #FFF0C5 100%)", // Soft yellow
    border: "#F0DDA8",
    hoverBg: "linear-gradient(145deg, #FFF0C5 0%, #FFE8A0 100%)",
    icon: "💛",
    shadow: "rgba(212, 167, 106, 0.2)",
  },
]

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  text,
  index,
  onClick,
  disabled = false,
  icon,
  className = "",
}) => {
  const colorScheme = CHOICE_COLORS[index % CHOICE_COLORS.length]
  const displayIcon = icon || colorScheme.icon

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 rounded-xl
        flex items-center gap-4
        transition-all duration-200
        relative overflow-hidden
        group
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        background: colorScheme.bg,
        border: `2px solid ${colorScheme.border}`,
        boxShadow: `
          0 4px 8px ${colorScheme.shadow},
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -1px 0 rgba(139, 115, 85, 0.2)
        `,
      }}
      whileHover={
        !disabled
          ? {
              y: -4,
              boxShadow: `
          0 8px 16px ${colorScheme.shadow},
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(139, 115, 85, 0.2)
        `,
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              y: 0,
              boxShadow: `
          0 2px 4px ${colorScheme.shadow} inset,
          inset 0 -1px 0 rgba(255, 255, 255, 0.4)
        `,
            }
          : undefined
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.05) 2px,
              rgba(139, 115, 85, 0.05) 4px
            )
          `,
        }}
      />

      {/* Icon */}
      <div className="text-4xl flex-shrink-0 transform transition-transform group-hover:scale-110">
        {displayIcon}
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="text-lg font-semibold text-text-primary text-body leading-relaxed">
          {text}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="text-2xl text-text-secondary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200">
        →
      </div>
    </motion.button>
  )
}

/**
 * ContinueButton Component
 *
 * A special variant for single-choice "Continue" scenarios
 */
export const ContinueButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  className?: string
}> = ({ onClick, disabled = false, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 rounded-xl
        flex items-center justify-center gap-3
        transition-all duration-200
        relative overflow-hidden
        group
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        background: "linear-gradient(145deg, #F8F4EC 0%, #F0EBE0 100%)",
        border: "2px solid #D4C4A8",
        boxShadow: `
          0 4px 12px rgba(139, 115, 85, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -1px 0 rgba(139, 115, 85, 0.2)
        `,
      }}
      whileHover={
        !disabled
          ? {
              y: -4,
              boxShadow: `
          0 8px 20px rgba(139, 115, 85, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -1px 0 rgba(139, 115, 85, 0.2)
        `,
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              y: 0,
              boxShadow: `
          0 2px 6px rgba(139, 115, 85, 0.2) inset,
          inset 0 -1px 0 rgba(255, 255, 255, 0.4)
        `,
            }
          : undefined
      }
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 115, 85, 0.05) 2px,
              rgba(139, 115, 85, 0.05) 4px
            )
          `,
        }}
      />

      <span className="text-2xl font-bold text-text-primary text-heading relative z-10">
        Continue
      </span>

      <motion.span
        className="text-3xl relative z-10"
        animate={{ x: [0, 5, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        →
      </motion.span>
    </motion.button>
  )
}

export default ChoiceButton
