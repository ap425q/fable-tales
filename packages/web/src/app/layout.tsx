import type { Metadata } from "next"
import {
  Cinzel_Decorative,
  Crimson_Text,
  Merriweather,
  Nunito,
} from "next/font/google"
import "./globals.css"

// Classic Book Fonts
const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
})

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Fable Tales - Interactive Storybook Creator",
  description:
    "Create magical branching stories with AI-generated content. An immersive storytelling experience for parents and children.",
  keywords: [
    "storybook",
    "children",
    "interactive",
    "AI",
    "education",
    "stories",
  ],
  authors: [{ name: "Fable Tales" }],
  openGraph: {
    title: "Fable Tales - Interactive Storybook Creator",
    description: "Create magical branching stories with AI-generated content",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="smooth-scroll">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${crimsonText.variable} ${merriweather.variable} ${nunito.variable} ${cinzelDecorative.variable} antialiased`}
      >
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
