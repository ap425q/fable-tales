# Background Setup - Feature Documentation

## Core Features

### 1. Location Display & Management

#### Location Cards
Each location is displayed in a card with:
- **Location Name**: Displayed as heading (read-only, extracted from story)
- **Scene Numbers with Tooltips**: Shows which scenes use this location
  - Hover over scene number to see scene content
  - Blue highlighted numbers
  - Dark tooltip with scene text
- **Description Textarea**: Rich text area for location description
- **Character Counter**: Shows X/300 characters used
- **Auto-save**: Description changes save automatically after 1 second

#### Grid Layout
- **Desktop (lg+)**: 2-column responsive grid
- **Tablet (md)**: 2-column grid
- **Mobile (sm)**: 1-column full-width
- **Card Spacing**: 1.5rem (24px) gap between cards
- **Max Width**: 7xl (80rem / 1280px) centered container

### 2. Image Generation System

#### Bulk Generation
```typescript
Feature: Generate All Backgrounds
- Single button triggers all pending generations
- Shows count of backgrounds to generate
- Disabled when all complete or generation in progress
- Displays loading spinner during operation
```

**User Flow:**
1. Click "Generate All Backgrounds" button
2. Modal overlay appears with progress
3. Each background updates in real-time
4. Completion notification when done

#### Individual Generation
```typescript
Feature: Generate Single Background
- Each card has "Generate" button
- Only shown if no images exist
- Requires non-empty description
- Shows loading state on specific card
```

**User Flow:**
1. Add/edit description for location
2. Click "Generate Background" on card
3. Card shows generating spinner
4. Image appears when complete

#### Regeneration
```typescript
Feature: Regenerate Existing Background
- "Regenerate" button in ImageViewer
- Creates new version
- Maintains version history
- Auto-selects newest version
```

**User Flow:**
1. Click "Regenerate" on ImageViewer
2. Current image dims with loading overlay
3. New version added to version history
4. New version auto-selected

### 3. Version Management

#### Version History Display
```typescript
Component: ImageViewer with Version History
- Horizontal scrolling thumbnail strip
- Shows up to unlimited versions
- Thumbnails: 80px × 80px (w-20 h-20)
- Current version highlighted with blue border
```

**Features:**
- Version numbering: v1, v2, v3, etc.
- Timestamp displayed on hover
- Click to select version
- Smooth scroll animation

#### Version Selection
```typescript
Feature: Select Preferred Version
- Click thumbnail to activate
- Selected version shows in main view
- Blue border indicates selection
- State updated immediately
- API call persists selection (when integrated)
```

**Behavior:**
- Each background tracks its own selected version
- Clicking a version thumbnail updates the main image
- Selected version persists across regenerations
- Newly generated versions are auto-selected
- Selected version highlighted in version history

### 4. Status Tracking

#### Generation Status Enum
```typescript
enum GenerationStatus {
  PENDING = "pending",       // Not started, needs description
  GENERATING = "generating", // AI creating image
  COMPLETED = "completed",   // Successfully generated
  FAILED = "failed"          // Error occurred
}
```

#### Status Indicators

**Pending:**
- No image placeholder
- "Generate Background" button
- Helper text if description empty

**Generating:**
- Loading spinner overlay
- "Generating..." text
- Spinning icon animation
- Card slightly dimmed

**Completed:**
- Image displayed
- "Regenerate" button
- Version history visible
- Green checkmark in header

**Failed:**
- Error message displayed
- "Try Again" button
- Maintains previous image if exists
- Error icon in red

### 5. Polling & Real-time Updates

#### Polling Mechanism
```typescript
Configuration:
- Interval: 2000ms (2 seconds)
- Max Duration: Until completion or error
- Auto-cleanup: On unmount or completion
- Error Handling: Retry with backoff
```

**Polling Flow:**
```
1. Start Generation → Returns jobId
2. Begin polling with jobId
3. Check status every 2s
4. Update UI with progress
5. Stop when all complete
6. Cleanup interval
```

#### Real-time UI Updates
- Individual card status updates
- Progress counter in overlay
- Overall completion percentage
- Dynamic button states

### 6. Auto-save System

#### Debounced Saves
```typescript
Configuration:
- Debounce Delay: 1000ms (1 second)
- Auto-save: Description changes only (names are read-only)
- API Endpoint: PATCH /backgrounds/{id}
- Feedback: Automatic, no manual save needed
```

**Save Flow:**
```
1. User types in description textarea
2. Timer starts (1s)
3. User continues typing
4. Timer resets
5. User stops typing
6. After 1s, save to API
7. Update local state
```

#### Timer Management
- One timer per field per background
- Cleanup on unmount
- Clear existing timer on new input
- Prevents race conditions

### 7. Progress Tracking

#### Header Progress Badge
```typescript
Display: "X / Y Backgrounds Ready"
- X: Count of completed backgrounds
- Y: Total background count
- Icon: Image/photo icon
- Checkmark: Green when all complete
```

**Calculation Logic:**
```typescript
completed = backgrounds.filter(bg => 
  bg.generationStatus === GenerationStatus.COMPLETED &&
  bg.imageVersions.length > 0
).length
```

#### Overlay Progress
```typescript
Display: "X / Y completed"
- Shows during bulk generation
- Updates in real-time
- Animated spinner
- Motivational message
```

### 8. Navigation & Flow Control

#### Navigation Rules
```typescript
Back Button:
- Enabled: Always (except during bulk generation)
- Route: /character-assignment/{storyId}
- State: Preserves all changes

Next Button:
- Enabled: Only when isAllReady() === true
- Route: /scene-generation/{storyId}
- Validation: All backgrounds must have images
```

#### Ready State Validation
```typescript
function isAllReady(): boolean {
  return backgrounds.every(bg =>
    bg.generationStatus === GenerationStatus.COMPLETED &&
    bg.imageVersions.length > 0
  )
}
```

### 9. Error Handling

#### Error Display Component
```typescript
Component: Alert Banner
- Position: Below header
- Style: Red border, light red background
- Icon: Error X icon
- Dismissible: Auto-dismiss after 3s
```

**Error Types:**
- Load failures
- Generation failures
- Network errors
- Validation errors
- API errors

#### Error Recovery
```typescript
Strategies:
1. Retry Button: Allow manual retry
2. State Rollback: Revert to previous state
3. Clear Error: Auto-clear after timeout
4. Preserve Data: Don't lose unsaved changes
```

### 10. Loading States

#### Page Load
```typescript
Full-page Spinner:
- Centered vertically and horizontally
- Large spinner size
- "Loading backgrounds..." message
- Gradient background
```

#### Bulk Generation
```typescript
Modal Overlay:
- Semi-transparent backdrop
- Centered modal card
- Progress counter
- Spinner animation
- Cannot dismiss during generation
```

#### Individual Generation
```typescript
Card-level Loading:
- Inline spinner on card
- "Generating..." status text
- Disabled interactions
- Loading overlay on image area
```

## Advanced Features

### Description Templates (Future)
Pre-written description templates for common locations:
- Forest scenes
- Castle/palace
- Village/town
- Cave/underground
- Ocean/beach
- Mountain/cliff
- Desert
- Space/sky

### Style Presets (Future)
Art style options for backgrounds:
- Watercolor
- Cartoon/Comic
- Realistic/Photo
- Oil Painting
- Digital Art
- Minimalist
- Detailed/Intricate

### Batch Operations (Future)
Bulk editing capabilities:
- Edit multiple descriptions at once
- Apply style to all backgrounds
- Bulk regenerate selected
- Copy description to similar locations

### AI Suggestions (Future)
Smart description generation:
- Auto-suggest based on location name
- Enhance existing descriptions
- Mood/tone adjustments
- Style recommendations

## Performance Optimizations

### Image Loading
- Lazy loading for thumbnails
- Progressive loading for main images
- Optimized image sizes
- Caching strategy

### State Management
- Debounced inputs (1s)
- Optimistic updates
- Minimal re-renders
- Memoized calculations

### API Efficiency
- Batched updates
- Polling optimization
- Request deduplication
- Error retry with backoff

### Memory Management
- Cleanup intervals on unmount
- Clear timers properly
- Remove event listeners
- Garbage collection friendly

## Accessibility Features

### Keyboard Navigation
- Tab through all inputs
- Enter to submit
- Escape to cancel/close
- Arrow keys for version selection

### Screen Reader Support
- ARIA labels on all buttons
- ARIA live regions for status updates
- Semantic HTML structure
- Alt text on all images

### Visual Accessibility
- High contrast text
- Focus indicators
- Color not sole indicator
- Readable font sizes

### Motion Preferences
- Respects prefers-reduced-motion
- Optional animation disable
- Smooth but not excessive transitions

## Mobile Optimization

### Touch Interactions
- Large touch targets (44px minimum)
- Swipe for version history
- Pull to refresh (optional)
- Touch-friendly spacing

### Responsive Images
- Appropriate sizes for viewport
- Efficient loading
- Touch zoom on images
- Pinch to zoom support

### Mobile-specific UI
- Stacked layout on mobile
- Bottom-sheet modals
- Thumb-friendly buttons
- Reduced animation on mobile

## Integration Points

### Data Flow
```
Story Tree Editor
    ↓ (locations extracted)
Character Assignment
    ↓ (characters assigned)
→ Background Setup ←
    ↓ (backgrounds ready)
Scene Generation
    ↓ (scenes complete)
Final Review
```

### API Dependencies
- Story data (locations from nodes)
- Character assignments (not used here but required before)
- Background generation service
- Image storage service

### State Persistence
- Backgrounds saved in database
- Version history maintained
- Selection preferences stored
- Can return to page later

## Testing Considerations

### Unit Tests
- Component rendering
- State management
- Event handlers
- Utility functions

### Integration Tests
- API interactions
- Polling mechanism
- Navigation flow
- Error scenarios

### E2E Tests
- Complete user flow
- Generation process
- Version management
- Error recovery

### Visual Tests
- Card layouts
- Responsive behavior
- Loading states
- Error states

