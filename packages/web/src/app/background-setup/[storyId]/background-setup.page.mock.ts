/**
 * Mock Data for Background Setup Page
 */

import { BackgroundGenerationStatus } from "@/lib/apiTypes"
import { GenerationStatus, Location } from "@/types"

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock background data with different states
 */
export const mockBackgrounds: Location[] = [
  {
    id: "bg-1",
    storyId: "story-123",
    name: "Enchanted Forest",
    description:
      "A magical forest filled with tall ancient trees, glowing mushrooms, and sparkling fireflies dancing between the branches.",
    sceneNumbers: [1, 3, 5, 8],
    imageVersions: [
      {
        versionId: "v1-bg1",
        url: "https://picsum.photos/seed/forest1/800/600",
        generatedAt: new Date(Date.now() - 3600000).toISOString(),
        prompt: "magical forest with ancient trees",
      },
      {
        versionId: "v2-bg1",
        url: "https://picsum.photos/seed/forest2/800/600",
        generatedAt: new Date(Date.now() - 1800000).toISOString(),
        prompt: "enchanted forest with glowing elements",
      },
    ],
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "bg-2",
    storyId: "story-123",
    name: "Royal Castle",
    description:
      "A grand castle with tall towers, stone walls, and colorful banners waving in the wind.",
    sceneNumbers: [2, 6, 9],
    imageVersions: [],
    generationStatus: GenerationStatus.GENERATING,
  },
  {
    id: "bg-3",
    storyId: "story-123",
    name: "Riverside Village",
    description:
      "A peaceful village by a sparkling river with small cottages, a wooden bridge, and boats gently floating.",
    sceneNumbers: [4, 7],
    imageVersions: [
      {
        versionId: "v1-bg3",
        url: "https://picsum.photos/seed/village1/800/600",
        generatedAt: new Date(Date.now() - 7200000).toISOString(),
        prompt: "peaceful riverside village",
      },
    ],
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "bg-4",
    storyId: "story-123",
    name: "Dark Cave",
    description: "",
    sceneNumbers: [10, 11],
    imageVersions: [],
    generationStatus: GenerationStatus.PENDING,
  },
]

/**
 * Mock generation status - Initial state (just started)
 */
export const mockGenerationStatusInitial: BackgroundGenerationStatus = {
  status: "in_progress",
  backgrounds: [
    {
      backgroundId: "bg-1",
      status: "generating",
      imageUrl: null,
    },
    {
      backgroundId: "bg-2",
      status: "pending",
      imageUrl: null,
    },
    {
      backgroundId: "bg-3",
      status: "pending",
      imageUrl: null,
    },
    {
      backgroundId: "bg-4",
      status: "pending",
      imageUrl: null,
    },
  ],
  progress: {
    completed: 0,
    total: 4,
  },
}

/**
 * Mock generation status - In progress
 */
export const mockGenerationStatusProgress: BackgroundGenerationStatus = {
  status: "in_progress",
  backgrounds: [
    {
      backgroundId: "bg-1",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/forest1/800/600",
      versionId: "v1-bg1",
    },
    {
      backgroundId: "bg-2",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/castle1/800/600",
      versionId: "v1-bg2",
    },
    {
      backgroundId: "bg-3",
      status: "generating",
      imageUrl: null,
    },
    {
      backgroundId: "bg-4",
      status: "pending",
      imageUrl: null,
    },
  ],
  progress: {
    completed: 2,
    total: 4,
  },
}

/**
 * Mock generation status - Completed
 */
export const mockGenerationStatusCompleted: BackgroundGenerationStatus = {
  status: "completed",
  backgrounds: [
    {
      backgroundId: "bg-1",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/forest1/800/600",
      versionId: "v1-bg1",
    },
    {
      backgroundId: "bg-2",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/castle1/800/600",
      versionId: "v1-bg2",
    },
    {
      backgroundId: "bg-3",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/village1/800/600",
      versionId: "v1-bg3",
    },
    {
      backgroundId: "bg-4",
      status: "completed",
      imageUrl: "https://picsum.photos/seed/cave1/800/600",
      versionId: "v1-bg4",
    },
  ],
  progress: {
    completed: 4,
    total: 4,
  },
}

/**
 * Simulate generation status polling
 * Returns different states based on poll count
 */
export const simulateGenerationPolling = (
  pollCount: number
): BackgroundGenerationStatus => {
  if (pollCount < 2) {
    return mockGenerationStatusInitial
  } else if (pollCount < 4) {
    return mockGenerationStatusProgress
  } else {
    return mockGenerationStatusCompleted
  }
}
