# Story Library - API Integration Guide

## Overview

This document provides complete API integration details for transitioning the Story Library from mock data to production backend endpoints.

## Current Implementation

The Story Library currently uses **mock data** for development:

```typescript
const [useMockData] = useState(true)
```

To switch to production API:
1. Change `useMockData` to `false`
2. Ensure backend endpoints are available
3. Update API client configuration

---

## Required API Endpoints

### 1. Get All Stories

**Endpoint:** `GET /api/v1/stories`

**Query Parameters:**
```typescript
{
  limit?: number      // Number of stories to return (optional)
  offset?: number     // Pagination offset (optional)
  status?: string     // Filter by status: "completed" | "draft" (optional)
  sortBy?: string     // Sort field (optional)
  search?: string     // Search query (optional)
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    stories: Story[],
    total: number,
    hasMore: boolean
  }
}
```

**Example:**
```bash
GET /api/v1/stories?limit=100&offset=0
```

**Used In:**
- Initial page load
- After story creation/deletion
- Refresh operations

---

### 2. Delete Story

**Endpoint:** `DELETE /api/v1/stories/:id`

**Path Parameters:**
- `id` (string): Story ID to delete

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Story deleted successfully"
  }
}
```

**Example:**
```bash
DELETE /api/v1/stories/story-123
```

**Used In:**
- Single story deletion
- Bulk deletion (multiple calls)

---

### 3. Duplicate Story

**Endpoint:** `POST /api/v1/stories/:id/duplicate`

**Path Parameters:**
- `id` (string): Story ID to duplicate

**Request Body:**
```typescript
{
  title?: string  // Optional custom title for duplicate
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    story: Story,
    message: "Story duplicated successfully"
  }
}
```

**Example:**
```bash
POST /api/v1/stories/story-123/duplicate
Content-Type: application/json

{
  "title": "The Brave Little Fox (Copy)"
}
```

**Used In:**
- Story duplication action

---

### 4. Get Story Statistics

**Endpoint:** `GET /api/v1/stories/:id/statistics`

**Path Parameters:**
- `id` (string): Story ID

**Response:**
```typescript
{
  success: true,
  data: {
    storyId: string,
    totalReads: number,
    averageReadingTime: number,  // in minutes
    completionRate: number,       // percentage (0-100)
    choiceDistribution: ChoiceDistributionData[],
    sceneVisits: SceneVisitData[],
    lastRead?: string  // ISO date string
  }
}
```

**ChoiceDistributionData:**
```typescript
{
  choiceText: string,
  sceneNumber: number,
  selectionCount: number,
  percentage: number
}
```

**SceneVisitData:**
```typescript
{
  sceneNumber: number,
  sceneTitle: string,
  visitCount: number,
  percentage: number
}
```

**Example:**
```bash
GET /api/v1/stories/story-123/statistics
```

**Used In:**
- Statistics modal display

---

### 5. Generate Share Link

**Endpoint:** `POST /api/v1/stories/:id/share`

**Path Parameters:**
- `id` (string): Story ID

**Request Body:**
```typescript
{
  expiresIn?: number  // Optional expiration in days
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    shareUrl: string,
    expiresAt?: string  // ISO date string
  }
}
```

**Example:**
```bash
POST /api/v1/stories/story-123/share
Content-Type: application/json

{
  "expiresIn": 30
}
```

**Used In:**
- Share functionality

---

## API Client Configuration

### Current Setup

The project uses a centralized API client at `/packages/web/src/lib/api.ts`.

### Required Methods

Add these methods to the `api.stories` namespace:

```typescript
// lib/api.ts

export const api = {
  stories: {
    /**
     * Get all stories with optional filters
     */
    getAll: async (params?: {
      limit?: number
      offset?: number
      status?: string
      sortBy?: string
      search?: string
    }): Promise<ApiResponse<StoriesListResponse>> => {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.offset) queryParams.set('offset', params.offset.toString())
      if (params?.status) queryParams.set('status', params.status)
      if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
      if (params?.search) queryParams.set('search', params.search)

      const response = await fetch(
        `/api/v1/stories?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      return response.json()
    },

    /**
     * Delete a story
     */
    delete: async (storyId: string): Promise<ApiResponse<void>> => {
      const response = await fetch(`/api/v1/stories/${storyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      return response.json()
    },

    /**
     * Duplicate a story
     */
    duplicate: async (
      storyId: string,
      title?: string
    ): Promise<ApiResponse<{ story: Story }>> => {
      const response = await fetch(`/api/v1/stories/${storyId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      return response.json()
    },

    /**
     * Get story statistics
     */
    getStatistics: async (
      storyId: string
    ): Promise<ApiResponse<StoryStatistics>> => {
      const response = await fetch(`/api/v1/stories/${storyId}/statistics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      return response.json()
    },

    /**
     * Generate share link
     */
    generateShareLink: async (
      storyId: string,
      expiresIn?: number
    ): Promise<ApiResponse<{ shareUrl: string }>> => {
      const response = await fetch(`/api/v1/stories/${storyId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresIn }),
      })

      return response.json()
    },
  },
}
```

---

## Migration Steps

### Step 1: Update API Client

1. Add the methods above to `lib/api.ts`
2. Ensure proper error handling
3. Add request interceptors for authentication if needed

### Step 2: Update Page Component

In `page.tsx`, replace mock data calls with API calls:

#### Before (Mock):
```typescript
if (useMockData) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  setStories(mockAllStories)
}
```

#### After (Production):
```typescript
const response = await api.stories.getAll({
  limit: 100,
  offset: 0,
})

if (response.success && response.data) {
  setStories(response.data.stories)
}
```

### Step 3: Update Delete Handler

#### Before (Mock):
```typescript
await new Promise((resolve) => setTimeout(resolve, 500))
setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id))
```

#### After (Production):
```typescript
const response = await api.stories.delete(storyToDelete.id)
if (response.success) {
  await fetchStories()
  showToast("Story deleted successfully.", ToastVariant.Success)
}
```

### Step 4: Update Duplicate Handler

#### Before (Mock):
```typescript
const duplicatedStory: Story = {
  ...story,
  id: `story-${Date.now()}`,
  title: `${story.title} (Copy)`,
  // ...
}
setStories((prev) => [duplicatedStory, ...prev])
```

#### After (Production):
```typescript
const response = await api.stories.duplicate(story.id)
if (response.success && response.data) {
  await fetchStories()
  showToast("Story duplicated successfully!", ToastVariant.Success)
}
```

### Step 5: Update Statistics Handler

#### Before (Mock):
```typescript
await new Promise((resolve) => setTimeout(resolve, 500))
setStatisticsData({ ...mockStatistics, storyId: story.id })
```

#### After (Production):
```typescript
const response = await api.stories.getStatistics(story.id)
if (response.success && response.data) {
  setStatisticsData(response.data)
}
```

### Step 6: Update Share Handler

#### Before (Mock):
```typescript
const url = `${window.location.origin}/story-reading/${story.id}`
setShareUrl(url)
setShareModalOpen(true)
```

#### After (Production):
```typescript
const response = await api.stories.generateShareLink(story.id)
if (response.success && response.data) {
  setShareUrl(response.data.shareUrl)
  setShareModalOpen(true)
}
```

### Step 7: Toggle Production Mode

Change the mock data flag:

```typescript
const [useMockData] = useState(false)  // Changed from true
```

---

## Error Handling

### Best Practices

1. **Network Errors:**
```typescript
try {
  const response = await api.stories.getAll()
  // Handle success
} catch (err) {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    showToast("Network error. Please check your connection.", ToastVariant.Error)
  } else {
    showToast("An unexpected error occurred.", ToastVariant.Error)
  }
}
```

2. **API Errors:**
```typescript
const response = await api.stories.delete(storyId)
if (!response.success) {
  const errorMessage = response.error?.message || "Failed to delete story"
  showToast(errorMessage, ToastVariant.Error)
  return
}
```

3. **Validation Errors:**
```typescript
if (response.error?.code === ErrorCode.VALIDATION_ERROR) {
  showToast("Invalid request. Please check your input.", ToastVariant.Error)
}
```

---

## Authentication

If your API requires authentication, add headers:

```typescript
const token = getAuthToken() // Your auth method

const response = await fetch(`/api/v1/stories`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
})
```

---

## Rate Limiting

If your API has rate limits, implement retry logic:

```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  try {
    const response = await fetch(url, options)
    if (response.status === 429) {
      // Rate limited
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchWithRetry(url, options, retries - 1)
      }
    }
    return response
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1)
    }
    throw err
  }
}
```

---

## Testing Production API

### Manual Testing Checklist

- [ ] Get all stories loads successfully
- [ ] Filter by completed works
- [ ] Filter by drafts works
- [ ] Search functionality works
- [ ] Sort options work correctly
- [ ] Story deletion works
- [ ] Bulk deletion works
- [ ] Story duplication works
- [ ] Statistics load correctly
- [ ] Share link generation works
- [ ] Error handling displays properly
- [ ] Loading states appear correctly

### API Testing Tools

Use these tools to test endpoints:

1. **Postman/Insomnia:**
   - Import API collection
   - Test each endpoint
   - Verify responses

2. **cURL Examples:**

```bash
# Get all stories
curl -X GET "http://localhost:3000/api/v1/stories?limit=100"

# Delete story
curl -X DELETE "http://localhost:3000/api/v1/stories/story-123"

# Duplicate story
curl -X POST "http://localhost:3000/api/v1/stories/story-123/duplicate" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Story (Copy)"}'

# Get statistics
curl -X GET "http://localhost:3000/api/v1/stories/story-123/statistics"

# Generate share link
curl -X POST "http://localhost:3000/api/v1/stories/story-123/share" \
  -H "Content-Type: application/json" \
  -d '{"expiresIn": 30}'
```

---

## Backend Implementation Notes

### Database Schema Requirements

Ensure your backend has:

1. **Stories Table:**
   - All Story interface fields
   - Indexes on: id, authorId, status, createdAt, updatedAt

2. **Reading Sessions Table:**
   - For tracking reads and statistics
   - Fields: sessionId, storyId, userId, startedAt, completedAt, choices, visitedScenes

3. **Share Links Table:**
   - For managing shared URLs
   - Fields: linkId, storyId, url, createdAt, expiresAt

### Statistics Calculation

Statistics should be calculated in the backend:

```python
# Example Python backend logic
def calculate_statistics(story_id):
    sessions = get_reading_sessions(story_id)
    
    total_reads = len(sessions)
    completed_sessions = [s for s in sessions if s.completed_at]
    completion_rate = (len(completed_sessions) / total_reads * 100) if total_reads > 0 else 0
    
    reading_times = [
        (s.completed_at - s.started_at).total_seconds() / 60
        for s in completed_sessions
    ]
    avg_reading_time = sum(reading_times) / len(reading_times) if reading_times else 0
    
    # Calculate choice distribution
    # Calculate scene visits
    # Return complete statistics object
```

---

## Performance Considerations

### Caching

Implement caching for frequently accessed data:

```typescript
// Cache story list for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

let storiesCache: { data: Story[], timestamp: number } | null = null

const getCachedStories = (): Story[] | null => {
  if (!storiesCache) return null
  if (Date.now() - storiesCache.timestamp > CACHE_DURATION) {
    storiesCache = null
    return null
  }
  return storiesCache.data
}
```

### Pagination

For large libraries, implement server-side pagination:

```typescript
// Fetch only needed page
const response = await api.stories.getAll({
  limit: STORIES_PER_PAGE,
  offset: (currentPage - 1) * STORIES_PER_PAGE,
})
```

### Debouncing

Search is already debounced (300ms), but ensure backend handles it efficiently:

```typescript
// Frontend already implements:
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery)
  }, 300)
  return () => clearTimeout(timer)
}, [searchQuery])
```

---

## Monitoring and Logging

Add logging for debugging:

```typescript
const fetchStories = async () => {
  console.log('[StoryLibrary] Fetching stories...')
  try {
    const response = await api.stories.getAll()
    console.log('[StoryLibrary] Fetched', response.data?.stories.length, 'stories')
    setStories(response.data?.stories || [])
  } catch (err) {
    console.error('[StoryLibrary] Error fetching stories:', err)
    showToast("Failed to load stories", ToastVariant.Error)
  }
}
```

---

## Security Considerations

1. **Authorization:**
   - Ensure users can only access their own stories
   - Backend should validate story ownership

2. **Input Validation:**
   - Sanitize search queries
   - Validate story IDs format

3. **Rate Limiting:**
   - Implement on backend
   - Show user-friendly message when limited

4. **Share Links:**
   - Use secure random tokens
   - Implement expiration
   - Allow revocation

---

## Rollback Plan

If issues arise, quickly rollback:

1. Change `useMockData` back to `true`
2. Application continues working with mock data
3. Investigate and fix backend issues
4. Re-deploy when ready

---

This completes the API integration guide. Follow these steps carefully to ensure a smooth transition to production.

