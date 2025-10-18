import React from "react"
import { ButtonSize, ButtonVariant } from "./types"

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /** Button variant for different visual styles */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in loading state */
  loading?: boolean
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Button content */
  children: React.ReactNode
  /** Optional icon to display before text */
  icon?: React.ReactNode
  /** Optional icon to display after text */
  iconAfter?: React.ReactNode
  /** Button type attribute */
  type?: "button" | "submit" | "reset"
  /** Additional CSS classes */
  className?: string
  /** Full width button */
  fullWidth?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
}

/**
 * Get variant-specific CSS classes
 */
const getVariantClasses = (variant: ButtonVariant): string => {
  const variants: Record<ButtonVariant, string> = {
    [ButtonVariant.Primary]:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:bg-blue-800",
    [ButtonVariant.Secondary]:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow-md active:bg-gray-400",
    [ButtonVariant.Danger]:
      "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:bg-red-800",
    [ButtonVariant.Success]:
      "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:bg-green-800",
  }
  return variants[variant]
}

/**
 * Get size-specific CSS classes
 */
const getSizeClasses = (size: ButtonSize): string => {
  const sizes: Record<ButtonSize, string> = {
    [ButtonSize.Small]: "px-3 py-1.5 text-sm",
    [ButtonSize.Medium]: "px-4 py-2 text-base",
    [ButtonSize.Large]: "px-6 py-3 text-lg",
  }
  return sizes[size]
}

/**
 * Button Component
 *
 * A flexible button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and full accessibility.
 *
 * @example
 * ```tsx
 * <Button variant={ButtonVariant.Primary} size={ButtonSize.Medium} onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * <Button variant={ButtonVariant.Secondary} icon={<PlusIcon />} loading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Medium,
  disabled = false,
  loading = false,
  onClick,
  children,
  icon,
  iconAfter,
  type = "button",
  className = "",
  fullWidth = false,
  ariaLabel,
}) => {
  const isDisabled = disabled || loading

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)

  const disabledClasses = isDisabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer"
  const widthClasses = fullWidth ? "w-full" : ""

  const combinedClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${widthClasses} ${className}`.trim()

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {!loading && iconAfter && <span className="ml-2">{iconAfter}</span>}
    </button>
  )
}
