/**
 * Shared Constants for Interactive Storybook Creator
 *
 * This file contains all constant values and configuration used across the application.
 */

import {
  CharacterCategory,
  ErrorCode,
  GenerationStatus,
  Location,
  NodeType,
  PresetCharacter,
  ReadingProgress,
  SceneImage,
  Story,
  StoryStatistics,
  StoryStatus,
  StoryTree,
} from "./types"

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Base URL for API requests
 * In production, this should be replaced with the actual API endpoint
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  // Story endpoints
  STORIES: "/stories",
  STORY_DETAIL: (id: string) => `/stories/${id}`,
  STORY_TREE: (id: string) => `/stories/${id}/tree`,
  STORY_PUBLISH: (id: string) => `/stories/${id}/publish`,

  // Node endpoints
  NODES: (storyId: string) => `/stories/${storyId}/nodes`,
  NODE_DETAIL: (storyId: string, nodeId: string) =>
    `/stories/${storyId}/nodes/${nodeId}`,

  // Character endpoints
  CHARACTERS: "/characters",
  CHARACTER_ROLES: (storyId: string) => `/stories/${storyId}/roles`,
  CHARACTER_ASSIGNMENTS: (storyId: string) => `/stories/${storyId}/assignments`,

  // Location endpoints
  LOCATIONS: (storyId: string) => `/stories/${storyId}/locations`,
  LOCATION_DETAIL: (storyId: string, locationId: string) =>
    `/stories/${storyId}/locations/${locationId}`,
  GENERATE_BACKGROUND: (storyId: string, locationId: string) =>
    `/stories/${storyId}/locations/${locationId}/generate`,

  // Scene image endpoints
  SCENE_IMAGES: (storyId: string) => `/stories/${storyId}/scene-images`,
  GENERATE_SCENE_IMAGE: (storyId: string, sceneId: string) =>
    `/stories/${storyId}/scenes/${sceneId}/generate`,

  // Job status endpoint
  JOB_STATUS: (jobId: string) => `/jobs/${jobId}`,

  // Reading progress endpoints
  READING_PROGRESS: "/reading-progress",
  READING_PROGRESS_DETAIL: (storyId: string) => `/reading-progress/${storyId}`,

  // Statistics endpoints
  STORY_STATISTICS: (storyId: string) => `/stories/${storyId}/statistics`,
} as const

// ============================================================================
// APPLICATION LIMITS
// ============================================================================

/**
 * Maximum number of characters that can be assigned to a story
 */
export const MAX_CHARACTER_COUNT = 4

/**
 * Maximum number of choices per choice node
 */
export const MAX_CHOICES_PER_NODE = 4

/**
 * Minimum number of choices per choice node
 */
export const MIN_CHOICES_PER_NODE = 2

/**
 * Maximum number of nodes/scenes in a story
 */
export const MAX_SCENE_COUNT = 20

/**
 * Minimum number of nodes/scenes in a story
 */
export const MIN_SCENE_COUNT = 3

/**
 * Maximum length for story title (characters)
 */
export const MAX_TITLE_LENGTH = 100

/**
 * Maximum length for scene text (characters)
 */
export const MAX_SCENE_TEXT_LENGTH = 1000

/**
 * Maximum length for choice text (characters)
 */
export const MAX_CHOICE_TEXT_LENGTH = 200

/**
 * Maximum number of image versions to keep per scene/location
 */
export const MAX_IMAGE_VERSIONS = 5

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Default number of items per page
 */
export const DEFAULT_PAGE_SIZE = 10

/**
 * Maximum number of items per page
 */
export const MAX_PAGE_SIZE = 50

/**
 * Default page number (1-indexed)
 */
export const DEFAULT_PAGE = 1

// ============================================================================
// GENERATION SETTINGS
// ============================================================================

/**
 * Polling interval for checking job status (milliseconds)
 */
export const GENERATION_POLL_INTERVAL = 2000

/**
 * Maximum number of polling attempts before giving up
 */
export const MAX_POLL_ATTEMPTS = 150 // 5 minutes with 2 second intervals

/**
 * Timeout for image generation jobs (milliseconds)
 */
export const GENERATION_TIMEOUT = 300000 // 5 minutes

// ============================================================================
// CACHE AND EXPIRATION
// ============================================================================

/**
 * Cache expiration time for story data (milliseconds)
 */
export const STORY_CACHE_EXPIRATION = 300000 // 5 minutes

/**
 * Cache expiration time for character data (milliseconds)
 */
export const CHARACTER_CACHE_EXPIRATION = 3600000 // 1 hour

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * User-friendly error messages mapped to error codes
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
  [ErrorCode.NETWORK_ERROR]:
    "Network connection failed. Please check your internet connection.",
  [ErrorCode.VALIDATION_ERROR]:
    "Invalid input. Please check your entries and try again.",
  [ErrorCode.NOT_FOUND]: "The requested resource was not found.",
  [ErrorCode.UNAUTHORIZED]: "You are not authorized to perform this action.",
  [ErrorCode.SERVER_ERROR]: "Server error occurred. Please try again later.",
  [ErrorCode.GENERATION_FAILED]: "Image generation failed. Please try again.",
  [ErrorCode.RATE_LIMIT_EXCEEDED]:
    "Too many requests. Please wait a moment and try again.",
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default values for story creation form
 */
export const DEFAULT_STORY_FORM = {
  title: "",
  lesson: "",
  theme: "",
  format: "",
  sceneCount: 5,
} as const

/**
 * Default reading speed (words per minute)
 */
export const DEFAULT_READING_SPEED = 150

/**
 * Common story themes
 */
export const STORY_THEMES = [
  "Honesty",
  "Friendship",
  "Courage",
  "Kindness",
  "Responsibility",
  "Perseverance",
  "Respect",
  "Sharing",
  "Teamwork",
  "Gratitude",
] as const

/**
 * Common story formats
 */
export const STORY_FORMATS = [
  "Adventure",
  "Fantasy",
  "Mystery",
  "Science Fiction",
  "Fairy Tale",
  "Fable",
  "Everyday Life",
  "Historical",
] as const

// ============================================================================
// UI CONSTANTS
// ============================================================================

/**
 * Debounce delay for search input (milliseconds)
 */
export const SEARCH_DEBOUNCE_DELAY = 300

/**
 * Toast notification duration (milliseconds)
 */
export const TOAST_DURATION = 3000

/**
 * Animation duration for transitions (milliseconds)
 */
export const ANIMATION_DURATION = 200

// ============================================================================
// MOCK DATA
// ============================================================================

/**
 * Mock preset characters for development and testing
 */
export const MOCK_PRESET_CHARACTERS: PresetCharacter[] = [
  {
    id: "char-001",
    name: "Luna the Wise Owl",
    imageUrl: "/images/characters/luna-owl.png",
    category: CharacterCategory.ANIMAL,
    description: "A wise and patient owl who guides others with knowledge",
  },
  {
    id: "char-002",
    name: "Max the Brave Lion",
    imageUrl: "/images/characters/max-lion.png",
    category: CharacterCategory.ANIMAL,
    description: "A courageous lion who helps friends face their fears",
  },
  {
    id: "char-003",
    name: "Sparkle the Fairy",
    imageUrl: "/images/characters/sparkle-fairy.png",
    category: CharacterCategory.FANTASY,
    description: "A magical fairy who spreads joy and wonder",
  },
  {
    id: "char-004",
    name: "Dragon Knight Ember",
    imageUrl: "/images/characters/ember-dragon.png",
    category: CharacterCategory.FANTASY,
    description: "A friendly dragon who protects the innocent",
  },
  {
    id: "char-005",
    name: "Sophie the Scientist",
    imageUrl: "/images/characters/sophie-scientist.png",
    category: CharacterCategory.HUMAN,
    description: "A curious scientist who loves to discover and learn",
  },
  {
    id: "char-006",
    name: "Captain Jake",
    imageUrl: "/images/characters/jake-captain.png",
    category: CharacterCategory.HUMAN,
    description: "An adventurous explorer who leads with confidence",
  },
  {
    id: "char-007",
    name: "Chip the Helper Bot",
    imageUrl: "/images/characters/chip-robot.png",
    category: CharacterCategory.ROBOT,
    description: "A friendly robot who loves helping others solve problems",
  },
  {
    id: "char-008",
    name: "Nova the Space Explorer",
    imageUrl: "/images/characters/nova-robot.png",
    category: CharacterCategory.ROBOT,
    description: "An adventurous robot exploring the universe",
  },
  {
    id: "char-009",
    name: "Bella the Bunny",
    imageUrl: "/images/characters/bella-bunny.png",
    category: CharacterCategory.ANIMAL,
    description: "A kind bunny who always shares with friends",
  },
  {
    id: "char-010",
    name: "Wizard Merlin",
    imageUrl: "/images/characters/merlin-wizard.png",
    category: CharacterCategory.FANTASY,
    description: "A wise wizard who teaches important life lessons",
  },
]

/**
 * Mock story data for development and testing
 */
export const MOCK_STORY: Story = {
  id: "story-001",
  title: "The Lost Treasure of Honesty Island",
  lesson:
    "Honesty is always the best policy, even when telling the truth is difficult",
  theme: "Honesty",
  format: "Adventure",
  status: StoryStatus.COMPLETED,
  createdAt: "2025-10-01T10:00:00Z",
  updatedAt: "2025-10-15T14:30:00Z",
  sceneCount: 6,
  readCount: 45,
  isPublished: true,
  authorId: "user-001",
  coverImageUrl: "/images/stories/honesty-island-cover.png",
}

/**
 * Mock story tree with complete branching narrative
 */
export const MOCK_STORY_TREE: StoryTree = {
  storyId: "story-001",
  nodes: [
    {
      id: "node-001",
      sceneNumber: 1,
      title: "The Mysterious Map",
      text: "Luna the Wise Owl and Max the Brave Lion discover an old map in the forest. The map shows the way to a hidden treasure on Honesty Island. They decide to go on an adventure together!",
      location: "Enchanted Forest",
      type: NodeType.START,
      choices: [
        {
          id: "choice-001",
          text: "Set off immediately on the adventure",
          nextNodeId: "node-002",
          isCorrect: true,
        },
      ],
      images: [],
      notes: "Introduction scene - establish the quest",
    },
    {
      id: "node-002",
      sceneNumber: 2,
      title: "The Bridge Guardian",
      text: "At the bridge to Honesty Island, they meet a guardian who asks, \"Have either of you ever taken something that wasn't yours?\" Max once took a cookie without asking, but he's afraid to admit it.",
      location: "Wooden Bridge",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-002",
          text: "Max tells the truth about taking the cookie",
          nextNodeId: "node-003",
          isCorrect: true,
        },
        {
          id: "choice-003",
          text: "Max lies and says he never took anything",
          nextNodeId: "node-004",
          isCorrect: false,
        },
      ],
      images: [],
      notes: "First moral choice - honesty vs. lying",
    },
    {
      id: "node-003",
      sceneNumber: 3,
      title: "The Guardian's Approval",
      text: 'The guardian smiles warmly. "Your honesty shows true courage, Max. Being truthful, even when it\'s hard, is what makes a real hero." The guardian allows them to cross and gives them a golden key.',
      location: "Wooden Bridge",
      type: NodeType.NORMAL,
      choices: [
        {
          id: "choice-004",
          text: "Continue to the island",
          nextNodeId: "node-005",
          isCorrect: true,
        },
      ],
      images: [],
      notes: "Positive reinforcement for honest choice",
    },
    {
      id: "node-004",
      sceneNumber: 4,
      title: "The Guardian's Disappointment",
      text: 'The guardian looks sad. "I can sense you\'re not being truthful, Max. Without honesty, you cannot enter Honesty Island. The treasure here is only for those who are brave enough to tell the truth." Max and Luna must return home empty-handed.',
      location: "Wooden Bridge",
      type: NodeType.BAD_ENDING,
      choices: [],
      images: [],
      notes: "Bad ending - consequence of dishonesty",
    },
    {
      id: "node-005",
      sceneNumber: 5,
      title: "The Treasure Cave",
      text: 'Using the golden key, Max and Luna enter a beautiful cave filled with sparkling gems. In the center is a chest with an inscription: "The real treasure is the courage to be honest, no matter what."',
      location: "Crystal Cave",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-005",
          text: "Take only one gem to remember the lesson",
          nextNodeId: "node-006",
          isCorrect: true,
        },
        {
          id: "choice-006",
          text: "Try to take all the gems",
          nextNodeId: "node-007",
          isCorrect: false,
        },
      ],
      images: [],
      notes: "Second moral choice - greed vs. moderation",
    },
    {
      id: "node-006",
      sceneNumber: 6,
      title: "The True Treasure",
      text: 'Max and Luna each take one gem as a reminder of their adventure. As they leave, the cave fills with light and a message appears: "You have learned that honesty and humility are the greatest treasures. Share this lesson with others!" They return home as heroes, not because of gems, but because they learned an important truth.',
      location: "Crystal Cave",
      type: NodeType.GOOD_ENDING,
      choices: [],
      images: [],
      notes: "Good ending - reward for continued good choices",
    },
    {
      id: "node-007",
      sceneNumber: 7,
      title: "Greed's Consequence",
      text: 'As Max and Luna try to gather all the gems, the cave begins to shake. The gems turn into ordinary stones. A voice echoes: "Greed has no place on Honesty Island. You told the truth to enter, but your actions now show you haven\'t truly learned the lesson." They leave with nothing but the lesson that honesty must be paired with good character.',
      location: "Crystal Cave",
      type: NodeType.BAD_ENDING,
      choices: [],
      images: [],
      notes: "Alternative bad ending - greed undermines earlier honesty",
    },
  ],
  edges: [
    { from: "node-001", to: "node-002", choiceId: "choice-001" },
    { from: "node-002", to: "node-003", choiceId: "choice-002" },
    { from: "node-002", to: "node-004", choiceId: "choice-003" },
    { from: "node-003", to: "node-005", choiceId: "choice-004" },
    { from: "node-005", to: "node-006", choiceId: "choice-005" },
    { from: "node-005", to: "node-007", choiceId: "choice-006" },
  ],
}

/**
 * Mock location/background data
 */
export const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-001",
    storyId: "story-001",
    name: "Enchanted Forest",
    description:
      "A magical forest with tall ancient trees, glowing mushrooms, and soft sunlight filtering through the canopy. Colorful flowers and friendly forest creatures create a welcoming atmosphere.",
    sceneNumbers: [1],
    imageVersions: [
      {
        versionId: "ver-001",
        url: "/images/backgrounds/enchanted-forest-v1.png",
        generatedAt: "2025-10-10T09:00:00Z",
        prompt:
          "magical forest with tall trees and glowing mushrooms, children's book illustration style",
      },
      {
        versionId: "ver-002",
        url: "/images/backgrounds/enchanted-forest-v2.png",
        generatedAt: "2025-10-10T09:15:00Z",
        prompt:
          "enchanted forest with ancient trees, soft sunlight, colorful flowers, whimsical art style",
      },
    ],
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "loc-002",
    storyId: "story-001",
    name: "Wooden Bridge",
    description:
      "An old wooden bridge stretching over a sparkling blue river. The bridge has rope railings and leads to a mysterious island in the distance. Morning mist adds an air of mystery.",
    sceneNumbers: [2, 3, 4],
    imageVersions: [
      {
        versionId: "ver-003",
        url: "/images/backgrounds/wooden-bridge-v1.png",
        generatedAt: "2025-10-10T10:00:00Z",
        prompt:
          "wooden bridge over river with island in distance, morning mist, children's illustration",
      },
    ],
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "loc-003",
    storyId: "story-001",
    name: "Crystal Cave",
    description:
      "A breathtaking cave filled with sparkling crystals in various colors - blue, purple, pink, and gold. The crystals cast beautiful reflections and the cave has a magical, ethereal glow.",
    sceneNumbers: [5, 6, 7],
    imageVersions: [
      {
        versionId: "ver-004",
        url: "/images/backgrounds/crystal-cave-v1.png",
        generatedAt: "2025-10-10T11:00:00Z",
        prompt:
          "magical cave with colorful sparkling crystals, ethereal glow, fantasy art style",
      },
      {
        versionId: "ver-005",
        url: "/images/backgrounds/crystal-cave-v2.png",
        generatedAt: "2025-10-10T11:30:00Z",
        prompt:
          "crystal cave interior, multicolored gems, magical lighting, children's book style",
      },
      {
        versionId: "ver-006",
        url: "/images/backgrounds/crystal-cave-v3.png",
        generatedAt: "2025-10-10T12:00:00Z",
        prompt:
          "treasure cave with glowing crystals, warm magical atmosphere, whimsical illustration",
      },
    ],
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "loc-004",
    storyId: "story-002",
    name: "Space Station",
    description:
      "A futuristic space station with large windows showing stars and planets. High-tech control panels, floating holographic displays, and a view of Earth in the distance.",
    sceneNumbers: [1, 2],
    imageVersions: [],
    generationStatus: GenerationStatus.PENDING,
  },
]

/**
 * Mock scene image data with version history
 */
export const MOCK_SCENE_IMAGES: SceneImage[] = [
  {
    id: "img-001",
    storyId: "story-001",
    sceneId: "node-001",
    sceneNumber: 1,
    versions: [
      {
        versionId: "scene-ver-001",
        url: "/images/scenes/story-001-scene-001-v1.png",
        generatedAt: "2025-10-12T10:00:00Z",
        prompt:
          "Wise owl and brave lion looking at a treasure map in enchanted forest",
      },
      {
        versionId: "scene-ver-002",
        url: "/images/scenes/story-001-scene-001-v2.png",
        generatedAt: "2025-10-12T10:30:00Z",
        prompt:
          "Luna the owl and Max the lion discovering old map, magical forest background",
      },
    ],
    currentVersionId: "scene-ver-002",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "img-002",
    storyId: "story-001",
    sceneId: "node-002",
    sceneNumber: 2,
    versions: [
      {
        versionId: "scene-ver-003",
        url: "/images/scenes/story-001-scene-002-v1.png",
        generatedAt: "2025-10-12T11:00:00Z",
        prompt:
          "Owl and lion meeting wise guardian at wooden bridge, mystical atmosphere",
      },
    ],
    currentVersionId: "scene-ver-003",
    generationStatus: GenerationStatus.COMPLETED,
  },
  {
    id: "img-003",
    storyId: "story-001",
    sceneId: "node-006",
    sceneNumber: 6,
    versions: [
      {
        versionId: "scene-ver-004",
        url: "/images/scenes/story-001-scene-006-v1.png",
        generatedAt: "2025-10-12T12:00:00Z",
        prompt:
          "Owl and lion holding glowing gems in crystal cave, happy ending scene",
      },
      {
        versionId: "scene-ver-005",
        url: "/images/scenes/story-001-scene-006-v2.png",
        generatedAt: "2025-10-12T12:45:00Z",
        prompt:
          "Luna and Max with single gems, magical light in crystal cave, triumphant mood",
      },
      {
        versionId: "scene-ver-006",
        url: "/images/scenes/story-001-scene-006-v3.png",
        generatedAt: "2025-10-12T13:15:00Z",
        prompt:
          "Wise owl and brave lion leaving treasure cave with one gem each, heroic pose",
      },
    ],
    currentVersionId: "scene-ver-006",
    generationStatus: GenerationStatus.COMPLETED,
  },
]

/**
 * Mock reading progress data
 */
export const MOCK_READING_PROGRESS: ReadingProgress = {
  id: "progress-001",
  storyId: "story-001",
  userId: "child-user-001",
  currentNodeId: "node-005",
  visitedNodeIds: ["node-001", "node-002", "node-003", "node-005"],
  choicesMade: ["choice-001", "choice-002", "choice-004"],
  isCompleted: false,
  reachedGoodEnding: false,
  lastReadAt: "2025-10-18T15:30:00Z",
  startedAt: "2025-10-18T15:00:00Z",
}

/**
 * Mock story statistics data
 */
export const MOCK_STORY_STATISTICS: StoryStatistics = {
  storyId: "story-001",
  totalReads: 45,
  completions: 38,
  goodEndings: 32,
  badEndings: 6,
  averageReadingTime: 12.5,
  popularPaths: [
    ["node-001", "node-002", "node-003", "node-005", "node-006"],
    ["node-001", "node-002", "node-004"],
    ["node-001", "node-002", "node-003", "node-005", "node-007"],
  ],
  updatedAt: "2025-10-18T00:00:00Z",
}

/**
 * Mock stories list for testing
 */
export const MOCK_STORIES_LIST: Story[] = [
  MOCK_STORY,
  {
    id: "story-002",
    title: "The Sharing Space Station",
    lesson: "Sharing with others makes everyone happier",
    theme: "Sharing",
    format: "Science Fiction",
    status: StoryStatus.STRUCTURE_FINALIZED,
    createdAt: "2025-10-05T08:00:00Z",
    updatedAt: "2025-10-16T10:00:00Z",
    sceneCount: 5,
    readCount: 12,
    isPublished: false,
    authorId: "user-001",
  },
  {
    id: "story-003",
    title: "The Courage of the Little Dragon",
    lesson: "Being brave means facing your fears, not having no fears",
    theme: "Courage",
    format: "Fantasy",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-28T14:00:00Z",
    updatedAt: "2025-10-12T16:00:00Z",
    sceneCount: 7,
    readCount: 67,
    isPublished: true,
    authorId: "user-002",
    coverImageUrl: "/images/stories/little-dragon-cover.png",
  },
  {
    id: "story-004",
    title: "Friends Help Each Other",
    lesson: "True friends support each other in good times and bad",
    theme: "Friendship",
    format: "Everyday Life",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-15T11:00:00Z",
    updatedAt: "2025-10-17T09:00:00Z",
    sceneCount: 4,
    readCount: 0,
    isPublished: false,
    authorId: "user-001",
  },
]
