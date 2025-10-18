/**
 * Image Utility Functions
 *
 * Utilities for handling image URLs, particularly for Supabase storage
 */

import { STORAGE_BUCKET, SUPABASE_STORAGE_URL } from "@/constants"

/**
 * Check if a URL is already a full URL (starts with http:// or https://)
 */
export function isFullUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://")
}

/**
 * Check if a URL is a placeholder or mock URL
 */
export function isPlaceholderUrl(url: string): boolean {
  return url.includes("/api/placeholder") || url.includes("placeholder")
}

/**
 * Construct a full Supabase storage URL from a file path/UUID
 *
 * @param pathOrUuid - The file path or UUID in the bucket
 * @returns Full Supabase storage URL
 */
export function getSupabaseImageUrl(pathOrUuid: string): string {
  // If it's a placeholder, return as-is for development
  if (isPlaceholderUrl(pathOrUuid)) {
    return pathOrUuid
  }

  // If it's already a full URL (including Supabase storage), return as-is
  // This preserves the directory structure (scenes/, backgrounds/, locations/, etc.)
  if (isFullUrl(pathOrUuid)) {
    return pathOrUuid
  }

  // Remove leading slash if present
  const cleanPath = pathOrUuid.startsWith("/")
    ? pathOrUuid.substring(1)
    : pathOrUuid

  // Construct the full URL using the frame-fable bucket
  return `${SUPABASE_STORAGE_URL}/${STORAGE_BUCKET}/${cleanPath}`
}

/**
 * Get the full URL for a scene image
 *
 * @param imageUrl - The image URL or UUID from the API
 * @returns Full Supabase storage URL for the scene image
 */
export function getSceneImageUrl(imageUrl: string): string {
  return getSupabaseImageUrl(imageUrl)
}

/**
 * Get the full URL for a location/background image
 *
 * @param imageUrl - The image URL or UUID from the API
 * @returns Full Supabase storage URL for the location image
 */
export function getLocationImageUrl(imageUrl: string): string {
  return getSupabaseImageUrl(imageUrl)
}

/**
 * Get the full URL for a character image
 *
 * @param imageUrl - The image URL or UUID from the API
 * @returns Full Supabase storage URL for the character image
 */
export function getCharacterImageUrl(imageUrl: string): string {
  return getSupabaseImageUrl(imageUrl)
}

/**
 * Normalize an image URL - converts relative paths and UUIDs to full URLs
 *
 * @param imageUrl - The image URL from the API
 * @returns Full image URL
 */
export function normalizeImageUrl(imageUrl: string): string {
  // If empty or null, return empty string
  if (!imageUrl) {
    return ""
  }

  // If it's already a full URL or placeholder, return as-is
  if (isFullUrl(imageUrl) || isPlaceholderUrl(imageUrl)) {
    return imageUrl
  }

  // Otherwise, construct the full URL
  return getSupabaseImageUrl(imageUrl)
}
