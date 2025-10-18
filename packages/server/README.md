# API Endpoints Review

## ✅ ENDPOINTS TO KEEP (With Input/Output Documentation)

### 1. Story Management

#### **GET** `/api/v1/stories` — Get Stories
**Input:**
- `limit` (query, optional): Number of stories to return (default: 20, max: 100)
- `offset` (query, optional): Offset for pagination (default: 0)
- `status` (query, optional): Filter by status - "all" | "completed" | "draft"
- `sort_by` (query, optional): Sort order - "recent" | "title" | "readCount"

**Output:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "story-uuid",
        "title": "Story Title",
        "lesson": "Life lesson",
        "theme": "Adventure",
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "coverImageUrl": "url",
        "readCount": 5
      }
    ],
    "total": 100,
    "hasMore": true
  }
}
```

#### **POST** `/api/v1/stories/generate` — Generate Story
**Input:**
```json
{
  "lesson": "Be kind to others",
  "theme": "Fantasy adventure",
  "storyFormat": "Classic story",
  "characterCount": 4
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "title": "Generated Story Title",
    "tree": {
      "nodes": [...],
      "edges": [...]
    },
    "characterRoles": [...],
    "locations": [...]
  }
}
```

#### **GET** `/api/v1/stories/{story_id}` — Get Story Details
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "title": "Story Title",
    "lesson": "Life lesson",
    "theme": "Adventure",
    "status": "draft",
    "tree": {
      "nodes": [
        {
          "id": "node-1",
          "sceneNumber": 1,
          "title": "Scene Title",
          "text": "Scene text",
          "location": "location-id",
          "type": "START",
          "choices": []
        }
      ],
      "edges": [
        {"from": "node-1", "to": "node-2"}
      ]
    },
    "characterRoles": [...],
    "locations": [...],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **DELETE** `/api/v1/stories/{story_id}` — Delete Story
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "message": "Story deleted successfully"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/share` — Generate Share Link
**Input:**
- `story_id` (path): Story ID
```json
{
  "expiresIn": 2592000 // seconds, optional, default 30 days
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "shareUrl": "https://app.com/share/abc123",
    "shareCode": "abc123",
    "expiresAt": "2024-02-01T00:00:00Z"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/complete` — Complete Story
**Input:**
- `story_id` (path): Story ID
```json
{
  "title": "Final Story Title"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "status": "completed",
    "completedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Story Tree Editing

#### **PATCH** `/api/v1/stories/{story_id}/nodes/{node_id}` — Update Node
**Input:**
- `story_id` (path): Story ID
- `node_id` (path): Node ID
```json
{
  "title": "Updated Title",
  "text": "Updated text",
  "location": "location-id",
  "choices": [
    {
      "id": "choice-1",
      "text": "Choice text",
      "nextNodeId": "node-2",
      "isCorrect": true
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "node": {
      "id": "node-1",
      "sceneNumber": 1,
      "title": "Updated Title",
      "text": "Updated text",
      "location": "location-id",
      "type": "CHOICE",
      "choices": [...]
    }
  }
}
```

#### **DELETE** `/api/v1/stories/{story_id}/nodes/{node_id}` — Delete Node
**Input:**
- `story_id` (path): Story ID
- `node_id` (path): Node ID

**Output:**
```json
{
  "success": true,
  "data": {
    "nodeId": "node-1",
    "affectedNodes": ["node-2", "node-3"],
    "message": "Node deleted successfully"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/nodes` — Add Node
**Input:**
- `story_id` (path): Story ID
```json
{
  "parentNodeId": "parent-node-id",
  "choiceId": "choice-id", // optional
  "type": "NORMAL",
  "title": "New Scene Title",
  "text": "New scene text",
  "location": "location-id",
  "choices": []
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "node": {
      "id": "new-node-id",
      "sceneNumber": 5,
      "title": "New Scene Title",
      "text": "New scene text",
      "location": "location-id",
      "type": "NORMAL",
      "choices": []
    }
  }
}
```

---

### 3. Character Assignment

#### **GET** `/api/v1/characters` — Get Preset Characters
**Input:** None

**Output:**
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": "char-1",
        "name": "Emma",
        "gender": "female",
        "imageUrl": "/characters/f_emma.png",
        "description": "A brave young girl"
      }
    ]
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/character-assignments` — Save Character Assignments
**Input:**
- `story_id` (path): Story ID
```json
{
  "assignments": [
    {
      "characterRoleId": "role-1",
      "presetCharacterId": "char-1"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "assignments": [
      {
        "characterRoleId": "role-1",
        "presetCharacterId": "char-1",
        "roleName": "Hero",
        "characterName": "Emma"
      }
    ]
  }
}
```

#### **GET** `/api/v1/stories/{story_id}/character-assignments` — Get Character Assignments
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "characterRoleId": "role-1",
        "presetCharacterId": "char-1",
        "roleName": "Hero",
        "characterName": "Emma"
      }
    ]
  }
}
```

---

### 4. Background Setup

#### **GET** `/api/v1/stories/{story_id}/backgrounds` — Get Story Backgrounds
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "backgrounds": [
      {
        "id": "bg-1",
        "locationId": "location-1",
        "locationName": "Forest",
        "description": "A dark mysterious forest",
        "generationStatus": "COMPLETED",
        "imageVersions": [
          {
            "versionId": "v1",
            "url": "image-url",
            "generatedAt": "2024-01-01T00:00:00Z"
          }
        ],
        "selectedVersionId": "v1"
      }
    ]
  }
}
```

#### **PATCH** `/api/v1/stories/{story_id}/backgrounds/{background_id}` — Update Background Description
**Input:**
- `story_id` (path): Story ID
- `background_id` (path): Background ID
```json
{
  "description": "Updated description"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "background": {
      "id": "bg-1",
      "locationId": "location-1",
      "description": "Updated description",
      "generationStatus": "PENDING"
    }
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/backgrounds/generate-all` — Generate All Backgrounds
**Input:**
- `story_id` (path): Story ID
```json
{
  "backgrounds": [
    {
      "backgroundId": "bg-1",
      "description": "Forest description"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "PENDING",
    "total": 5
  }
}
```

#### **GET** `/api/v1/stories/{story_id}/backgrounds/generation-status` — Check Background Generation Status
**Input:**
- `story_id` (path): Story ID
- `job_id` (query, optional): Job ID

**Output:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "IN_PROGRESS",
    "progress": {
      "completed": 3,
      "total": 5,
      "percentage": 60
    },
    "backgrounds": [
      {
        "backgroundId": "bg-1",
        "status": "COMPLETED",
        "imageUrl": "url"
      }
    ]
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/backgrounds/{background_id}/regenerate` — Regenerate Individual Background
**Input:**
- `story_id` (path): Story ID
- `background_id` (path): Background ID
```json
{
  "description": "Regenerate with this description"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "versionId": "v2",
    "imageUrl": "new-image-url",
    "generatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/backgrounds/{background_id}/select-version` — Select Background Version
**Input:**
- `story_id` (path): Story ID
- `background_id` (path): Background ID
```json
{
  "versionId": "v2"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "backgroundId": "bg-1",
    "selectedVersionId": "v2"
  }
}
```

---

### 5. Scene Image Generation

#### **POST** `/api/v1/stories/{story_id}/scenes/generate-all-images` — Generate All Scene Images
**Input:**
- `story_id` (path): Story ID
```json
{
  "sceneIds": ["scene-1", "scene-2"] // optional, generates all if omitted
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "PENDING",
    "total": 10
  }
}
```

#### **GET** `/api/v1/stories/{story_id}/scenes/generation-status` — Check Scene Image Generation Status
**Input:**
- `story_id` (path): Story ID
- `job_id` (query, optional): Job ID

**Output:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "IN_PROGRESS",
    "progress": {
      "completed": 7,
      "total": 10,
      "percentage": 70
    },
    "scenes": [
      {
        "sceneId": "scene-1",
        "status": "COMPLETED",
        "imageUrl": "url"
      }
    ]
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/scenes/{scene_id}/regenerate-image` — Regenerate Individual Scene Image
**Input:**
- `story_id` (path): Story ID
- `scene_id` (path): Scene ID
```json
{
  "additionalPrompt": "Make it darker" // optional
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "versionId": "v2",
    "imageUrl": "new-image-url",
    "generatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/scenes/{scene_id}/select-version` — Select Scene Image Version
**Input:**
- `story_id` (path): Story ID
- `scene_id` (path): Scene ID
```json
{
  "versionId": "v2"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "sceneId": "scene-1",
    "selectedVersionId": "v2"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/scenes/regenerate-multiple` — Bulk Regenerate Scene Images
**Input:**
- `story_id` (path): Story ID
```json
{
  "sceneIds": ["scene-1", "scene-2", "scene-3"]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-uuid",
    "status": "PENDING",
    "total": 3
  }
}
```

---

### 6. Story Reading (Child Mode)

#### **GET** `/api/v1/stories/{story_id}/read` — Get Story For Reading
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "title": "Story Title",
    "coverImageUrl": "url",
    "startNodeId": "node-1",
    "nodes": [
      {
        "id": "node-1",
        "title": "Scene Title",
        "text": "Scene text",
        "imageUrl": "scene-image-url",
        "backgroundUrl": "bg-url",
        "characters": [...],
        "choices": [...],
        "type": "START"
      }
    ]
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/reading-progress` — Save Reading Progress
**Input:**
- `story_id` (path): Story ID
```json
{
  "currentNodeId": "node-3",
  "visitedNodeIds": ["node-1", "node-2", "node-3"],
  "choicesMade": [
    {
      "nodeId": "node-1",
      "choiceId": "choice-1"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "savedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **GET** `/api/v1/stories/{story_id}/reading-progress` — Get Reading Progress
**Input:**
- `story_id` (path): Story ID

**Output:**
```json
{
  "success": true,
  "data": {
    "currentNodeId": "node-3",
    "visitedNodeIds": ["node-1", "node-2", "node-3"],
    "choicesMade": [...],
    "lastReadAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **POST** `/api/v1/stories/{story_id}/reading-complete` — Record Reading Completion
**Input:**
- `story_id` (path): Story ID
```json
{
  "endingNodeId": "ending-node-1"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "storyId": "story-uuid",
    "endingNodeId": "ending-node-1",
    "completedAt": "2024-01-01T00:00:00Z",
    "readCount": 6
  }
}
```

---

### 7. Utility

#### **GET** `/api/v1/health` — Health Check
**Input:** None

**Output:**
```json
{
  "status": "healthy",
  "service": "Fable Tales Story API",
  "version": "1.0.0"
}
```

---