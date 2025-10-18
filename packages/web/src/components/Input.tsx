import React, { useId } from "react"
import { InputType, InputVariant } from "./types"

/**
 * Props for the Input component
 */
export interface InputProps {
  /** Input type */
  type?: InputType
  /** Input variant (text or textarea) */
  variant?: InputVariant
  /** Current input value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Input label */
  label?: string
  /** Error message to display */
  error?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Maximum character length */
  maxLength?: number
  /** Show character counter for textarea */
  showCharacterCount?: boolean
  /** Number of rows for textarea */
  rows?: number
  /** Additional CSS classes */
  className?: string
  /** Required field indicator */
  required?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** ARIA label for accessibility */
  ariaLabel?: string
}

/**
 * Input Component
 *
 * A flexible input component supporting both text inputs and textareas.
 * Includes error states, character counting, and accessibility features.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Story Title"
 *   value={title}
 *   onChange={setTitle}
 *   placeholder="Enter a title..."
 *   required
 * />
 *
 * <Input
 *   variant={InputVariant.Textarea}
 *   label="Story Description"
 *   value={description}
 *   onChange={setDescription}
 *   maxLength={500}
 *   showCharacterCount
 *   rows={4}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  type = InputType.Text,
  variant = InputVariant.Text,
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  maxLength,
  showCharacterCount = false,
  rows = 4,
  className = "",
  required = false,
  autoFocus = false,
  ariaLabel,
}) => {
  const inputId = useId()
  const errorId = useId()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value)
  }

  const baseInputClasses =
    "w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-600"
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300"
  const disabledClasses = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-60"
    : "bg-white"

  const inputClasses =
    `${baseInputClasses} ${errorClasses} ${disabledClasses} ${className}`.trim()

  const characterCount = value.length
  const isOverLimit = maxLength ? characterCount > maxLength : false

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {variant === InputVariant.Text ? (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          autoFocus={autoFocus}
          className={inputClasses}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <textarea
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          autoFocus={autoFocus}
          rows={rows}
          className={`${inputClasses} resize-vertical`}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {showCharacterCount && maxLength && (
        <div className="mt-1 text-right">
          <span
            className={`text-sm ${
              isOverLimit ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            {characterCount} / {maxLength}
          </span>
        </div>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-red-600 flex items-start"
          role="alert"
        >
          <svg
            className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
