import React from "react"
import { ProgressBarColor, ProgressBarSize } from "./types"

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps {
  /** Current progress value */
  current: number
  /** Maximum progress value */
  max: number
  /** Show percentage text */
  showPercentage?: boolean
  /** Progress bar color */
  color?: ProgressBarColor
  /** Optional label text */
  label?: string
  /** Size of the progress bar */
  size?: ProgressBarSize
  /** Additional CSS classes */
  className?: string
  /** Whether to animate progress changes */
  animated?: boolean
}

/**
 * Get color-specific CSS classes
 */
const getColorClasses = (color: ProgressBarColor): string => {
  const colors: Record<ProgressBarColor, string> = {
    [ProgressBarColor.Primary]: "bg-blue-600",
    [ProgressBarColor.Success]: "bg-green-600",
    [ProgressBarColor.Warning]: "bg-yellow-500",
    [ProgressBarColor.Danger]: "bg-red-600",
  }
  return colors[color]
}

/**
 * Get size-specific CSS classes
 */
const getSizeClasses = (size: ProgressBarSize): string => {
  const sizes: Record<ProgressBarSize, string> = {
    [ProgressBarSize.Small]: "h-2",
    [ProgressBarSize.Medium]: "h-3",
    [ProgressBarSize.Large]: "h-4",
  }
  return sizes[size]
}

/**
 * ProgressBar Component
 *
 * A visual progress indicator with optional percentage display and labels.
 * Supports smooth animations and multiple color themes.
 *
 * @example
 * ```tsx
 * <ProgressBar current={7} max={10} showPercentage label="Story Progress" />
 *
 * <ProgressBar
 *   current={generatedCount}
 *   max={totalCount}
 *   color={ProgressBarColor.Success}
 *   animated
 * />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  showPercentage = false,
  color = ProgressBarColor.Primary,
  label,
  size = ProgressBarSize.Medium,
  className = "",
  animated = true,
}) => {
  // Calculate percentage, ensuring it's between 0 and 100
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100)
  const percentageText = `${Math.round(percentage)}%`

  const colorClasses = getColorClasses(color)
  const sizeClasses = getSizeClasses(size)
  const animationClasses = animated
    ? "transition-all duration-500 ease-out"
    : ""

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage row */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {percentageText}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses}`}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progress"}
      >
        {/* Progress bar fill */}
        <div
          className={`h-full ${colorClasses} ${animationClasses} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Optional text below (current/max) */}
      {!showPercentage && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {current} / {max}
        </div>
      )}
    </div>
  )
}
