"use client"

/**
 * Home Page - Role Selection
 *
 * Classic book design with opening animation.
 * Allows users to choose between Parent Mode and Child Mode.
 */

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [bookOpened, setBookOpened] = useState(false)

  useEffect(() => {
    // Trigger book opening animation on mount
    const timer = setTimeout(() => {
      setBookOpened(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-6xl">📚</div>
        <div className="absolute top-20 right-20 text-4xl">✨</div>
        <div className="absolute bottom-20 left-20 text-5xl">🌟</div>
        <div className="absolute bottom-10 right-10 text-6xl">📖</div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Title Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl sm:text-7xl font-bold text-text-primary text-decorative mb-4 gold-text">
            📚 Fable Tales 📚
          </h1>
          <p className="text-2xl sm:text-3xl text-text-secondary text-heading mb-3">
            Create Magical Stories Together
          </p>
          <p className="text-lg text-text-muted text-body">
            Where imagination meets learning through interactive storytelling
          </p>
        </motion.div>

        {/* Open Book Layout */}
        <motion.div
          className="perspective-1000"
          initial={{ rotateX: -15, scale: 0.9 }}
          animate={{
            rotateX: bookOpened ? 0 : -15,
            scale: bookOpened ? 1 : 0.9,
          }}
          transition={{
            duration: 1.2,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <div className="flex flex-col md:flex-row gap-0 book-shadow rounded-2xl overflow-hidden">
            {/* Left Page - Parent Mode */}
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{
                rotateY: bookOpened ? 0 : -90,
                opacity: bookOpened ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="flex-1"
            >
              <Link href="/story-library">
                <div className="paper-texture page-shadow h-full min-h-[500px] p-8 md:p-12 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden rounded-l-2xl md:rounded-r-none">
                  {/* Paper grain */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div
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
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      className="text-8xl mb-6"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      👨‍👩‍👧‍👦
                    </motion.div>

                    <h2 className="text-4xl font-bold text-text-primary text-heading mb-4">
                      Parent Mode
                    </h2>

                    <div className="w-16 h-1 bg-leather rounded-full mb-4" />

                    <p className="text-lg text-text-secondary text-body mb-6 leading-relaxed max-w-sm">
                      Craft personalized stories with educational lessons
                      tailored to your child's journey
                    </p>

                    <div className="space-y-3 text-left mb-8">
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">✏️</span>
                        <span>Create & Edit Stories</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">🎨</span>
                        <span>Customize Characters</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">🌳</span>
                        <span>Design Story Paths</span>
                      </div>
                    </div>

                    <motion.div
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-ui transition-all duration-200 group-hover:shadow-xl"
                      style={{
                        background: "linear-gradient(145deg, #8B7355, #6B5744)",
                        color: "#FFF",
                        boxShadow: "0 4px 12px rgba(139, 115, 85, 0.4)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Enter Studio</span>
                      <span className="text-xl">→</span>
                    </motion.div>

                    {/* Decorative corner */}
                    <div className="absolute top-4 right-4 text-gold text-2xl opacity-50">
                      ✦
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Book Spine (Desktop) */}
            <div className="hidden md:block w-10 relative">
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      rgba(92, 74, 58, 0.5) 0%,
                      rgba(92, 74, 58, 0.3) 20%,
                      rgba(92, 74, 58, 0.2) 50%,
                      rgba(92, 74, 58, 0.3) 80%,
                      rgba(92, 74, 58, 0.5) 100%
                    )
                  `,
                }}
              />
            </div>

            {/* Right Page - Child Mode */}
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{
                rotateY: bookOpened ? 0 : 90,
                opacity: bookOpened ? 1 : 0,
              }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="flex-1"
            >
              <Link href="/story-selection">
                <div className="paper-texture page-shadow h-full min-h-[500px] p-8 md:p-12 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden rounded-r-2xl md:rounded-l-none">
                  {/* Paper grain */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div
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
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      className="text-8xl mb-6"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      👶
                    </motion.div>

                    <h2 className="text-4xl font-bold text-text-primary text-heading mb-4">
                      Child Mode
                    </h2>

                    <div className="w-16 h-1 bg-forest-green rounded-full mb-4" />

                    <p className="text-lg text-text-secondary text-body mb-6 leading-relaxed max-w-sm">
                      Embark on magical adventures where every choice leads to
                      new discoveries
                    </p>

                    <div className="space-y-3 text-left mb-8">
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">📖</span>
                        <span>Read Interactive Tales</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">🎭</span>
                        <span>Make Story Choices</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary text-body">
                        <span className="text-2xl">💡</span>
                        <span>Learn Life Lessons</span>
                      </div>
                    </div>

                    <motion.div
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-ui transition-all duration-200 group-hover:shadow-xl"
                      style={{
                        background: "linear-gradient(145deg, #6B8E6B, #4A6741)",
                        color: "#FFF",
                        boxShadow: "0 4px 12px rgba(74, 103, 65, 0.4)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start Reading</span>
                      <span className="text-xl">→</span>
                    </motion.div>

                    {/* Decorative corner */}
                    <div className="absolute top-4 left-4 text-gold text-2xl opacity-50">
                      ✦
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mt-16 paper-texture page-shadow rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="text-3xl font-bold text-text-primary text-heading mb-8 text-center">
            ✨ What Makes Fable Tales Special? ✨
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h4 className="font-bold text-xl text-text-primary text-heading mb-2">
                AI-Generated Stories
              </h4>
              <p className="text-text-secondary text-body">
                Unique tales crafted to teach the lessons that matter most to
                you
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🌳</div>
              <h4 className="font-bold text-xl text-text-primary text-heading mb-2">
                Branching Narratives
              </h4>
              <p className="text-text-secondary text-body">
                Multiple paths and endings shaped by your child's choices
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💝</div>
              <h4 className="font-bold text-xl text-text-primary text-heading mb-2">
                Precious Memories
              </h4>
              <p className="text-text-secondary text-body">
                Create lasting bonds through shared storytelling experiences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="mt-8 text-center text-text-muted text-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Begin your storytelling journey today ✨
        </motion.p>
      </div>
    </div>
  )
}
