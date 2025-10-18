# Character Role Assignment Page

## Overview

The Character Role Assignment page is where parents assign preset character images to the roles generated in their story. This is a critical step in the story creation workflow that connects story roles (Protagonist, Friend, Helper, Antagonist) to visual representations.

## Location

**Route:** `/character-assignment/[storyId]`

**File:** `/src/app/character-assignment/[storyId]/page.tsx`

## Purpose

After the story structure is finalized, parents need to choose how their characters will look. The system provides a library of preset character images (10 options) that can be assigned to the 4 roles in the story.

## Features

### Character Gallery (Left Section - 40% Width)

- **Grid Display:** 2-column responsive grid of preset characters
- **Character Cards:** Each shows:
  - Character image (thumbnail)
  - Character name
  - Assignment status
- **Visual States:**
  - Hover effect on available characters
  - Selected state (blue ring)
  - Assigned state (dimmed with checkmark)
  - Dragging state (semi-transparent)
- **Sticky Positioning:** Gallery stays visible while scrolling roles

### Role Assignment Area (Right Section - 60% Width)

- **Role Cards:** Display for each story role showing:
  - Role name and description
  - Empty slot placeholder when unassigned
  - Assigned character image and details when filled
  - Action buttons (Remove/Change) when assigned
- **Visual Feedback:**
  - Highlight on drag hover
  - Selected state for active role
  - Completion badge when assigned
- **Drop Zones:** Clear visual indicators for drag-and-drop

### Assignment Interactions

#### Method 1: Click to Assign
1. Click a character in the gallery (becomes selected with blue ring)
2. Click a role slot
3. Character is assigned to that role
4. Both selections are cleared

#### Method 2: Drag and Drop
1. Drag a character from the gallery
2. Visual feedback shows valid drop zones
3. Drop onto a role slot
4. Character is assigned to that role
5. Drag state is cleared

**Constraints:**
- Each character can only be assigned to one role
- Attempting to assign an already-assigned character shows an error message
- All roles must be assigned before proceeding

### Validation & Navigation

- **Progress Indicator:** Shows "X / 4 Characters Assigned" with checkmark when complete
- **Assignment Preview:** When complete, shows all assigned characters together
- **Navigation Buttons:**
  - "Back to Story Editor" - Returns to story tree page
  - "Next: Background Setup" - Proceeds to background customization (disabled until complete)
- **Validation Messages:**
  - Error displayed for 3 seconds when trying to assign same character twice
  - Warning if trying to proceed with incomplete assignments

## User Flow

```
Story Tree Editor
       ↓
Character Assignment Page
  ├── Load preset characters
  ├── Load story roles
  ├── Load existing assignments (if any)
  ├── Assign characters to roles
  ├── Validate all roles assigned
  └── Save assignments
       ↓
Background Setup Page
```

## Data Flow

### Input Data
- **Story ID:** From URL parameter
- **Preset Characters:** Fetched from `/api/v1/characters`
- **Story Roles:** Fetched from story data (generated during story creation)
- **Existing Assignments:** Fetched from `/api/v1/stories/{storyId}/character-assignments`

### Output Data
- **Character Assignments:** Saved to `/api/v1/stories/{storyId}/character-assignments`
  ```typescript
  {
    assignments: [
      {
        characterRoleId: "role_001",
        presetCharacterId: "char_f_amelia"
      },
      // ... more assignments
    ]
  }
  ```

## State Management

### Component State
- `presetCharacters` - Array of available characters
- `storyRoles` - Array of story roles to fill
- `assignments` - Map of roleId → characterId
- `selectedCharacter` - Currently selected character ID (click method)
- `selectedRole` - Currently selected role ID (click method)
- `draggedCharacter` - Character being dragged (drag method)
- `hoveredRole` - Role being hovered during drag (drag method)

### Loading States
- `isLoading` - Initial data fetch
- `isSaving` - Saving assignments to backend

### Error States
- `error` - Error message to display to user

## Mock Data

Mock data is provided in `character-assignment.page.mock.ts`:

- `mockPresetCharacters` - 10 preset characters matching `/public/characters/` images
- `mockStoryRoles` - 4 typical story roles with descriptions
- `mockExistingAssignments` - Partially completed assignments for testing
- API response mocks for all endpoints

## Component Structure

```tsx
CharacterAssignmentPage
├── Header Section
│   ├── Title & Description
│   └── Progress Indicator
├── Error Display
├── Main Content Area
│   ├── Character Gallery (Left 40%)
│   │   ├── Gallery Header
│   │   └── Character Grid
│   │       └── Character Cards (with drag/click handlers)
│   └── Role Assignment Area (Right 60%)
│       └── Role Cards (with drop/click handlers)
│           ├── Role Info
│           ├── Assignment Slot (empty or filled)
│           └── Action Buttons (Remove/Change)
├── Assignment Preview (when complete)
├── Navigation Buttons
├── Instructions Card
└── Saving Overlay
```

## Styling

### Layout
- **Responsive:** Stacks vertically on mobile, side-by-side on desktop (lg breakpoint)
- **Colors:** Purple-pink-blue gradient background, white cards
- **Spacing:** Consistent 6-unit gap between sections
- **Shadows:** Layered shadow effects on cards

### Interactive States
- **Hover:** Shadow lift and slight scale on character cards
- **Selected:** 2px blue ring around selected character
- **Assigned:** 50% opacity with green checkmark badge
- **Dragging:** 50% opacity on dragged character, highlight on drop zones
- **Disabled:** 50% opacity with not-allowed cursor

### Accessibility
- **Keyboard Navigation:** All cards are keyboard accessible
- **ARIA Labels:** Proper role and aria-pressed attributes
- **Focus States:** Clear focus indicators on all interactive elements

## Mobile Considerations

- **Touch Devices:** Drag-and-drop works with touch events
- **Click Method:** Primary interaction method on mobile
- **Responsive Grid:** Character gallery adjusts to single column on small screens
- **Scrollable Gallery:** Fixed max-height with scroll on mobile

## API Integration

### Endpoints Used

1. **GET /api/v1/characters**
   - Fetch all preset characters
   - Used on page load

2. **GET /api/v1/stories/{storyId}**
   - Get story details including roles
   - Used on page load

3. **GET /api/v1/stories/{storyId}/character-assignments**
   - Get existing assignments (if any)
   - Used on page load to restore state

4. **POST /api/v1/stories/{storyId}/character-assignments**
   - Save character assignments
   - Used when clicking "Next: Background Setup"

### Error Handling

- Network errors show user-friendly messages
- Validation errors displayed inline
- Failed saves allow retry
- Loading states prevent double-submission

## Development Notes

### Current Status
✅ Mock data implementation
✅ Full UI with drag-and-drop
✅ Click-to-assign interaction
✅ Validation and progress tracking
✅ Responsive design
⚠️ API integration (commented out, ready to uncomment)

### TODO
- [ ] Uncomment API calls when backend is ready
- [ ] Add character filtering by category
- [ ] Add character search functionality
- [ ] Add undo/redo for assignments
- [ ] Add keyboard shortcuts for power users
- [ ] Add animation for assignment success
- [ ] Create Background Setup page for next step

### Testing Checklist
- [ ] Load page with no existing assignments
- [ ] Load page with partial assignments
- [ ] Load page with complete assignments
- [ ] Drag and drop character to role
- [ ] Click character then click role
- [ ] Try to assign same character twice
- [ ] Remove assignment
- [ ] Change assignment
- [ ] Try to proceed with incomplete assignments
- [ ] Complete all assignments and proceed
- [ ] Test on mobile/tablet
- [ ] Test keyboard navigation
- [ ] Test with slow network
- [ ] Test error states

## Related Files

- `/src/app/character-assignment/[storyId]/page.tsx` - Main page component
- `/src/app/character-assignment/[storyId]/character-assignment.page.mock.ts` - Mock data
- `/src/lib/api.ts` - API client with character endpoints
- `/src/lib/apiTypes.ts` - TypeScript interfaces for API
- `/src/types.ts` - Core type definitions
- `/src/components/Card.tsx` - Card component used for characters
- `/public/characters/` - Preset character images

## Character Images

The app currently includes 10 preset character images:

**Female Characters:**
- Amelia (`f_amelia.png`)
- Ava (`f_ava.png`)
- Emma (`f_emma.png`)
- Olivia (`f_olivia.png`)
- Sophia (`f_sophia.png`)

**Male Characters:**
- James (`m_james.png`)
- John (`m_john.png`)
- Joseph (`m_joseph.png`)
- Noah (`m_noah.png`)
- William (`m_william.png`)

All images are located in `/public/characters/` and referenced via `/characters/[filename]`.

## UX Principles

1. **Clear Visual Feedback:** Every interaction has immediate visual response
2. **Multiple Methods:** Both drag-drop and click methods accommodate different user preferences
3. **Error Prevention:** Can't assign same character twice, can't proceed incomplete
4. **Progress Visibility:** Always shows how many roles are filled
5. **Reversibility:** Can easily remove or change assignments
6. **Guidance:** Clear instructions and contextual help
7. **Celebration:** Preview of all characters when complete

## Performance Considerations

- **Image Lazy Loading:** Character images load on demand
- **Optimistic Updates:** UI updates immediately, backend saves asynchronously
- **Debounced Drag Events:** Prevent excessive re-renders during drag
- **Memoized Computations:** Character lookup and validation checks are efficient
- **Conditional Rendering:** Preview only shows when complete

## Future Enhancements

1. **Custom Character Upload:** Allow parents to upload their own character images
2. **Character Customization:** Edit character appearance before assignment
3. **AI Recommendations:** Suggest character assignments based on role descriptions
4. **Character Categories:** Filter by Human/Animal/Fantasy/Robot
5. **Character Traits:** Add personality traits to guide selection
6. **Bulk Actions:** Assign all at once with recommended matches
7. **Assignment History:** See previous assignments for this story
8. **Character Preview in Context:** Show character in sample scene

