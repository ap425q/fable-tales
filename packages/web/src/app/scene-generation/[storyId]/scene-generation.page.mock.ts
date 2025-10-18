/**
 * Mock Data for Scene Image Generation Page
 */

import { SceneGenerationStatus } from "@/lib/apiTypes"
import { GenerationStatus, ImageVersion, NodeType, StoryNode } from "@/types"

/**
 * Simulate network delay
 */
export const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Scene data with images and version history
 */
export interface SceneWithImages extends StoryNode {
  /** Selected version ID for the scene */
  selectedVersionId?: string
  /** Array of generated image versions */
  imageVersions: ImageVersion[]
  /** Generation status */
  generationStatus: GenerationStatus
  /** Characters used in this scene */
  characterIds: string[]
  /** Background/location used */
  backgroundId: string
}

/**
 * Mock scene images with different states
 * - Some with multiple versions
 * - One generating
 * - One failed
 * - Most completed
 */
export const mockSceneImages: SceneWithImages[] = [
  {
    id: "scene-1",
    sceneNumber: 1,
    title: "The Forest Entrance",
    text: "Emma stood at the edge of the Enchanted Forest, her heart racing with excitement. The tall trees seemed to whisper ancient secrets.",
    location: "Enchanted Forest",
    type: NodeType.START,
    choices: [],
    images: [],
    characterIds: ["char-1"],
    backgroundId: "bg-1",
    imageVersions: [
      {
        versionId: "v1-scene1",
        url: "https://picsum.photos/seed/scene1v1/1200/800",
        generatedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        versionId: "v2-scene1",
        url: "https://picsum.photos/seed/scene1v2/1200/800",
        generatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        versionId: "v3-scene1",
        url: "https://picsum.photos/seed/scene1v3/1200/800",
        generatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    selectedVersionId: "v3-scene1",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-2",
    sceneNumber: 2,
    title: "Meeting the Wise Owl",
    text: "A wise old owl perched on a branch above, his golden eyes twinkling with knowledge. 'Welcome, young adventurer,' he hooted softly.",
    location: "Enchanted Forest",
    type: NodeType.NORMAL,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-2"],
    backgroundId: "bg-1",
    imageVersions: [
      {
        versionId: "v1-scene2",
        url: "https://picsum.photos/seed/scene2v1/1200/800",
        generatedAt: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    selectedVersionId: "v1-scene2",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-3",
    sceneNumber: 3,
    title: "The Mysterious Path",
    text: "Two paths lay before Emma. One glowed with golden light, the other shimmered with silver moonbeams. Which way should she go?",
    location: "Enchanted Forest",
    type: NodeType.CHOICE,
    choices: [],
    images: [],
    characterIds: ["char-1"],
    backgroundId: "bg-1",
    imageVersions: [
      {
        versionId: "v1-scene3",
        url: "https://picsum.photos/seed/scene3v1/1200/800",
        generatedAt: new Date(Date.now() - 4500000).toISOString(),
      },
      {
        versionId: "v2-scene3",
        url: "https://picsum.photos/seed/scene3v2/1200/800",
        generatedAt: new Date(Date.now() - 2700000).toISOString(),
      },
    ],
    selectedVersionId: "v2-scene3",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-4",
    sceneNumber: 4,
    title: "The Castle Gates",
    text: "The magnificent castle rose before Emma, its towers reaching toward the clouds. Guards in shining armor stood at the gate.",
    location: "Royal Castle",
    type: NodeType.NORMAL,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-3"],
    backgroundId: "bg-2",
    imageVersions: [],
    generationStatus: GenerationStatus.GENERATING,
  },
  {
    id: "scene-5",
    sceneNumber: 5,
    title: "The Throne Room",
    text: "Inside the grand throne room, the kind queen sat upon her golden throne, a warm smile on her face as Emma approached.",
    location: "Royal Castle",
    type: NodeType.NORMAL,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-4"],
    backgroundId: "bg-2",
    imageVersions: [
      {
        versionId: "v1-scene5",
        url: "https://picsum.photos/seed/scene5v1/1200/800",
        generatedAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        versionId: "v2-scene5",
        url: "https://picsum.photos/seed/scene5v2/1200/800",
        generatedAt: new Date(Date.now() - 1500000).toISOString(),
      },
      {
        versionId: "v3-scene5",
        url: "https://picsum.photos/seed/scene5v3/1200/800",
        generatedAt: new Date(Date.now() - 900000).toISOString(),
      },
      {
        versionId: "v4-scene5",
        url: "https://picsum.photos/seed/scene5v4/1200/800",
        generatedAt: new Date(Date.now() - 600000).toISOString(),
      },
    ],
    selectedVersionId: "v4-scene5",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-6",
    sceneNumber: 6,
    title: "The Village Square",
    text: "Emma arrived at the peaceful riverside village where children played happily and merchants sold their wares.",
    location: "Riverside Village",
    type: NodeType.NORMAL,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-5"],
    backgroundId: "bg-3",
    imageVersions: [
      {
        versionId: "v1-scene6",
        url: "https://picsum.photos/seed/scene6v1/1200/800",
        generatedAt: new Date(Date.now() - 4800000).toISOString(),
      },
    ],
    selectedVersionId: "v1-scene6",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-7",
    sceneNumber: 7,
    title: "The Dark Cave Entrance",
    text: "A mysterious cave loomed before Emma, its entrance dark and foreboding. Strange sounds echoed from within.",
    location: "Dark Cave",
    type: NodeType.CHOICE,
    choices: [],
    images: [],
    characterIds: ["char-1"],
    backgroundId: "bg-4",
    imageVersions: [],
    generationStatus: GenerationStatus.FAILED,
  },
  {
    id: "scene-8",
    sceneNumber: 8,
    title: "The Crystal Chamber",
    text: "Deep within the cave, Emma discovered a chamber filled with glowing crystals that bathed everything in rainbow light.",
    location: "Dark Cave",
    type: NodeType.NORMAL,
    choices: [],
    images: [],
    characterIds: ["char-1"],
    backgroundId: "bg-4",
    imageVersions: [
      {
        versionId: "v1-scene8",
        url: "https://picsum.photos/seed/scene8v1/1200/800",
        generatedAt: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        versionId: "v2-scene8",
        url: "https://picsum.photos/seed/scene8v2/1200/800",
        generatedAt: new Date(Date.now() - 1200000).toISOString(),
      },
    ],
    selectedVersionId: "v1-scene8",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-9",
    sceneNumber: 9,
    title: "The Final Challenge",
    text: "Emma faced her greatest challenge yet - a riddle that would determine her fate. She took a deep breath and began to think.",
    location: "Royal Castle",
    type: NodeType.CHOICE,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-2", "char-4"],
    backgroundId: "bg-2",
    imageVersions: [
      {
        versionId: "v1-scene9",
        url: "https://picsum.photos/seed/scene9v1/1200/800",
        generatedAt: new Date(Date.now() - 2400000).toISOString(),
      },
    ],
    selectedVersionId: "v1-scene9",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "scene-10",
    sceneNumber: 10,
    title: "A Happy Ending",
    text: "With wisdom and courage, Emma had completed her journey. The forest, castle, and all its inhabitants celebrated her success!",
    location: "Enchanted Forest",
    type: NodeType.GOOD_ENDING,
    choices: [],
    images: [],
    characterIds: ["char-1", "char-2", "char-3", "char-4", "char-5"],
    backgroundId: "bg-1",
    imageVersions: [
      {
        versionId: "v1-scene10",
        url: "https://picsum.photos/seed/scene10v1/1200/800",
        generatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        versionId: "v2-scene10",
        url: "https://picsum.photos/seed/scene10v2/1200/800",
        generatedAt: new Date(Date.now() - 900000).toISOString(),
      },
    ],
    selectedVersionId: "v2-scene10",
    generationStatus: GenerationStatus.COMPLETED,
  },
]

/**
 * Mock generation status - Initial state (just started)
 */
export const mockGenerationStatusInitial: SceneGenerationStatus = {
  status: "in_progress",
  scenes: mockSceneImages.map((scene) => ({
    sceneId: scene.id,
    sceneNumber: scene.sceneNumber,
    status: "generating",
    currentImageUrl: null,
  })),
  progress: {
    completed: 0,
    total: mockSceneImages.length,
  },
}

/**
 * Mock generation status - In progress (some completed)
 */
export const mockGenerationStatusProgress: SceneGenerationStatus = {
  status: "in_progress",
  scenes: [
    {
      sceneId: "scene-1",
      sceneNumber: 1,
      status: "completed",
      currentImageUrl: "https://picsum.photos/seed/scene1v1/1200/800",
      currentVersionId: "v1-scene1",
    },
    {
      sceneId: "scene-2",
      sceneNumber: 2,
      status: "completed",
      currentImageUrl: "https://picsum.photos/seed/scene2v1/1200/800",
      currentVersionId: "v1-scene2",
    },
    {
      sceneId: "scene-3",
      sceneNumber: 3,
      status: "completed",
      currentImageUrl: "https://picsum.photos/seed/scene3v1/1200/800",
      currentVersionId: "v1-scene3",
    },
    {
      sceneId: "scene-4",
      sceneNumber: 4,
      status: "generating",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-5",
      sceneNumber: 5,
      status: "pending",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-6",
      sceneNumber: 6,
      status: "pending",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-7",
      sceneNumber: 7,
      status: "pending",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-8",
      sceneNumber: 8,
      status: "pending",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-9",
      sceneNumber: 9,
      status: "pending",
      currentImageUrl: null,
    },
    {
      sceneId: "scene-10",
      sceneNumber: 10,
      status: "pending",
      currentImageUrl: null,
    },
  ],
  progress: {
    completed: 3,
    total: mockSceneImages.length,
  },
}

/**
 * Mock generation status - Completed (all done)
 */
export const mockGenerationStatusCompleted: SceneGenerationStatus = {
  status: "completed",
  scenes: mockSceneImages
    .filter((scene) => scene.generationStatus === GenerationStatus.COMPLETED)
    .map((scene) => ({
      sceneId: scene.id,
      sceneNumber: scene.sceneNumber,
      status: "completed",
      currentImageUrl: scene.imageVersions[0]?.url || null,
      currentVersionId: scene.imageVersions[0]?.versionId,
    })),
  progress: {
    completed: mockSceneImages.filter(
      (scene) => scene.generationStatus === GenerationStatus.COMPLETED
    ).length,
    total: mockSceneImages.length,
  },
}

/**
 * Simulate generation status polling
 * Returns different states based on poll count
 */
export const simulateGenerationPolling = (
  pollCount: number
): SceneGenerationStatus => {
  if (pollCount < 2) {
    return mockGenerationStatusInitial
  } else if (pollCount < 5) {
    return mockGenerationStatusProgress
  } else {
    return mockGenerationStatusCompleted
  }
}

/**
 * Mock character data for displaying character icons
 */
export interface MockCharacter {
  id: string
  name: string
  imageUrl: string
}

export const mockCharacters: MockCharacter[] = [
  {
    id: "char-1",
    name: "Emma",
    imageUrl: "/characters/f_emma.png",
  },
  {
    id: "char-2",
    name: "Wise Owl",
    imageUrl: "/characters/m_james.png",
  },
  {
    id: "char-3",
    name: "Guard",
    imageUrl: "/characters/m_william.png",
  },
  {
    id: "char-4",
    name: "Queen",
    imageUrl: "/characters/f_sophia.png",
  },
  {
    id: "char-5",
    name: "Villager",
    imageUrl: "/characters/f_olivia.png",
  },
]
