# Scene Image Generation Page

## Overview

The **Scene Image Generation Page** is the final step in the parent mode workflow where all scene images are created by combining assigned characters with generated backgrounds. This page provides comprehensive tools for reviewing, regenerating, and managing scene images with version history.

## Location

- **Route**: `/scene-generation/[storyId]`
- **Page Component**: `packages/web/src/app/scene-generation/[storyId]/page.tsx`
- **Mock Data**: `packages/web/src/app/scene-generation/[storyId]/scene-generation.page.mock.ts`

## Features

### 1. Initial Generation

- **Auto-trigger on page load** (optional) - Can be configured to generate all scenes automatically if none exist
- **"Generate All Scene Images" button** - Manually trigger bulk generation
- **Loading overlay** with cheerful message: "Bringing your story to life..."
- **No detailed progress bar** - Uses Promise.all for fast concurrent generation
- **Simple loading spinner** with scene count

### 2. Scene Grid (Main Area)

- **Responsive grid layout**:
  - 3 columns on large screens
  - 2 columns on tablets
  - 1 column on mobile
- **Each scene card displays**:
  - Scene number badge
  - Scene title
  - Story text preview (truncated with line-clamp)
  - Generated image (large display with aspect ratio)
  - Image status badges (Ready, Generating, Failed)
  - Character icons used in scene (overlapping avatars)
  - Background/location name
  - Version count badge (if multiple versions)
- **Sort by scene number** (default)
- **Filter options**: 
  - All Scenes
  - Completed
  - Needs Regeneration

### 3. Individual Scene Management

#### Scene Card Actions
- Click entire card to open detailed modal
- Quick "Regenerate" button on card (without opening modal)
- Checkbox for multi-select
- Loading state during regeneration with spinner
- Hover effect showing "view" icon

#### Scene Detail Modal
Opens when clicking a scene card:
- **Full scene text** (complete, not truncated)
- **Large image display** (full width)
- **Version history thumbnails** (horizontal scroll)
  - Shows up to 5 versions
  - Click thumbnail to select version
  - Selected version has purple border and checkmark
  - Shows version number on each thumbnail
- **"Regenerate" button** in modal footer
- **Scene metadata**:
  - Location/setting
  - Scene type (start, normal, choice, ending)
- **Close button** to dismiss modal

### 4. Version History

- **Stores all generated versions** for each scene (up to 5)
- **Thumbnails displayed** below main image in modal
- **Currently selected version** has:
  - Purple border (4px)
  - Ring effect (purple-200)
  - Checkmark icon
  - Slightly larger scale (105%)
- **Version metadata**:
  - Generation timestamp
  - Version number (v1, v2, v3, etc.)
- **Click to select** - Updates immediately with optimistic UI
- **Version selection** persists across page reloads

### 5. Bulk Operations

- **Checkbox on each card** for selection
- **"Regenerate Selected" button** - Appears when items are checked
- **"Select All" / "Deselect All"** toggle buttons
- **Selected count display** - Shows "X selected"
- **Visual feedback** - Selected cards have purple ring
- **Clear selection** button when items are selected

### 6. Completion & Navigation

#### Complete Story Button
- **Enabled only when** all scenes have generated images
- Opens confirmation modal with final title input

#### Confirmation Modal
- **Title input field** (required, max 100 characters)
- **What happens next** info section
- **Cancel and Complete buttons**

#### Success Flow
- Success confetti/celebration animation
- Navigation options:
  - "Preview in Child Mode" (future feature)
  - "Back to Edit" (returns to story tree)
  - "Create New Story" (goes to story setup)

### 7. Generation Status Polling

After initial generation triggers:
- **Poll status endpoint** every 2 seconds
- **Update individual cards** as they complete
- **Show errors** if generation fails with retry option
- **Stop polling** when all scenes are complete
- **Cleanup on unmount** to prevent memory leaks

## State Management

### Main State Variables

```typescript
// Scene data
const [scenes, setScenes] = useState<SceneWithImages[]>([])
const [characters, setCharacters] = useState<MockCharacter[]>([])

// Selection and filtering
const [selectedSceneIds, setSelectedSceneIds] = useState<Set<string>>(new Set())
const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "needs_regen">("all")

// Modal states
const [selectedScene, setSelectedScene] = useState<SceneWithImages | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
const [storyTitle, setStoryTitle] = useState("")
const [showConfetti, setShowConfetti] = useState(false)

// Loading states
const [isLoading, setIsLoading] = useState(true)
const [isBulkGenerating, setIsBulkGenerating] = useState(false)
const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set())
const [error, setError] = useState<string>("")

// Polling
const [jobId, setJobId] = useState<string | null>(null)
const pollCountRef = useRef(0)
const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
```

### Key Functions

- `handleGenerateAll()` - Start bulk generation with Promise.all
- `handleRegenerate(sceneId)` - Regenerate single scene
- `handleRegenerateSelected()` - Bulk regenerate selected scenes
- `handleSelectVersion(sceneId, versionId)` - Select a version
- `handleOpenSceneModal(scene)` - Open detail modal
- `handleToggleSelection(sceneId)` - Toggle checkbox
- `handleSelectAll()` / `handleDeselectAll()` - Bulk selection
- `handleCompleteStory()` - Open completion modal
- `handleConfirmCompletion()` - Finalize and save story

## API Integration

### Endpoints (To be implemented)

```typescript
// Initial generation
POST /api/v1/stories/{storyId}/scenes/generate-all-images
Response: { jobId: string, message: string, sceneCount: number }

// Poll status
GET /api/v1/stories/{storyId}/scenes/generation-status?jobId={jobId}
Response: { status: string, scenes: SceneStatusItem[], progress: { completed: number, total: number } }

// Get scene versions
GET /api/v1/stories/{storyId}/scenes/{sceneId}/image-versions
Response: { versions: ImageVersion[] }

// Regenerate single scene
POST /api/v1/stories/{storyId}/scenes/{sceneId}/regenerate-image
Response: { sceneId: string, versionId: string, imageUrl: string, status: string }

// Bulk regenerate
POST /api/v1/stories/{storyId}/scenes/regenerate-multiple
Body: { sceneIds: string[] }
Response: { jobId: string, message: string, sceneIds: string[] }

// Select version
POST /api/v1/stories/{storyId}/scenes/{sceneId}/select-version
Body: { versionId: string }
Response: { sceneId: string, selectedVersionId: string, imageUrl: string }

// Complete story
POST /api/v1/stories/{storyId}/complete
Body: { title: string }
Response: { storyId: string, status: string, title: string, shareUrl: string, completedAt: string }
```

## Mock Data

The mock data file includes:

### mockSceneImages
Array of 10 scenes with different states:
- 7 completed scenes with 1-4 versions each
- 1 generating scene
- 1 failed scene
- Realistic scene text and metadata

### mockCharacters
5 character profiles with:
- Character ID
- Name
- Image URL (using preset character images)

### Generation Status Simulators
- `mockGenerationStatusInitial` - Just started
- `mockGenerationStatusProgress` - Partially complete
- `mockGenerationStatusCompleted` - All done
- `simulateGenerationPolling()` - Simulates progressive updates

## UI Components Used

- **Card** - Scene display cards
- **Modal** - Scene detail and completion modals
- **Button** - All action buttons
- **LoadingSpinner** - Loading states
- **Input** - Story title input (native)
- **Checkbox** - Scene selection (native with custom styling)

## Responsive Design

### Desktop (lg)
- 3-column grid
- Full modal width (max-w-4xl)
- Side-by-side action buttons

### Tablet (md)
- 2-column grid
- Medium modal width (max-w-2xl)
- Stacked action buttons

### Mobile (sm)
- 1-column grid
- Full-width modal with padding
- Full-width buttons
- Scrollable version history

## Loading States

### Page Load
- Full-screen spinner with "Loading scenes..." message
- Gradient background

### Bulk Generation
- Modal overlay with:
  - Large spinner
  - "Bringing Your Story to Life..." heading
  - Progress count (X / Y)
  - Motivational message

### Individual Regeneration
- Card shows spinner overlay
- "Creating..." text
- Regenerate button disabled
- Card remains interactive (modal still opens)

### Success States
- Green "Ready" badge on completed scenes
- Checkmark icon
- Version count badge
- Hover effects enabled

### Error States
- Red "Failed" badge
- X icon
- Error message in card
- "Retry" button (red themed)

## Optimistic UI Updates

1. **Version Selection** - Updates immediately when clicking thumbnail
2. **Regeneration Start** - Shows generating state before API responds
3. **Bulk Operations** - Staggers visual updates for better UX
4. **Completion** - Shows confetti before navigation

## Keyboard & Accessibility

- **Modal focus trap** - Focus stays within modal
- **Escape to close** - Press ESC to close modals
- **Checkbox labels** - Proper aria-labels for screen readers
- **Image alt text** - Descriptive alt text for all images
- **Semantic HTML** - Proper heading hierarchy
- **Color contrast** - WCAG AA compliant

## Error Handling

- **Network errors** - Shown in dismissible alert banner
- **Generation failures** - Per-scene "Failed" badge with retry
- **Validation errors** - Inline on form fields
- **Polling errors** - Console logged, don't interrupt UI
- **Graceful degradation** - Works without images loaded

## Performance Optimizations

- **Lazy loading images** - Uses `loading="lazy"` attribute
- **Efficient polling** - 2-second interval, cleans up on unmount
- **Optimistic updates** - UI updates before API confirmation
- **Debounced actions** - Prevents double-clicks
- **Minimal re-renders** - Uses callback hooks appropriately

## Future Enhancements

1. **Drag-and-drop reordering** - Rearrange scene order
2. **Batch export** - Download all images at once
3. **Image editing** - Crop, rotate, adjust brightness
4. **Prompt customization** - Add custom prompts per scene
5. **A/B testing** - Compare versions side-by-side
6. **Share preview** - Generate shareable preview link
7. **Version comparison slider** - Swipe between versions
8. **Undo/redo** - Version selection history

## Testing

### Manual Testing Checklist

- [ ] Page loads with mock data
- [ ] "Generate All" button triggers generation
- [ ] Individual regenerate works
- [ ] Bulk regenerate works with selections
- [ ] Select all / deselect all functions
- [ ] Filter dropdown works (all, completed, needs regen)
- [ ] Scene card click opens modal
- [ ] Modal displays full content
- [ ] Version selection updates image
- [ ] Complete button disabled when not ready
- [ ] Completion modal opens
- [ ] Story title validation works
- [ ] Confetti shows on completion
- [ ] Navigation buttons work
- [ ] Responsive layout on mobile
- [ ] Loading states display correctly
- [ ] Error handling shows messages

### Integration Testing

- [ ] API calls use correct endpoints
- [ ] Polling starts and stops correctly
- [ ] Version selection persists
- [ ] State updates propagate correctly
- [ ] Cleanup on unmount prevents leaks

## Related Pages

- **Previous**: [Background Setup](/background-setup/[storyId]) - Generate location backgrounds
- **Next**: Story Preview (Child Mode) - Read completed story
- **Alternative**: [Story Setup](/story-setup) - Create new story

## Workflow Position

```
Story Setup → Story Tree → Character Assignment → Background Setup → **Scene Generation** → Story Complete
```

This is the **final step** in the parent creation workflow before the story becomes available for children to read.

