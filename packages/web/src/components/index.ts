/**
 * Centralized export file for all UI components
 *
 * This file provides a single import point for all components in the library.
 *
 * @example
 * ```tsx
 * import { Button, Card, Input, Modal } from '@/components';
 * ```
 */

export { Button } from "./Button"
export type { ButtonProps } from "./Button"

export { Card } from "./Card"
export type { CardProps } from "./Card"

export { Input } from "./Input"
export type { InputProps } from "./Input"

export { Modal } from "./Modal"
export type { ModalProps } from "./Modal"

export { LoadingSpinner } from "./LoadingSpinner"
export type { LoadingSpinnerProps } from "./LoadingSpinner"

export { ProgressBar } from "./ProgressBar"
export type { ProgressBarProps } from "./ProgressBar"

// Export all enums from the single types file
export {
  ButtonSize,
  ButtonVariant,
  CardPadding,
  InputType,
  InputVariant,
  ModalSize,
  ProgressBarColor,
  ProgressBarSize,
  SpinnerColor,
  SpinnerSize,
} from "./types"

export { ImageViewer } from "./ImageViewer"
export type { ImageViewerProps } from "./ImageViewer"

export { DropZone } from "./DropZone"
export type { DropZoneProps } from "./DropZone"
