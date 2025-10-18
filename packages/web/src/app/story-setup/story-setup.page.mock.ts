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
          text: "Once upon a time, in a magical forest, there lived a brave young hero who discovered something unexpected...",
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
          text: "Following the sound, you discover a small creature in need of help.",
          location: "location-1",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-2-1",
              text: "Help the creature",
              nextNodeId: "node-4",
              isCorrect: true,
            },
            {
              id: "choice-2-2",
              text: "Walk away",
              nextNodeId: "node-5",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-3",
          sceneNumber: 3,
          title: "Missed Opportunity",
          text: "By ignoring the sound, you missed a chance to help someone in need.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-4",
          sceneNumber: 4,
          title: "A Rewarding Friendship",
          text: "Your kindness was rewarded with a wonderful new friend and valuable life lesson.",
          location: "location-3",
          type: NodeType.GOOD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-5",
          sceneNumber: 5,
          title: "Regret",
          text: "You later regretted not helping when you had the chance.",
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
 * Simulate API delay for more realistic testing
 * @param ms Milliseconds to delay
 */
export const simulateDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
