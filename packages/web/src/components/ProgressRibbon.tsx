/**
 * ProgressRibbon Component
 *
 * A beautiful progress indicator styled as a bookmark ribbon
 * hanging from the top of the book.
 */

import { motion } from "framer-motion"
import React from "react"

export interface ProgressRibbonProps {
  /** Current progress (0-100) */
  progress: number
  /** Current page/scene number */
  current: number
  /** Total pages/scenes */
  total: number
  /** Optional label */
  label?: string
  /** Show percentage */
  showPercentage?: boolean
  /** Custom className */
  className?: string
}

export const ProgressRibbon: React.FC<ProgressRibbonProps> = ({
  progress,
  current,
  total,
  label = "Scene",
  showPercentage = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Page counter */}
      <div className="text-sm font-medium text-text-secondary text-ui mb-2">
        {label} {current} / {total}
        {showPercentage && (
          <span className="ml-2 text-text-muted">
            ({Math.round(progress)}%)
          </span>
        )}
      </div>

      {/* Progress ribbon container */}
      <div className="relative w-full max-w-md">
        {/* Background track */}
        <div
          className="h-10 rounded-md overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #D4C4A8 0%, #C0B090 100%)",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Progress fill - Bookmark ribbon style */}
          <motion.div
            className="h-full relative"
            style={{
              background:
                "linear-gradient(135deg, #8B3A3A 0%, #CD5C5C 50%, #8B3A3A 100%)",
              boxShadow: "0 2px 8px rgba(139, 58, 58, 0.4)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            {/* Ribbon texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255, 255, 255, 0.1) 10px,
                    rgba(255, 255, 255, 0.1) 20px
                  )
                `,
              }}
            />

            {/* Ribbon fold effect at the end */}
            <div
              className="absolute right-0 top-0 bottom-0 w-8"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 100%)",
              }}
            />
          </motion.div>

          {/* Bookmark tail - V-shape notch */}
          {progress > 5 && (
            <motion.div
              className="absolute top-0 bottom-0"
              style={{
                left: `${progress}%`,
                transform: "translateX(-50%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div
                className="w-0 h-0 relative"
                style={{
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "10px solid #8B3A3A",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Decorative stitching effect */}
        <div
          className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(to right, rgba(255, 255, 255, 0.3) 0px, rgba(255, 255, 255, 0.3) 4px, transparent 4px, transparent 8px)",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    </div>
  )
}

/**
 * SimpleProgressBar Component
 *
 * A simpler progress bar for less prominent locations
 */
export const SimpleProgressBar: React.FC<{
  progress: number
  className?: string
  color?: string
}> = ({ progress, className = "", color = "#8B7355" }) => {
  return (
    <div
      className={`w-full h-2 rounded-full overflow-hidden bg-parchment ${className}`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: color,
          boxShadow: `0 1px 3px ${color}40`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      />
    </div>
  )
}

export default ProgressRibbon
