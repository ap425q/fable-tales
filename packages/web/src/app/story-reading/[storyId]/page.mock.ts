/**
 * Mock data for Story Reading Page
 */

import { NodeType } from "@/types"

/**
 * Mock story data with complete branching narrative
 */
export const mockStoryReadData = {
  id: "story-123",
  title: "The Forest of Friendship",
  lesson: "True friends help each other even when it's difficult",
  startNodeId: "node-1",
  nodes: [
    // START NODE
    {
      id: "node-1",
      sceneNumber: 1,
      title: "A New Adventure Begins",
      text: 'Once upon a time, in a cozy little cottage at the edge of an enchanted forest, lived a curious young rabbit named Luna. One sunny morning, Luna heard a small voice calling for help from the forest. "Someone needs me!" Luna thought, putting on her little backpack.',
      imageUrl: "/api/placeholder/800/600?text=Luna+at+Cottage",
      type: NodeType.START,
      choices: [
        {
          id: "choice-1",
          text: "Go into the forest to help",
          nextNodeId: "node-2",
          isCorrect: true,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // CHOICE NODE 1
    {
      id: "node-2",
      sceneNumber: 2,
      title: "Into the Forest",
      text: 'Luna hopped into the forest and soon found a small bird with a hurt wing sitting on a fallen log. "Please help me," chirped the bird. "I can\'t fly home to my nest in the tall oak tree." Luna looked around and saw two paths - one with thorny bushes but much shorter, and another that was longer but safer.',
      imageUrl: "/api/placeholder/800/600?text=Luna+Finds+Bird",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-2a",
          text: "Take the short path through the thorns",
          nextNodeId: "node-3-bad",
          isCorrect: false,
        },
        {
          id: "choice-2b",
          text: "Take the longer, safer path",
          nextNodeId: "node-3",
          isCorrect: true,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // BAD ENDING 1
    {
      id: "node-3-bad",
      sceneNumber: 3,
      title: "The Thorny Trouble",
      text: "Luna rushed through the thorny bushes, trying to take the shortcut. But the thorns scratched her paws and scared the little bird even more! The bird flew away in fright, still hurt. Luna sat down, feeling sad. Sometimes the quick way isn't the best way when you're trying to help a friend.",
      imageUrl: "/api/placeholder/800/600?text=Luna+in+Thorns",
      type: NodeType.BAD_ENDING,
      choices: [],
      lessonMessage:
        "Taking time to choose a safe path shows you truly care about your friend's wellbeing. Quick isn't always best!",
      previousNodeId: "node-2",
    },
    // NORMAL NODE
    {
      id: "node-3",
      sceneNumber: 3,
      title: "The Safe Journey",
      text: 'Luna carefully carried the bird along the longer path, making sure not to bump or jostle her new friend. "Thank you for being so gentle," the bird sang softly. As they walked, they met a wise old turtle. "I know where the oak tree is," said the turtle, "but there are two oak trees - one near the stream and one near the meadow."',
      imageUrl: "/api/placeholder/800/600?text=Luna+with+Bird+and+Turtle",
      type: NodeType.NORMAL,
      choices: [
        {
          id: "choice-3",
          text: "Continue to the next scene",
          nextNodeId: "node-4",
          isCorrect: true,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // CHOICE NODE 2
    {
      id: "node-4",
      sceneNumber: 4,
      title: "Which Oak Tree?",
      text: 'Luna looked at the bird and asked gently, "Do you remember which oak tree is your home?" The bird thought hard. "I remember there was water nearby... or was it flowers?" Luna had to decide how to find the right tree.',
      imageUrl: "/api/placeholder/800/600?text=Two+Oak+Trees",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-4a",
          text: "Go to the oak tree by the stream",
          nextNodeId: "node-5",
          isCorrect: true,
        },
        {
          id: "choice-4b",
          text: "Go to the oak tree by the meadow",
          nextNodeId: "node-5-bad",
          isCorrect: false,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // BAD ENDING 2
    {
      id: "node-5-bad",
      sceneNumber: 5,
      title: "The Wrong Tree",
      text: 'Luna hopped to the oak tree by the meadow, but when they got there, the bird looked confused. "This isn\'t my tree," she chirped sadly. "My tree had the sound of running water!" It was getting dark, and Luna realized she should have listened more carefully to the bird\'s memory about the water.',
      imageUrl: "/api/placeholder/800/600?text=Wrong+Oak+Tree",
      type: NodeType.BAD_ENDING,
      choices: [],
      lessonMessage:
        "Good friends listen carefully to understand what others need. Paying attention to details shows you care!",
      previousNodeId: "node-4",
    },
    // NORMAL NODE
    {
      id: "node-5",
      sceneNumber: 5,
      title: "The Right Tree",
      text: 'Luna hopped to the oak tree by the stream. "This is it!" chirped the bird happily, recognizing the sound of flowing water. But the nest was very high up in the tree. Luna was too small to climb that high. Just then, a friendly bear named Bruno walked by. "Need some help?" he asked with a kind smile.',
      imageUrl: "/api/placeholder/800/600?text=Luna+at+Right+Tree",
      type: NodeType.NORMAL,
      choices: [
        {
          id: "choice-5",
          text: "Continue the story",
          nextNodeId: "node-6",
          isCorrect: true,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // CHOICE NODE 3
    {
      id: "node-6",
      sceneNumber: 6,
      title: "Asking for Help",
      text: "Luna looked at the tall bear, then at the tiny bird in her paws. The bear seemed nice, but Luna had always been told to be careful of bears. However, the bird really needed to get home, and Luna couldn't do it alone.",
      imageUrl: "/api/placeholder/800/600?text=Luna+Bruno+Bird",
      type: NodeType.CHOICE,
      choices: [
        {
          id: "choice-6a",
          text: "Accept Bruno's help",
          nextNodeId: "node-7",
          isCorrect: true,
        },
        {
          id: "choice-6b",
          text: "Try to do it alone without the bear's help",
          nextNodeId: "node-7-bad",
          isCorrect: false,
        },
      ],
      lessonMessage: null,
      previousNodeId: null,
    },
    // BAD ENDING 3
    {
      id: "node-7-bad",
      sceneNumber: 7,
      title: "Too Proud to Ask",
      text: 'Luna tried to climb the tree by herself, but she slipped and fell. The bird almost fell too! Bruno caught them both gently. "It\'s okay to ask for help, little one," Bruno said kindly. "Friends are meant to help each other." Luna felt sad that her pride had almost caused an accident.',
      imageUrl: "/api/placeholder/800/600?text=Luna+Falls",
      type: NodeType.BAD_ENDING,
      choices: [],
      lessonMessage:
        "True friends aren't afraid to ask for help when they need it. Working together makes us all stronger!",
      previousNodeId: "node-6",
    },
    // GOOD ENDING
    {
      id: "node-7",
      sceneNumber: 7,
      title: "Together We Succeed",
      text: 'Luna smiled at Bruno. "Yes, please! I\'d love your help!" Bruno carefully lifted Luna on his shoulder, and Luna gently placed the bird in her nest. The bird\'s family chirped happily! "Thank you both so much!" sang the bird. "You\'re wonderful friends!" Luna and Bruno smiled at each other. They had made a new friend by helping someone in need, and Luna learned that friendship means being kind, patient, and knowing when to ask for help.',
      imageUrl: "/api/placeholder/800/600?text=Happy+Ending",
      type: NodeType.GOOD_ENDING,
      choices: [],
      lessonMessage:
        "You made all the right choices! Remember: True friends are patient, listen carefully, and aren't afraid to help each other. Together, we can do amazing things!",
      previousNodeId: null,
    },
  ],
}

/**
 * Mock reading progress data
 */
export const mockReadingProgress = {
  storyId: "story-123",
  currentNodeId: "node-4",
  visitedNodeIds: ["node-1", "node-2", "node-3", "node-4"],
  choicesMade: [
    {
      nodeId: "node-1",
      choiceId: "choice-1",
    },
    {
      nodeId: "node-2",
      choiceId: "choice-2b",
    },
    {
      nodeId: "node-3",
      choiceId: "choice-3",
    },
  ],
  lastReadAt: new Date().toISOString(),
}

/**
 * Mock completion data
 */
export const mockCompletionData = {
  storyId: "story-123",
  endingNodeId: "node-7",
  congratsMessage: "Amazing job! You completed 'The Forest of Friendship'!",
  readCount: 1,
  reachedGoodEnding: true,
  completedAt: new Date().toISOString(),
}
