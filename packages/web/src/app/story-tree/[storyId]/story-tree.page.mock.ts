/**
 * Mock Data for Story Tree Editor Page - FIXED VERSION
 *
 * This file contains comprehensive mock data for testing the story tree editor
 * including complex branching scenarios with multiple paths and endings.
 *
 * FIXES:
 * - Changed node-2 from NORMAL to CHOICE (Scene nodes can't have multiple children)
 */

import { ApiResponse, NodeType, StoryStatus } from "@/types"

/**
 * Full story details response for the tree editor
 */
export interface StoryDetailsResponse {
  id: string
  title: string
  lesson: string
  theme: string
  storyFormat: string
  status: StoryStatus
  tree: {
    storyId: string
    nodes: MockStoryNode[]
    edges: MockStoryEdge[]
  }
  characters: MockCharacterRole[]
  locations: MockLocationInfo[]
  createdAt: string
  updatedAt: string
}

export interface MockStoryNode {
  id: string
  sceneNumber: number
  title: string
  text: string
  location: string
  type: NodeType
  choices: MockChoice[]
  images: string[]
}

export interface MockChoice {
  id: string
  text: string
  nextNodeId: string | null
  isCorrect: boolean
}

export interface MockStoryEdge {
  from: string
  to: string
  choiceId: string
}

export interface MockCharacterRole {
  id: string
  role: string
  description: string
}

export interface MockLocationInfo {
  id: string
  name: string
  sceneNumbers: number[]
  description: string
}

/**
 * Mock story tree data with complex branching
 * Demonstrates:
 * - 1 start node
 * - 3 choice nodes (node-2, node-4, node-6)
 * - 4 normal/scene nodes (node-5, node-8, node-9 removed, replaced with direct path)
 * - 1 good ending (node-11)
 * - 3 bad endings (node-3, node-7, node-10)
 */
export const mockStoryTreeData: ApiResponse<StoryDetailsResponse> = {
  success: true,
  data: {
    id: "story-456",
    title: "The Forest Friends' Adventure",
    lesson: "Helping others and working together brings happiness",
    theme: "Forest animals learning about friendship and cooperation",
    storyFormat: "Choose your own adventure with moral lessons",
    status: StoryStatus.DRAFT,
    tree: {
      storyId: "story-456",
      nodes: [
        {
          id: "node-1",
          sceneNumber: 1,
          title: "A Cry for Help",
          text: "In the heart of the Magical Forest, a young rabbit named Ruby heard a distant cry. 'Help! Someone help me!' The voice echoed through the trees. Ruby looked around nervously, wondering what to do.",
          location: "location-1",
          type: NodeType.START,
          choices: [
            {
              id: "choice-1-1",
              text: "Run toward the cry to help",
              nextNodeId: "node-2",
              isCorrect: true,
            },
            {
              id: "choice-1-2",
              text: "Ignore it and continue gathering berries",
              nextNodeId: "node-3",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-2",
          sceneNumber: 2,
          title: "The Trapped Squirrel",
          text: "Ruby hopped quickly through the bushes and found a small squirrel named Sam trapped under a fallen branch. 'Thank you for coming!' Sam squeaked. 'I can't move this branch by myself!'",
          location: "location-1",
          type: NodeType.CHOICE, // FIXED: Changed from NORMAL to CHOICE
          choices: [
            {
              id: "choice-2-1",
              text: "Try to help move the branch alone",
              nextNodeId: "node-4",
              isCorrect: false,
            },
            {
              id: "choice-2-2",
              text: "Go find more friends to help",
              nextNodeId: "node-5",
              isCorrect: true,
            },
          ],
          images: [],
        },
        {
          id: "node-3",
          sceneNumber: 3,
          title: "The Lonely Path",
          text: "Ruby continued gathering berries, but the cry kept echoing in her mind. She felt uneasy and alone. The forest seemed darker somehow. Soon she realized she was lost.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-4",
          sceneNumber: 4,
          title: "Too Heavy Alone",
          text: "Ruby pushed and pulled with all her might, but the branch was too heavy. Sam looked worried. 'Maybe we need more help?' he suggested. Ruby realized he was right.",
          location: "location-1",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-4-1",
              text: "Keep trying alone stubbornly",
              nextNodeId: "node-7",
              isCorrect: false,
            },
            {
              id: "choice-4-2",
              text: "Agree and go find friends",
              nextNodeId: "node-5",
              isCorrect: true,
            },
          ],
          images: [],
        },
        {
          id: "node-5",
          sceneNumber: 5,
          title: "Gathering Friends",
          text: "Ruby hopped through the forest calling for help. Soon she found Bear, Owl, and Fox playing by the river. 'We need help to save Sam!' Ruby explained. Her friends immediately agreed to come.",
          location: "location-3",
          type: NodeType.NORMAL,
          choices: [
            {
              id: "choice-5-1",
              text: "Lead everyone back to Sam",
              nextNodeId: "node-6",
              isCorrect: true,
            },
          ],
          images: [],
        },
        {
          id: "node-6",
          sceneNumber: 6,
          title: "The Big Decision",
          text: "All the friends gathered around Sam and the branch. Bear looked at the heavy branch and said, 'This will be tricky. How should we do this?'",
          location: "location-1",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-6-1",
              text: "Everyone push together on Bear's count",
              nextNodeId: "node-8",
              isCorrect: true,
            },
            {
              id: "choice-6-2",
              text: "Each animal try different things at once",
              nextNodeId: "node-9",
              isCorrect: false,
            },
            {
              id: "choice-6-3",
              text: "Give up and say it's impossible",
              nextNodeId: "node-10",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-7",
          sceneNumber: 7,
          title: "Pride and Exhaustion",
          text: "Ruby kept trying to move the branch alone, refusing to admit she needed help. After hours of struggling, she collapsed from exhaustion. Sam remained trapped as night fell. Ruby learned that sometimes asking for help is the brave thing to do.",
          location: "location-1",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-8",
          sceneNumber: 8,
          title: "Teamwork Success",
          text: "Bear counted, 'One, two, three!' All the friends pushed together with perfect timing. The branch lifted! Sam scrambled out safely. 'Thank you all!' he cheered. 'You saved me by working together!'",
          location: "location-1",
          type: NodeType.NORMAL,
          choices: [
            {
              id: "choice-8-1",
              text: "Celebrate with Sam",
              nextNodeId: "node-11",
              isCorrect: true,
            },
          ],
          images: [],
        },
        {
          id: "node-9",
          sceneNumber: 9,
          title: "Chaos and Confusion",
          text: "Without coordination, Bear pushed while Fox pulled and Owl tried to dig underneath. They bumped into each other and nothing worked. After realizing their mistake, they tried again with a better plan.",
          location: "location-1",
          type: NodeType.CHOICE,
          choices: [
            {
              id: "choice-9-1",
              text: "Try working together this time",
              nextNodeId: "node-8",
              isCorrect: true,
            },
            {
              id: "choice-9-2",
              text: "Give up frustrated",
              nextNodeId: "node-10",
              isCorrect: false,
            },
          ],
          images: [],
        },
        {
          id: "node-10",
          sceneNumber: 10,
          title: "The Sad Giving Up",
          text: "The friends walked away, leaving Sam trapped and crying. They felt terrible about giving up. That night, none of them could sleep, thinking about their friend they left behind. They learned that persistence is important.",
          location: "location-2",
          type: NodeType.BAD_ENDING,
          choices: [],
          images: [],
        },
        {
          id: "node-11",
          sceneNumber: 11,
          title: "The Great Forest Feast",
          text: "All the forest animals gathered for a wonderful celebration! Sam, now free, brought acorns he had been saving. Ruby shared her berries. Everyone contributed something. They feasted, laughed, and danced under the stars. Ruby felt so happy that she had chosen to help. She learned that working together and helping others brings the greatest joy to everyone!",
          location: "location-3",
          type: NodeType.GOOD_ENDING,
          choices: [],
          images: [],
        },
      ],
      edges: [
        { from: "node-1", to: "node-2", choiceId: "choice-1-1" },
        { from: "node-1", to: "node-3", choiceId: "choice-1-2" },
        { from: "node-2", to: "node-4", choiceId: "choice-2-1" },
        { from: "node-2", to: "node-5", choiceId: "choice-2-2" },
        { from: "node-4", to: "node-7", choiceId: "choice-4-1" },
        { from: "node-4", to: "node-5", choiceId: "choice-4-2" },
        { from: "node-5", to: "node-6", choiceId: "choice-5-1" },
        { from: "node-6", to: "node-8", choiceId: "choice-6-1" },
        { from: "node-6", to: "node-9", choiceId: "choice-6-2" },
        { from: "node-6", to: "node-10", choiceId: "choice-6-3" },
        { from: "node-8", to: "node-11", choiceId: "choice-8-1" },
        { from: "node-9", to: "node-8", choiceId: "choice-9-1" },
        { from: "node-9", to: "node-10", choiceId: "choice-9-2" },
      ],
    },
    characters: [
      {
        id: "char-role-1",
        role: "Protagonist",
        description: "Ruby the brave rabbit - kind and helpful",
      },
      {
        id: "char-role-2",
        role: "Friend in Need",
        description: "Sam the squirrel - trapped and needing rescue",
      },
      {
        id: "char-role-3",
        role: "Wise Helper",
        description: "Bear the strong - leader of the rescue team",
      },
      {
        id: "char-role-4",
        role: "Supporting Friends",
        description: "Owl and Fox - part of the helping team",
      },
    ],
    locations: [
      {
        id: "location-1",
        name: "Magical Forest",
        sceneNumbers: [1, 2, 4, 6, 7, 8, 9],
        description:
          "A lush, vibrant forest with tall trees, dappled sunlight, and colorful wildflowers",
      },
      {
        id: "location-2",
        name: "Dark Forest Path",
        sceneNumbers: [3, 10],
        description:
          "A shadowy, lonely path where the trees grow thick and the sunlight barely reaches",
      },
      {
        id: "location-3",
        name: "River Clearing",
        sceneNumbers: [5, 11],
        description:
          "A beautiful open space beside a sparkling river, perfect for gathering and celebrating",
      },
    ],
    createdAt: "2025-10-18T10:30:00Z",
    updatedAt: "2025-10-18T11:45:00Z",
  },
}

/**
 * Mock node data for editing panel
 * Example of a fully editable node with all fields
 */
export const mockNodeData: MockStoryNode = {
  id: "node-6",
  sceneNumber: 6,
  title: "The Big Decision",
  text: "All the friends gathered around Sam and the branch. Bear looked at the heavy branch and said, 'This will be tricky. How should we do this?'",
  location: "location-1",
  type: NodeType.CHOICE,
  choices: [
    {
      id: "choice-6-1",
      text: "Everyone push together on Bear's count",
      nextNodeId: "node-8",
      isCorrect: true,
    },
    {
      id: "choice-6-2",
      text: "Each animal try different things at once",
      nextNodeId: "node-9",
      isCorrect: false,
    },
    {
      id: "choice-6-3",
      text: "Give up and say it's impossible",
      nextNodeId: "node-10",
      isCorrect: false,
    },
  ],
  images: [],
}

/**
 * Mock update response
 */
export const mockNodeUpdateResponse: ApiResponse<{ node: MockStoryNode }> = {
  success: true,
  data: {
    node: {
      id: "node-6",
      sceneNumber: 6,
      title: "The Big Decision (Updated)",
      text: "All the friends gathered around Sam and the branch. Bear looked at the heavy branch and said, 'This will be tricky. How should we do this?' Everyone looked to Ruby for guidance.",
      location: "location-1",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-6-1",
          text: "Everyone push together on Bear's count",
          nextNodeId: "node-8",
          isCorrect: true,
        },
        {
          id: "choice-6-2",
          text: "Each animal try different things at once",
          nextNodeId: "node-9",
          isCorrect: false,
        },
      ],
      images: [],
    },
  },
}

/**
 * Mock add node response
 */
export const mockNodeAddResponse: ApiResponse<{ node: MockStoryNode }> = {
  success: true,
  data: {
    node: {
      id: "node-12",
      sceneNumber: 12,
      title: "New Scene",
      text: "This is a new scene that was just added to the story.",
      location: "location-1",
      type: NodeType.NORMAL,
      choices: [
        {
          id: "choice-12-1",
          text: "Continue",
          nextNodeId: null,
          isCorrect: true,
        },
      ],
      images: [],
    },
  },
}

/**
 * Mock delete node response
 */
export const mockNodeDeleteResponse: ApiResponse<{
  deletedNodeId: string
  affectedNodes: string[]
  message: string
}> = {
  success: true,
  data: {
    deletedNodeId: "node-10",
    affectedNodes: ["node-6", "node-9"],
    message: "Node deleted successfully",
  },
}

/**
 * Simulate API delay for realistic testing
 */
export const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
