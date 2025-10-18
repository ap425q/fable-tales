/**
 * BookPage Component
 *
 * A realistic book page with paper texture, shadows, and optional spine.
 * Features a realistic 3D page-turning animation.
 */

import { motion } from "framer-motion"
import React from "react"

export interface BookPageProps {
  /** Content for the left page */
  leftContent?: React.ReactNode
  /** Content for the right page */
  rightContent?: React.ReactNode
  /** Page number for left page */
  leftPageNumber?: number
  /** Page number for right page */
  rightPageNumber?: number
  /** Show the book spine in the middle */
  showSpine?: boolean
  /** Callback when page turn animation completes */
  onPageTurn?: (direction: "forward" | "backward") => void
  /** Can go back to previous page */
  canTurnBack?: boolean
  /** Whether to enable page turn interaction */
  enablePageTurn?: boolean
  /** Current page key for animation */
  pageKey?: string
  /** Additional CSS classes */
  className?: string
  /** Direction of page transition */
  transitionDirection?: "forward" | "backward"
}

export const BookPage: React.FC<BookPageProps> = ({
  leftContent,
  rightContent,
  leftPageNumber,
  rightPageNumber,
  showSpine = true,
  pageKey = "default",
  className = "",
  transitionDirection = "forward",
}) => {
  const [isHoveringCorner, setIsHoveringCorner] = React.useState(false)

  return (
    <div className={`relative w-full max-w-7xl mx-auto ${className}`}>
      {/* Book Container with Shadow */}
      <div
        className="book-shadow rounded-xl overflow-visible bg-transparent"
        style={{
          perspective: "2500px",
          perspectiveOrigin: "center center",
        }}
      >
        <motion.div
          key={pageKey}
          className="flex flex-col md:flex-row relative min-h-[600px] lg:min-h-[700px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Left Page - Static */}
          <motion.div
            className="flex-1 md:w-1/2 relative"
            initial={{ opacity: transitionDirection === "backward" ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`
                paper-texture page-shadow
                h-full p-8 md:p-12
                rounded-l-none rounded-r-md md:rounded-r-none md:rounded-l-xl
                relative overflow-hidden
                bg-gradient-to-br from-cream via-parchment to-cream
              `}
              style={{
                borderTopLeftRadius: "0.75rem",
                borderBottomLeftRadius: "0.75rem",
                borderTopRightRadius: showSpine ? "0" : "0.5rem",
                borderBottomRightRadius: showSpine ? "0" : "0.5rem",
              }}
            >
              <PageTexture />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {leftContent}
              </div>

              {/* Page Number */}
              {leftPageNumber && (
                <div className="absolute bottom-6 left-6 text-sm font-medium text-text-muted text-ui">
                  {leftPageNumber}
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Spine (visible on desktop) */}
          {showSpine && (
            <div className="hidden md:block relative" style={{ width: "40px" }}>
              {/* Spine shadow gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      rgba(92, 74, 58, 0.4) 0%,
                      rgba(92, 74, 58, 0.25) 20%,
                      rgba(92, 74, 58, 0.15) 50%,
                      rgba(92, 74, 58, 0.25) 80%,
                      rgba(92, 74, 58, 0.4) 100%
                    )
                  `,
                }}
              />

              {/* Spine highlight */}
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              />
            </div>
          )}

          {/* Right Page - With 3D Flip Animation */}
          <div className="flex-1 md:w-1/2 relative">
            {/* Static base page - visible before and after flip */}
            <div
              className={`
                paper-texture page-shadow
                h-full p-8 md:p-12
                rounded-r-none rounded-l-md md:rounded-l-none md:rounded-r-xl
                relative overflow-hidden
                bg-gradient-to-br from-cream via-parchment to-cream
              `}
              style={{
                borderTopRightRadius: "0.75rem",
                borderBottomRightRadius: "0.75rem",
                borderTopLeftRadius: showSpine ? "0" : "0.5rem",
                borderBottomLeftRadius: showSpine ? "0" : "0.5rem",
              }}
              onMouseEnter={() => setIsHoveringCorner(true)}
              onMouseLeave={() => setIsHoveringCorner(false)}
            >
              <PageTexture />

              {/* Page curl effect on hover (bottom-right corner) */}
              {isHoveringCorner && (
                <div
                  className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, rgba(139, 115, 85, 0.1) 50%)",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    transform: "translateX(0) translateY(0)",
                  }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {rightContent}
              </div>

              {/* Page Number */}
              {rightPageNumber && (
                <div className="absolute bottom-6 right-6 text-sm font-medium text-text-muted text-ui">
                  {rightPageNumber}
                </div>
              )}
            </div>

            {/* Flipping Page Overlay - Animates on top during transition */}
            <motion.div
              key={`flip-${pageKey}`}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
              }}
              initial={{
                rotateY: transitionDirection === "forward" ? 0 : 180,
              }}
              animate={{
                rotateY: transitionDirection === "forward" ? -180 : 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              {/* Front face of the flipping page */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div
                  className={`
                    paper-texture page-shadow
                    h-full p-8 md:p-12
                    rounded-r-none rounded-l-md md:rounded-l-none md:rounded-r-xl
                    relative overflow-hidden
                    bg-gradient-to-br from-cream via-parchment to-cream
                  `}
                  style={{
                    borderTopRightRadius: "0.75rem",
                    borderBottomRightRadius: "0.75rem",
                    borderTopLeftRadius: showSpine ? "0" : "0.5rem",
                    borderBottomLeftRadius: showSpine ? "0" : "0.5rem",
                    boxShadow:
                      "0 4px 20px rgba(0, 0, 0, 0.25), inset -2px 0 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <PageTexture />

                  {/* Darkening gradient during flip */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0.1), transparent)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Content - same as what's on the page */}
                  <div className="relative z-10 h-full flex flex-col">
                    {rightContent}
                  </div>

                  {/* Page Number */}
                  {rightPageNumber && (
                    <div className="absolute bottom-6 right-6 text-sm font-medium text-text-muted text-ui">
                      {rightPageNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Back face of the flipping page (shows during flip) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  className={`
                    paper-texture page-shadow
                    h-full p-8 md:p-12
                    rounded-r-none rounded-l-md md:rounded-l-none md:rounded-r-xl
                    relative overflow-hidden
                    bg-gradient-to-br from-parchment via-cream to-aged-paper
                  `}
                  style={{
                    borderTopRightRadius: "0.75rem",
                    borderBottomRightRadius: "0.75rem",
                    borderTopLeftRadius: showSpine ? "0" : "0.5rem",
                    borderBottomLeftRadius: showSpine ? "0" : "0.5rem",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <PageTexture mirrored />

                  {/* Back of page - subtle patterns */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `
                        radial-gradient(
                          ellipse at center,
                          rgba(139, 115, 85, 0.2) 0%,
                          transparent 70%
                        )
                      `,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Helper component for page texture (DRY)
const PageTexture: React.FC<{ mirrored?: boolean }> = ({
  mirrored = false,
}) => (
  <>
    {/* Paper grain overlay */}
    <div
      className="absolute inset-0 pointer-events-none opacity-20"
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

    {/* Aging effect at edges */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(
            ellipse at ${mirrored ? "0%" : "100%"} 50%,
            rgba(232, 220, 199, 0.5) 0%,
            transparent 70%
          )
        `,
      }}
    />
  </>
)

export default BookPage
