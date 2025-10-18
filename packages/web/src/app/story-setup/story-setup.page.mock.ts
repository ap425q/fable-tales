/**
 * Mock Data for Story Setup Page
 *
 * This file contains mock data to simulate API responses during development.
 */

import { StoryGenerateResponse } from "@/lib/apiTypes"
import { ApiResponse, NodeType } from "@/types"

/**
 * Mock story generation response
 * Simulates a successful story generation with a sample story structure
 */
export const mockStoryGenerateResponse: ApiResponse<StoryGenerateResponse> = {
  success: true,
  data: {
    storyId: "story-mock-12345",
    tree: {
      storyId: "story-mock-12345",
      nodes: [
        {
          id: "node-1",
          sceneNumber: 1,
          title: "The Beginning of an Adventure",
          text: "Once upon a time, in a magical forest, there lived a brave young hero who discovered something unexpected. A mysterious sound echoed through the trees, calling for help.",
          location: "location-1",
          type: NodeType.START,
          choices: [
            {
              id: "choice-1-1",
              text: "Investigate the mysterious sound",
              nextNodeId: "node-2",
              isCorrect: true,
            },
            {
              id: "choice-1-2",
              text: "Ignore it and continue walking",
              nextNodeId: "node-3",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-2",
          sceneNumber: 2,
          title: "A Discovery",
          text: "Following the sound, you discover a small magical creature trapped under a fallen log. The creature looks up at you with hopeful eyes.",
          location: "location-1",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-2-1",
              text: "Help the creature immediately",
              nextNodeId: "node-4",
              isCorrect: true,
            },
            {
              id: "choice-2-2",
              text: "Walk away, it might be dangerous",
              nextNodeId: "node-5",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-3",
          sceneNumber: 3,
          title: "A Lonely Path",
          text: "By ignoring the sound, you continue on the dark path alone. Soon you come across a fork in the road.",
          location: "location-2",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-3-1",
              text: "Go back and help whoever was calling",
              nextNodeId: "node-2",
              isCorrect: true,
            },
            {
              id: "choice-3-2",
              text: "Take the shortcut through the dark woods",
              nextNodeId: "node-6",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-4",
          sceneNumber: 4,
          title: "Gratitude and Friendship",
          text: "You carefully lift the log and free the creature. It's a tiny fairy who sparkles with joy! She thanks you and offers to guide you through the forest.",
          location: "location-1",
          type: NodeType.NORMAL,
          choices: [
            {
              id: "choice-4-1",
              text: "Accept her help gratefully",
              nextNodeId: "node-7",
              isCorrect: true,
            },
            {
              id: "choice-4-2",
              text: "Decline and go on your own",
              nextNodeId: "node-8",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-5",
          sceneNumber: 5,
          title: "Lost in Darkness",
          text: "You walk away from the creature, but guilt weighs heavy on your heart. Soon you find yourself lost in the darkest part of the forest.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-6",
          sceneNumber: 6,
          title: "Missed Opportunity",
          text: "Taking the shortcut, you get lost in the dark woods. You realize too late that helping others might have been the better choice.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-7",
          sceneNumber: 7,
          title: "The Magical Clearing",
          text: "The fairy leads you to a beautiful clearing where all the forest creatures gather. They celebrate your kindness with a grand feast. You've learned that helping others brings joy to everyone!",
          location: "location-3",
          type: NodeType.GOOD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-8",
          sceneNumber: 8,
          title: "Pride Before a Fall",
          text: "Without the fairy's guidance, you get lost and never find your way. You learn that accepting help is important too.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
      ],
      edges: [
        { from: "node-1", to: "node-2", choiceId: "choice-1-1" },
        { from: "node-1", to: "node-3", choiceId: "choice-1-2" },
        { from: "node-2", to: "node-4", choiceId: "choice-2-1" },
        { from: "node-2", to: "node-5", choiceId: "choice-2-2" },
        { from: "node-3", to: "node-2", choiceId: "choice-3-1" },
        { from: "node-3", to: "node-6", choiceId: "choice-3-2" },
        { from: "node-4", to: "node-7", choiceId: "choice-4-1" },
        { from: "node-4", to: "node-8", choiceId: "choice-4-2" },
      ],
    },
    characters: [
      {
        id: "char-role-1",
        role: "Hero",
        description: "A brave and curious young adventurer",
      },
      {
        id: "char-role-2",
        role: "Creature",
        description: "A small magical creature in need of help",
      },
      {
        id: "char-role-3",
        role: "Mentor",
        description: "A wise guide who appears at key moments",
      },
      {
        id: "char-role-4",
        role: "Friend",
        description: "A loyal companion on the journey",
      },
    ],
    locations: [
      {
        id: "location-1",
        name: "Magical Forest",
        sceneNumbers: [1, 2],
        description:
          "A lush forest filled with ancient trees and mystical energy",
      },
      {
        id: "location-2",
        name: "Dark Path",
        sceneNumbers: [3, 5],
        description: "A shadowy trail where regrets linger",
      },
      {
        id: "location-3",
        name: "Sunny Clearing",
        sceneNumbers: [4],
        description: "A beautiful open space where friendships bloom",
      },
    ],
  },
}

/**
 * Mock error response for testing error handling
 */
export const mockStoryGenerateError = {
  success: false,
  error: {
    code: "GENERATION_FAILED",
    message: "Failed to generate story. Please try again.",
  },
}

/**
 * Mock form examples for quick testing
 * These are pre-filled examples that users can select to quickly try the app
 */
export const mockFormExamples = [
  {
    id: "example-1",
    title: "Honesty Story",
    description: "Magical forest • Aesop's fable style",
    formData: {
      lesson: "Honesty is always the best policy",
      theme: "Magical forest with talking animals",
      storyFormat: "Aesop's fable style with clear moral",
    },
  },
  {
    id: "example-2",
    title: "Sharing Story",
    description: "Space adventure • Sci-fi style",
    formData: {
      lesson: "Sharing makes everyone happier",
      theme: "Space station with friendly aliens",
      storyFormat: "Science fiction adventure",
    },
  },
  {
    id: "example-3",
    title: "Courage Story",
    description: "Medieval kingdom • Hero's journey",
    formData: {
      lesson: "Courage means facing your fears",
      theme: "Medieval kingdom with dragons",
      storyFormat: "Classic hero's journey",
    },
  },
  {
    id: "example-4",
    title: "Friendship Story",
    description: "School setting • Realistic style",
    formData: {
      lesson: "True friends support each other",
      theme: "School playground and neighborhood",
      storyFormat: "Everyday life, realistic story",
    },
  },
]

/**
 * Simulate API delay for more realistic testing
 * @param ms Milliseconds to delay
 */
export const simulateDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
