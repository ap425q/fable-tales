"use client"

import {
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
  DropZone,
  ImageViewer,
  Input,
  InputVariant,
  LoadingSpinner,
  Modal,
  ModalSize,
  ProgressBar,
  ProgressBarColor,
  ProgressBarSize,
  SpinnerSize,
} from "@/components"
import { ImageVersion } from "@/types"
import { useState } from "react"

/**
 * Components Demo Page
 *
 * This page demonstrates all available UI components with interactive examples.
 * Use this as a reference for component usage and styling.
 */
export default function ComponentsDemoPage() {
  // State for interactive demos
  const [inputValue, setInputValue] = useState("")
  const [textareaValue, setTextareaValue] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [progress, setProgress] = useState(45)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  // Mock data for ImageViewer
  const mockImageVersions: ImageVersion[] = [
    {
      versionId: "v1",
      url: "/characters/f_sophia.png",
      generatedAt: new Date().toISOString(),
    },
    {
      versionId: "v2",
      url: "/characters/f_olivia.png",
      generatedAt: new Date().toISOString(),
    },
    {
      versionId: "v3",
      url: "/characters/f_emma.png",
      generatedAt: new Date().toISOString(),
    },
  ]

  const [selectedVersion, setSelectedVersion] = useState("v1")

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI Components Library
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of all available components
          </p>
        </div>

        {/* Components Grid */}
        <div className="space-y-12">
          {/* Button Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Button</h2>
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant={ButtonVariant.Primary}>Primary</Button>
                  <Button variant={ButtonVariant.Secondary}>Secondary</Button>
                  <Button variant={ButtonVariant.Success}>Success</Button>
                  <Button variant={ButtonVariant.Danger}>Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size={ButtonSize.Small}>Small</Button>
                  <Button size={ButtonSize.Medium}>Medium</Button>
                  <Button size={ButtonSize.Large}>Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-lg font-semibold mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button icon={<span>✨</span>}>With Icon</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Card Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                title="Basic Card"
                hoverable
                selected={selectedCard === 1}
                onClick={() => setSelectedCard(1)}
              >
                <p className="text-gray-600">
                  A simple card with title and content. Click to select.
                </p>
              </Card>

              <Card
                title="Card with Image"
                image="/characters/f_sophia.png"
                imageAlt="Character"
                hoverable
                selected={selectedCard === 2}
                onClick={() => setSelectedCard(2)}
              >
                <p className="text-gray-600">
                  Card with image header and content.
                </p>
              </Card>

              <Card
                title="Card with Footer"
                hoverable
                selected={selectedCard === 3}
                onClick={() => setSelectedCard(3)}
                footer={
                  <Button
                    size={ButtonSize.Small}
                    variant={ButtonVariant.Primary}
                  >
                    Action
                  </Button>
                }
              >
                <p className="text-gray-600">
                  Card with footer containing actions.
                </p>
              </Card>
            </div>
          </section>

          {/* Input Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Input</h2>
            <div className="space-y-6 max-w-2xl">
              <Input
                label="Text Input"
                placeholder="Enter text here..."
                value={inputValue}
                onChange={setInputValue}
                required
              />

              <Input
                label="Input with Error"
                placeholder="Invalid input"
                value=""
                onChange={() => {}}
                error="This field is required"
              />

              <Input
                variant={InputVariant.Textarea}
                label="Textarea"
                placeholder="Enter longer text..."
                value={textareaValue}
                onChange={setTextareaValue}
                maxLength={200}
                showCharacterCount
                rows={4}
              />

              <Input
                label="Disabled Input"
                value="Cannot edit"
                onChange={() => {}}
                disabled
              />
            </div>
          </section>

          {/* Modal Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Modal</h2>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size={ModalSize.Medium}
              footer={
                <>
                  <Button
                    variant={ButtonVariant.Secondary}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={ButtonVariant.Primary}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Confirm
                  </Button>
                </>
              }
            >
              <p className="text-gray-700">
                This is a modal dialog with a backdrop, focus trap, and keyboard
                support. Press Escape or click outside to close.
              </p>
            </Modal>
          </section>

          {/* LoadingSpinner Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              LoadingSpinner
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <LoadingSpinner size={SpinnerSize.Small} />
                  <LoadingSpinner size={SpinnerSize.Medium} />
                  <LoadingSpinner size={SpinnerSize.Large} />
                  <LoadingSpinner size={SpinnerSize.XLarge} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">With Message</h3>
                <LoadingSpinner
                  size={SpinnerSize.Large}
                  message="Loading stories..."
                />
              </div>
            </div>
          </section>

          {/* ProgressBar Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ProgressBar
            </h2>
            <div className="space-y-6 max-w-2xl">
              <ProgressBar
                current={progress}
                max={100}
                showPercentage
                label="Story Generation Progress"
              />

              <ProgressBar
                current={7}
                max={10}
                color={ProgressBarColor.Success}
                label="Scenes Completed"
              />

              <ProgressBar
                current={3}
                max={5}
                color={ProgressBarColor.Warning}
                size={ProgressBarSize.Large}
              />

              <div className="flex gap-3 mt-4">
                <Button
                  size={ButtonSize.Small}
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  -10%
                </Button>
                <Button
                  size={ButtonSize.Small}
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10%
                </Button>
              </div>
            </div>
          </section>

          {/* ImageViewer Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ImageViewer
            </h2>
            <div className="max-w-2xl">
              <ImageViewer
                imageUrl={
                  mockImageVersions.find((v) => v.versionId === selectedVersion)
                    ?.url || null
                }
                alt="Character Preview"
                versions={mockImageVersions}
                selectedVersionId={selectedVersion}
                onSelectVersion={setSelectedVersion}
                onRegenerate={() => console.log("Regenerate clicked")}
                showVersionHistory
              />
            </div>
          </section>

          {/* DropZone Component */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">DropZone</h2>
            <div className="max-w-2xl">
              <DropZone
                onDrop={handleFileUpload}
                acceptedTypes={["image/png", "image/jpeg", "image/jpg"]}
                maxSize={5 * 1024 * 1024}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            View the component source code in{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">
              /src/components
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}
