/**
 * Mock data for Story Library Page
 */

import { Story, StoryStatus } from "@/types"

/**
 * Statistics for a single story
 */
export interface StoryStatistics {
  storyId: string
  totalReads: number
  averageReadingTime: number // in minutes
  completionRate: number // percentage
  choiceDistribution: ChoiceDistributionData[]
  sceneVisits: SceneVisitData[]
  lastRead?: string
}

/**
 * Choice distribution data for statistics
 */
export interface ChoiceDistributionData {
  choiceText: string
  sceneNumber: number
  selectionCount: number
  percentage: number
}

/**
 * Scene visit data for statistics
 */
export interface SceneVisitData {
  sceneNumber: number
  sceneTitle: string
  visitCount: number
  percentage: number
}

/**
 * Mock stories with mix of completed and drafts
 */
export const mockAllStories: Story[] = [
  // Completed Stories
  {
    id: "story-1",
    title: "The Brave Little Fox",
    lesson: "Being honest earns trust and respect",
    theme: "Honesty",
    format: "Adventure",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-15T14:30:00Z",
    sceneCount: 18,
    readCount: 47,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800",
  },
  {
    id: "story-2",
    title: "The Dragon's Secret Garden",
    lesson: "Courage helps us overcome our fears",
    theme: "Courage",
    format: "Fantasy",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-28T09:15:00Z",
    updatedAt: "2025-10-12T16:45:00Z",
    sceneCount: 22,
    readCount: 89,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1615963244664-5b845b2006d5?w=800",
  },
  {
    id: "story-3",
    title: "Friends Forever",
    lesson: "True friends support each other",
    theme: "Friendship",
    format: "Realistic",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-20T08:30:00Z",
    updatedAt: "2025-10-10T11:20:00Z",
    sceneCount: 15,
    readCount: 124,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800",
  },
  {
    id: "story-4",
    title: "The Kindness Tree",
    lesson: "Small acts of kindness make a big difference",
    theme: "Kindness",
    format: "Fable",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-15T12:00:00Z",
    updatedAt: "2025-10-08T09:30:00Z",
    sceneCount: 20,
    readCount: 67,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
  },
  {
    id: "story-5",
    title: "Sharing is Caring",
    lesson: "Sharing brings joy to everyone",
    theme: "Sharing",
    format: "Adventure",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-10T14:20:00Z",
    updatedAt: "2025-10-05T10:15:00Z",
    sceneCount: 16,
    readCount: 93,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800",
  },
  {
    id: "story-6",
    title: "The Team Quest",
    lesson: "Working together achieves more than working alone",
    theme: "Teamwork",
    format: "Adventure",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-09-05T11:45:00Z",
    updatedAt: "2025-10-02T15:00:00Z",
    sceneCount: 19,
    readCount: 56,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
  },
  {
    id: "story-7",
    title: "The Grateful Heart",
    lesson: "Being grateful makes us happier",
    theme: "Gratitude",
    format: "Realistic",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-08-28T10:30:00Z",
    updatedAt: "2025-09-25T13:45:00Z",
    sceneCount: 14,
    readCount: 38,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
  },
  {
    id: "story-8",
    title: "Never Give Up",
    lesson: "Persistence leads to success",
    theme: "Perseverance",
    format: "Sports",
    status: StoryStatus.COMPLETED,
    createdAt: "2025-08-20T09:00:00Z",
    updatedAt: "2025-09-18T14:30:00Z",
    sceneCount: 21,
    readCount: 102,
    isPublished: true,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800",
  },
  // Draft Stories
  {
    id: "story-9",
    title: "The Respectful Robot",
    lesson: "Showing respect creates harmony",
    theme: "Respect",
    format: "Sci-Fi",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-16T08:00:00Z",
    updatedAt: "2025-10-17T12:00:00Z",
    sceneCount: 12,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
  },
  {
    id: "story-10",
    title: "The Responsibility Rainbow",
    lesson: "Taking responsibility builds character",
    theme: "Responsibility",
    format: "Fantasy",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-14T10:30:00Z",
    updatedAt: "2025-10-17T09:15:00Z",
    sceneCount: 8,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
  },
  {
    id: "story-11",
    title: "The Honest Adventurer",
    lesson: "Honesty is always the best policy",
    theme: "Honesty",
    format: "Mystery",
    status: StoryStatus.STRUCTURE_FINALIZED,
    createdAt: "2025-10-12T14:00:00Z",
    updatedAt: "2025-10-16T16:30:00Z",
    sceneCount: 17,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  },
  {
    id: "story-12",
    title: "The Courage Chronicles",
    lesson: "Bravery means doing what's right despite fear",
    theme: "Courage",
    format: "Adventure",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-10T11:00:00Z",
    updatedAt: "2025-10-15T10:00:00Z",
    sceneCount: 5,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
  },
  {
    id: "story-13",
    title: "The Friendship Forest",
    lesson: "Friends help each other through tough times",
    theme: "Friendship",
    format: "Fantasy",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-08T13:30:00Z",
    updatedAt: "2025-10-14T15:45:00Z",
    sceneCount: 10,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  },
  {
    id: "story-14",
    title: "The Kindness Kingdom",
    lesson: "Acts of kindness create a ripple effect",
    theme: "Kindness",
    format: "Fantasy",
    status: StoryStatus.STRUCTURE_FINALIZED,
    createdAt: "2025-10-05T09:00:00Z",
    updatedAt: "2025-10-13T11:30:00Z",
    sceneCount: 16,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
    coverImageUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
  },
  {
    id: "story-15",
    title: "The Teamwork Tournament",
    lesson: "Together we're stronger",
    theme: "Teamwork",
    format: "Sports",
    status: StoryStatus.DRAFT,
    createdAt: "2025-10-03T10:45:00Z",
    updatedAt: "2025-10-12T14:00:00Z",
    sceneCount: 7,
    readCount: 0,
    isPublished: false,
    authorId: "parent-1",
  },
]

/**
 * Mock statistics for a story
 */
export const mockStatistics: StoryStatistics = {
  storyId: "story-3",
  totalReads: 124,
  averageReadingTime: 12.5,
  completionRate: 87.5,
  choiceDistribution: [
    {
      choiceText: "Help your friend with homework",
      sceneNumber: 3,
      selectionCount: 98,
      percentage: 79.0,
    },
    {
      choiceText: "Go play video games instead",
      sceneNumber: 3,
      selectionCount: 26,
      percentage: 21.0,
    },
    {
      choiceText: "Share your snacks",
      sceneNumber: 7,
      selectionCount: 105,
      percentage: 84.7,
    },
    {
      choiceText: "Keep all the snacks",
      sceneNumber: 7,
      selectionCount: 19,
      percentage: 15.3,
    },
    {
      choiceText: "Invite the new kid to play",
      sceneNumber: 11,
      selectionCount: 112,
      percentage: 90.3,
    },
    {
      choiceText: "Ignore the new kid",
      sceneNumber: 11,
      selectionCount: 12,
      percentage: 9.7,
    },
  ],
  sceneVisits: [
    {
      sceneNumber: 1,
      sceneTitle: "A New Day at School",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 2,
      sceneTitle: "Meeting a Friend",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 3,
      sceneTitle: "A Tough Decision",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 4,
      sceneTitle: "Helping Out",
      visitCount: 98,
      percentage: 79.0,
    },
    {
      sceneNumber: 5,
      sceneTitle: "Playing Alone",
      visitCount: 26,
      percentage: 21.0,
    },
    {
      sceneNumber: 6,
      sceneTitle: "Lunch Time",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 7,
      sceneTitle: "Sharing or Not",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 8,
      sceneTitle: "Making Friends Happy",
      visitCount: 105,
      percentage: 84.7,
    },
    {
      sceneNumber: 9,
      sceneTitle: "Feeling Lonely",
      visitCount: 19,
      percentage: 15.3,
    },
    {
      sceneNumber: 10,
      sceneTitle: "Recess Time",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 11,
      sceneTitle: "A New Kid Arrives",
      visitCount: 124,
      percentage: 100.0,
    },
    {
      sceneNumber: 12,
      sceneTitle: "Best Friends Forever",
      visitCount: 112,
      percentage: 90.3,
    },
    {
      sceneNumber: 13,
      sceneTitle: "Missing Out",
      visitCount: 12,
      percentage: 9.7,
    },
    {
      sceneNumber: 14,
      sceneTitle: "The Lesson Learned",
      visitCount: 108,
      percentage: 87.1,
    },
    {
      sceneNumber: 15,
      sceneTitle: "Happy Ending",
      visitCount: 108,
      percentage: 87.1,
    },
  ],
  lastRead: "2025-10-17T14:30:00Z",
}

/**
 * Empty state messages
 */
export const mockEmptyStates = {
  noStories: {
    icon: "📚",
    title: "Start Your Storytelling Journey!",
    message:
      "You haven't created any stories yet. Click 'Create New Story' to begin crafting magical tales for your children.",
  },
  noCompleted: {
    icon: "✨",
    title: "No Completed Stories Yet",
    message:
      "Complete your first story to see it here. Your published stories will be available for children to read.",
  },
  noDrafts: {
    icon: "🎉",
    title: "All Your Stories Are Complete!",
    message:
      "You don't have any drafts. All your stories are finished and ready to be read!",
  },
  noSearchResults: {
    icon: "🔍",
    title: "No Stories Found",
    message:
      "Try adjusting your search or filters to find what you're looking for.",
  },
}
