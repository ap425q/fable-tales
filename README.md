## 📄 Complete API List

### **Basic Information**
- Base URL: `/api/v1`
- All responses follow this format:
```json
{
  "success": true/false,
  "data": { ... },
  "error": { "code": "ERROR_CODE", "message": "..." } // Only on error
}
```

---

## 1️⃣ Home/Role Selection Page

### API 1-1: Story List Retrieval (Simple Version)
```
GET /stories
```

**Query Params:**
```
limit: number (optional, default: 10)
offset: number (optional, default: 0)
status: string (optional, 'completed' | 'draft')
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "story_123",
        "title": "The Brave Rabbit's Adventure",
        "lesson": "Lying is bad",
        "coverImage": "https://...",
        "status": "completed", // 'completed' | 'draft'
        "createdAt": "2025-10-15T10:30:00Z",
        "sceneCount": 18
      }
    ],
    "total": 25,
    "hasMore": true
  }
}
```

---

## 2️⃣ Story Setup Page

### API 2-1: Story Creation (AI Generation)
```
POST /stories/generate
```

**Request Body:**
```json
{
  "lesson": "You should help your friends",
  "theme": "Friendship among forest animals",
  "storyFormat": "Good triumphs over evil",
  "characterCount": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "tree": {
      "nodes": [
        {
          "id": "node_1",
          "sceneNumber": 1,
          "title": "Meeting in the Forest",
          "text": "One day, the rabbit met a bear in the forest...",
          "location": "Magical Forest",
          "type": "start", // 'start' | 'normal' | 'choice' | 'good_ending' | 'bad_ending'
          "choices": [
            {
              "id": "choice_1",
              "text": "Approach the bear and say hello",
              "nextNodeId": "node_2",
              "isCorrect": true
            },
            {
              "id": "choice_2",
              "text": "Run away in fear",
              "nextNodeId": "node_3",
              "isCorrect": false
            }
          ]
        },
        {
          "id": "node_2",
          "sceneNumber": 2,
          "title": "A New Friend",
          "text": "The bear smiled kindly and...",
          "location": "Magical Forest",
          "type": "normal",
          "choices": [
            {
              "id": "choice_3",
              "text": "Continue reading",
              "nextNodeId": "node_4",
              "isCorrect": true
            }
          ]
        }
        // ... 15-20 nodes
      ],
      "edges": [
        {
          "from": "node_1",
          "to": "node_2",
          "choiceId": "choice_1"
        }
        // ...
      ]
    },
    "characters": [
      {
        "id": "char_1",
        "role": "Protagonist",
        "description": "Brave rabbit"
      },
      {
        "id": "char_2",
        "role": "Friend",
        "description": "Kind bear"
      },
      {
        "id": "char_3",
        "role": "Helper",
        "description": "Wise owl"
      },
      {
        "id": "char_4",
        "role": "Antagonist",
        "description": "Cunning fox"
      }
    ],
    "locations": [
      {
        "id": "loc_1",
        "name": "Magical Forest",
        "sceneNumbers": [1, 2, 5, 7],
        "description": ""
      },
      {
        "id": "loc_2",
        "name": "Riverside",
        "sceneNumbers": [3, 4],
        "description": ""
      }
      // ...
    ]
  }
}
```

---

## 3️⃣ Story Tree Editing Page

### API 3-1: Story Details Retrieval
```
GET /stories/{storyId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "story_456",
    "lesson": "You should help your friends",
    "theme": "Friendship among forest animals",
    "storyFormat": "Good triumphs over evil",
    "status": "draft",
    "tree": { /* Same as above */ },
    "characters": [ /* Same as above */ ],
    "locations": [ /* Same as above */ ],
    "createdAt": "2025-10-15T10:30:00Z",
    "updatedAt": "2025-10-15T11:00:00Z"
  }
}
```

### API 3-2: Node Update
```
PATCH /stories/{storyId}/nodes/{nodeId}
```

**Request Body:**
```json
{
  "title": "New Title",
  "text": "Updated story text",
  "location": "Kingdom Castle",
  "choices": [
    {
      "id": "choice_1", // Existing choices include id
      "text": "Updated choice",
      "nextNodeId": "node_5",
      "isCorrect": true
    },
    {
      // No id means create new
      "text": "New choice",
      "nextNodeId": "node_6",
      "isCorrect": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "node": {
      "id": "node_2",
      "sceneNumber": 2,
      "title": "New Title",
      "text": "Updated story text",
      "location": "Kingdom Castle",
      "type": "choice",
      "choices": [ /* Updated choices */ ]
    }
  }
}
```

### API 3-3: Add Node
```
POST /stories/{storyId}/nodes
```

**Request Body:**
```json
{
  "parentNodeId": "node_5", // Which node to add after
  "choiceId": "choice_10", // Which choice connects to this
  "title": "New Scene",
  "text": "New story content",
  "location": "Town Square",
  "type": "normal",
  "choices": [
    {
      "text": "Continue",
      "nextNodeId": null, // Not yet connected
      "isCorrect": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "node": {
      "id": "node_21", // Newly created node
      "sceneNumber": 21,
      "title": "New Scene",
      // ... rest of the info
    }
  }
}
```

### API 3-4: Delete Node
```
DELETE /stories/{storyId}/nodes/{nodeId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedNodeId": "node_15",
    "affectedNodes": ["node_14"], // Nodes with broken connections
    "message": "Node deleted successfully"
  }
}
```

---

## 4️⃣ Character Role Assignment Page

### API 4-1: Retrieve Preset Characters List
```
GET /characters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "preset_char_1",
        "name": "Cute Rabbit",
        "imageUrl": "https://cdn.../rabbit.png",
        "category": "Animal" // Optional
      },
      {
        "id": "preset_char_2",
        "name": "Brave Lion",
        "imageUrl": "https://cdn.../lion.png",
        "category": "Animal"
      }
      // ... 10-20 items
    ]
  }
}
```

### API 4-2: Save Character Assignments
```
POST /stories/{storyId}/character-assignments
```

**Request Body:**
```json
{
  "assignments": [
    {
      "characterRoleId": "char_1", // Story's character role ID
      "presetCharacterId": "preset_char_1" // Selected preset character
    },
    {
      "characterRoleId": "char_2",
      "presetCharacterId": "preset_char_5"
    },
    {
      "characterRoleId": "char_3",
      "presetCharacterId": "preset_char_8"
    },
    {
      "characterRoleId": "char_4",
      "presetCharacterId": "preset_char_12"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "assignments": [
      {
        "characterRoleId": "char_1",
        "role": "Protagonist",
        "presetCharacterId": "preset_char_1",
        "characterName": "Cute Rabbit",
        "imageUrl": "https://cdn.../rabbit.png"
      }
      // ...
    ]
  }
}
```

### API 4-3: Retrieve Character Assignments
```
GET /stories/{storyId}/character-assignments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [ /* Same as above */ ]
  }
}
```

---

## 5️⃣ Background Setup and Generation Page

### API 5-1: Retrieve Backgrounds List
```
GET /stories/{storyId}/backgrounds
```

**Response:**
```json
{
  "success": true,
  "data": {
    "backgrounds": [
      {
        "id": "bg_1",
        "locationId": "loc_1",
        "name": "Magical Forest",
        "description": "Bright forest with sunshine",
        "sceneNumbers": [1, 2, 5, 7, 15],
        "imageUrl": null, // Not yet generated
        "status": "pending", // 'pending' | 'generating' | 'completed'
        "versions": []
      },
      {
        "id": "bg_2",
        "locationId": "loc_2",
        "name": "Riverside",
        "description": "Riverside with clear flowing water",
        "sceneNumbers": [3, 4],
        "imageUrl": "https://cdn.../background_river_v1.png",
        "status": "completed",
        "versions": [
          {
            "versionId": "bg_2_v1",
            "imageUrl": "https://cdn.../background_river_v1.png",
            "createdAt": "2025-10-15T11:30:00Z"
          }
        ]
      }
    ]
  }
}
```

### API 5-2: Update Background Description
```
PATCH /stories/{storyId}/backgrounds/{backgroundId}
```

**Request Body:**
```json
{
  "name": "Mysterious Forest",
  "description": "Mysterious forest shrouded in mist"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "background": {
      "id": "bg_1",
      "name": "Mysterious Forest",
      "description": "Mysterious forest shrouded in mist",
      // ... rest
    }
  }
}
```

### API 5-3: Generate All Background Images
```
POST /stories/{storyId}/backgrounds/generate-all
```

**Request Body:**
```json
{
  "backgrounds": [
    {
      "backgroundId": "bg_1",
      "description": "Bright forest with sunshine"
    },
    {
      "backgroundId": "bg_2",
      "description": "Riverside with clear flowing water"
    }
    // ...
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job_789",
    "message": "Background generation started",
    "backgroundIds": ["bg_1", "bg_2", "bg_3"]
  }
}
```

### API 5-4: Check Background Generation Status
```
GET /stories/{storyId}/backgrounds/generation-status
```

**Query Params:**
```
jobId: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "in_progress", // 'pending' | 'in_progress' | 'completed' | 'failed'
    "backgrounds": [
      {
        "backgroundId": "bg_1",
        "status": "completed",
        "imageUrl": "https://cdn.../bg_forest_v1.png",
        "versionId": "bg_1_v1"
      },
      {
        "backgroundId": "bg_2",
        "status": "generating",
        "imageUrl": null
      },
      {
        "backgroundId": "bg_3",
        "status": "pending",
        "imageUrl": null
      }
    ],
    "progress": {
      "completed": 1,
      "total": 3
    }
  }
}
```

### API 5-5: Regenerate Individual Background
```
POST /stories/{storyId}/backgrounds/{backgroundId}/regenerate
```

**Request Body:**
```json
{
  "description": "Darker atmosphere forest" // Optional, change description
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "backgroundId": "bg_1",
    "versionId": "bg_1_v2",
    "imageUrl": "https://cdn.../bg_forest_v2.png",
    "status": "completed"
  }
}
```

### API 5-6: Select Background Version
```
POST /stories/{storyId}/backgrounds/{backgroundId}/select-version
```

**Request Body:**
```json
{
  "versionId": "bg_1_v2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "backgroundId": "bg_1",
    "selectedVersionId": "bg_1_v2",
    "imageUrl": "https://cdn.../bg_forest_v2.png"
  }
}
```

---

## 6️⃣ Final Scene Image Generation and Management Page

### API 6-1: Generate All Scene Images (Character + Background Composite)
```
POST /stories/{storyId}/scenes/generate-all-images
```

**Request Body:**
```json
{
  // Specify only certain scenes if needed, otherwise all
  "sceneIds": ["node_1", "node_2", "node_3"] // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job_890",
    "message": "Scene image generation started",
    "sceneCount": 18
  }
}
```

### API 6-2: Check Scene Image Generation Status
```
GET /stories/{storyId}/scenes/generation-status
```

**Query Params:**
```
jobId: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "in_progress", // 'pending' | 'in_progress' | 'completed' | 'failed'
    "scenes": [
      {
        "sceneId": "node_1",
        "sceneNumber": 1,
        "status": "completed",
        "currentImageUrl": "https://cdn.../scene_1_v1.png",
        "currentVersionId": "scene_1_v1"
      },
      {
        "sceneId": "node_2",
        "sceneNumber": 2,
        "status": "generating",
        "currentImageUrl": null
      }
      // ... all scenes
    ],
    "progress": {
      "completed": 5,
      "total": 18
    }
  }
}
```

### API 6-3: Retrieve Scene Image Version History
```
GET /stories/{storyId}/scenes/{sceneId}/image-versions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sceneId": "node_1",
    "currentVersionId": "scene_1_v2",
    "versions": [
      {
        "versionId": "scene_1_v1",
        "imageUrl": "https://cdn.../scene_1_v1.png",
        "createdAt": "2025-10-15T12:00:00Z"
      },
      {
        "versionId": "scene_1_v2",
        "imageUrl": "https://cdn.../scene_1_v2.png",
        "createdAt": "2025-10-15T12:15:00Z"
      }
    ]
  }
}
```

### API 6-4: Regenerate Individual Scene Image
```
POST /stories/{storyId}/scenes/{sceneId}/regenerate-image
```

**Request Body:**
```json
{
  // Additional requests if any (optional)
  "additionalPrompt": "Brighter atmosphere"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sceneId": "node_1",
    "versionId": "scene_1_v3",
    "imageUrl": "https://cdn.../scene_1_v3.png",
    "status": "completed"
  }
}
```

### API 6-5: Select Scene Image Version
```
POST /stories/{storyId}/scenes/{sceneId}/select-version
```

**Request Body:**
```json
{
  "versionId": "scene_1_v1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sceneId": "node_1",
    "selectedVersionId": "scene_1_v1",
    "imageUrl": "https://cdn.../scene_1_v1.png"
  }
}
```

### API 6-6: Bulk Regenerate Scene Images
```
POST /stories/{storyId}/scenes/regenerate-multiple
```

**Request Body:**
```json
{
  "sceneIds": ["node_3", "node_5", "node_8"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job_891",
    "message": "Regeneration started for 3 scenes",
    "sceneIds": ["node_3", "node_5", "node_8"]
  }
}
```

### API 6-7: Complete Story
```
POST /stories/{storyId}/complete
```

**Request Body:**
```json
{
  "title": "The Brave Rabbit's Adventure" // Final title
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "status": "completed",
    "title": "The Brave Rabbit's Adventure",
    "shareUrl": "https://app.com/story/story_456",
    "completedAt": "2025-10-15T13:00:00Z"
  }
}
```

---

## 7️⃣ Child Mode - Story Selection Page

Use **API 1-1** (`GET /stories`) with `status=completed` query parameter to retrieve completed stories.

---

## 8️⃣ Child Mode - Story Reading Page

### API 8-1: Retrieve Story for Reading
```
GET /stories/{storyId}/read
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "story_456",
    "title": "The Brave Rabbit's Adventure",
    "lesson": "You should help your friends",
    "nodes": [
      {
        "id": "node_1",
        "sceneNumber": 1,
        "title": "Meeting in the Forest",
        "text": "One day, the rabbit met a bear in the forest...",
        "imageUrl": "https://cdn.../scene_1_final.png",
        "type": "start",
        "choices": [
          {
            "id": "choice_1",
            "text": "Approach the bear and say hello",
            "nextNodeId": "node_2"
          },
          {
            "id": "choice_2",
            "text": "Run away in fear",
            "nextNodeId": "node_3"
          }
        ]
      },
      {
        "id": "node_2",
        "sceneNumber": 2,
        "title": "A New Friend",
        "text": "The bear smiled kindly and reached out a paw...",
        "imageUrl": "https://cdn.../scene_2_final.png",
        "type": "normal",
        "choices": [
          {
            "id": "choice_3",
            "text": "Next",
            "nextNodeId": "node_4"
          }
        ]
      },
      {
        "id": "node_3",
        "sceneNumber": 3,
        "title": "The Rabbit Alone",
        "text": "The rabbit ran away in fear but soon felt lonely...",
        "imageUrl": "https://cdn.../scene_3_final.png",
        "type": "bad_ending",
        "lessonMessage": "You missed a chance to make a friend. Being brave can help you meet good friends!",
        "previousNodeId": "node_1"
      }
      // ... all nodes
    ],
    "startNodeId": "node_1"
  }
}
```

### API 8-2: Save Reading Progress
```
POST /stories/{storyId}/reading-progress
```

**Request Body:**
```json
{
  "currentNodeId": "node_5",
  "visitedNodeIds": ["node_1", "node_2", "node_4", "node_5"],
  "choicesMade": [
    {
      "nodeId": "node_1",
      "choiceId": "choice_1"
    },
    {
      "nodeId": "node_2",
      "choiceId": "choice_3"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "progressId": "progress_123",
    "savedAt": "2025-10-15T14:00:00Z"
  }
}
```

### API 8-3: Retrieve Reading Progress
```
GET /stories/{storyId}/reading-progress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "currentNodeId": "node_5",
    "visitedNodeIds": ["node_1", "node_2", "node_4", "node_5"],
    "choicesMade": [ /* ... */ ],
    "lastReadAt": "2025-10-15T14:00:00Z"
  }
}
```

### API 8-4: Record Reading Completion
```
POST /stories/{storyId}/reading-complete
```

**Request Body:**
```json
{
  "endingNodeId": "node_18",
  "endingType": "good_ending", // 'good_ending' | 'bad_ending'
  "totalNodesVisited": 12,
  "readingTimeSeconds": 480
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "completionId": "completion_789",
    "readCount": 6, // Total times this story has been read
    "congratsMessage": "Congratulations! You made great choices!"
  }
}
```

---

## 9️⃣ Story Library Page

### API 9-1: Retrieve All Stories List (Detailed)
```
GET /stories
```

**Query Params:**
```
limit: number (optional, default: 20)
offset: number (optional, default: 0)
status: string (optional, 'all' | 'completed' | 'draft')
sortBy: string (optional, 'recent' | 'title' | 'readCount')
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "story_123",
        "title": "The Brave Rabbit's Adventure",
        "lesson": "You should help your friends",
        "theme": "Forest animals",
        "coverImage": "https://cdn.../cover_123.png",
        "status": "completed",
        "sceneCount": 18,
        "readCount": 5,
        "lastReadAt": "2025-10-14T15:30:00Z",
        "createdAt": "2025-10-10T10:00:00Z",
        "updatedAt": "2025-10-10T13:00:00Z"
      }
    ],
    "total": 25,
    "hasMore": true
  }
}
```

### API 9-2: Delete Story
```
DELETE /stories/{storyId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedStoryId": "story_456",
    "message": "Story deleted successfully"
  }
}
```

---

## 🔟 Other Utility APIs

### API 10-1: Generate Share Link
```
POST /stories/{storyId}/share
```

**Request Body:**
```json
{
  "expiresIn": 2592000 // seconds (optional, 30 days)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareUrl": "https://app.com/shared/abc123def456",
    "shortCode": "abc123",
    "expiresAt": "2025-11-15T14:00:00Z"
  }
}
```

### API 10-2: Image Upload (For Custom Characters/Backgrounds)
```
POST /upload/image
```

**Request Body (multipart/form-data):**
```
file: File
type: string ('character' | 'background')
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageId": "img_custom_123",
    "imageUrl": "https://cdn.../custom_123.png",
    "uploadedAt": "2025-10-15T14:00:00Z"
  }
}
```

---

## 📊 Error Code Summary

```json
{
  "STORY_NOT_FOUND": "Story not found",
  "NODE_NOT_FOUND": "Node not found",
  "BACKGROUND_NOT_FOUND": "Background not found",
  "INVALID_TREE_STRUCTURE": "Invalid tree structure",
  "GENERATION_FAILED": "Generation failed",
  "GENERATION_IN_PROGRESS": "Generation in progress",
  "INVALID_CHARACTER_ASSIGNMENT": "Invalid character assignment",
  "IMAGE_UPLOAD_FAILED": "Image upload failed",
  "UNAUTHORIZED": "Unauthorized",
  "VALIDATION_ERROR": "Validation error",
  "SERVER_ERROR": "Server error occurred"
}
```

---

## 🎯 API Call Flow Summary

```
Complete Parent Mode Flow:

1. POST /stories/generate
   → Create story with AI

2. GET /stories/{storyId}
   → Retrieve story details

3. PATCH /stories/{storyId}/nodes/{nodeId}
   → Edit nodes (multiple times)
   
3b. POST /stories/{storyId}/nodes
    → Add new nodes to story tree

3c. DELETE /stories/{storyId}/nodes/{nodeId}
    → Delete nodes from story tree

4. GET /characters
   → Retrieve preset character list

5. POST /stories/{storyId}/character-assignments
   → Assign characters to story roles

6. GET /stories/{storyId}/backgrounds
   → Retrieve backgrounds list

7. PATCH /stories/{storyId}/backgrounds/{backgroundId}
   → Modify background descriptions (as needed)

8. POST /stories/{storyId}/backgrounds/generate-all
   → Generate all background images

9. GET /stories/{storyId}/backgrounds/generation-status (polling)
   → Check background generation status

10. POST /stories/{storyId}/scenes/generate-all-images
    → Generate all scene images (character + background composite)

11. GET /stories/{storyId}/scenes/generation-status (polling)
    → Check scene image generation status

12. POST /stories/{storyId}/complete
    → Mark story as completed

Child Mode Flow:

1. GET /stories?status=completed
   → Get completed stories list

2. GET /stories/{storyId}/read
   → Start reading story

3. POST /stories/{storyId}/reading-progress (periodically)
   → Save reading progress

4. POST /stories/{storyId}/reading-complete
   → Record reading completion

Story Library (Parent) Flow:

1. GET /stories?status=all
   → Get all stories (completed & drafts)

2. DELETE /stories/{storyId}
   → Delete story

3. POST /stories/{storyId}/share
   → Generate shareable link for completed story
```
