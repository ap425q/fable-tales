# Story Library Page

## Overview

The **Story Library Page** is a comprehensive management interface for parents to view, organize, and manage all their created stories. This page serves as a central hub for parent mode, providing tools to track story creation progress, analyze performance, and manage the story lifecycle.

## Features

### 1. Page Header

- **Title**: "My Story Library 📚"
- **Description**: Clear subtitle explaining the page purpose
- **Story Count**: Real-time display of filtered story count
- **Create New Story Button**: Prominent call-to-action button
- **Back to Home Button**: Easy navigation back to main page

### 2. Filter & Sort Controls

#### Status Filter Tabs

- **All Stories**: Shows both completed and draft stories
- **Completed**: Shows only published, ready-to-read stories
- **Drafts**: Shows stories in progress (Draft and Structure Finalized states)

#### Sort Options

- **Recently Updated**: Stories sorted by last modification date (default)
- **Recently Created**: Stories sorted by creation date
- **Title (A-Z)**: Alphabetical sort by title
- **Most Read**: Stories sorted by read count (descending)

#### Search Functionality

- **Real-time Search**: Debounced input (300ms delay)
- **Search Fields**: Searches across title, lesson, and theme
- **Clear Results**: Shows "No Stories Found" empty state when no matches

### 3. Story Cards

Each story displays in a card format with the following information:

#### Header Section

- **Cover Image**: Story thumbnail or first scene image
- **Title**: Story name (editable by clicking)
- **Status Badge**: Visual indicator (✓ Completed, ⏳ In Progress, 📝 Draft)
- **Selection Checkbox**: For bulk operations

#### Content Section

- **Theme Badge**: Color-coded badge showing story theme
- **Lesson**: Brief description of educational value
- **Statistics**:
  - Scene count (📄)
  - Read count (👁️) - only for completed stories
- **Timestamps**:
  - Creation date
  - Last update date (formatted as relative time)

#### Action Buttons

**Primary Actions**:

- **Read**: Opens story in reading mode (completed stories only)
- **Edit**: Routes to appropriate editing page based on story status
  - Draft with <10 scenes → Story Tree
  - Draft with ≥10 scenes → Character Assignment
  - Structure Finalized → Scene Generation
  - Completed → Story Tree

**Secondary Actions**:

- **Duplicate**: Creates a copy of the story
- **Statistics**: Opens detailed analytics modal (completed stories only)
- **Share**: Generates shareable link (completed stories only)

**Destructive Action**:

- **Delete**: Opens confirmation modal before deletion

### 4. View Modes

#### Grid View (Default)

- Responsive grid layout
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- Card-based display with hover effects

#### List View

- Single column layout
- More compact display
- Better for scanning many stories

### 5. Bulk Actions

When stories are selected:

- **Selection Counter**: Shows number of selected stories
- **Select/Deselect All**: Toggle all stories on current page
- **Bulk Delete**: Delete multiple stories at once
- **Visual Feedback**: Selected stories highlighted with blue border

### 6. Statistics Modal

Comprehensive analytics for completed stories:

#### Overview Cards

- **Total Reads**: Total number of times story was read
- **Average Reading Time**: Mean duration in minutes
- **Completion Rate**: Percentage of readers who finished
- **Last Read**: Most recent reading timestamp

#### Choice Distribution

- **Visual Progress Bars**: Shows selection frequency for each choice
- **Percentages and Counts**: Detailed breakdown of reader decisions
- **Scene Context**: Shows which scene each choice appears in

#### Most Visited Scenes

- **Top 10 Scenes**: Ranked by visit count
- **Visit Statistics**: Shows visit count and percentage
- **Scene Titles**: Clear identification of each scene

### 7. Modals

#### Delete Confirmation Modal

- Clear warning message
- Story title display
- "Cannot be undone" warning
- Cancel and Delete buttons

#### Bulk Delete Confirmation Modal

- Shows number of stories to be deleted
- Confirmation prompt
- Cancel and bulk delete options

#### Share Modal

- Generated share URL display
- Copy to clipboard functionality
- Only available for completed stories

### 8. Empty States

#### No Stories

- Icon: 📚
- Message: Encourages creating first story
- Action: "Create New Story" button

#### No Completed Stories

- Icon: ✨
- Message: Encourages completing first story
- Shown when "Completed" filter active

#### No Drafts

- Icon: 🎉
- Message: Celebrates all stories being complete
- Shown when "Drafts" filter active

#### No Search Results

- Icon: 🔍
- Message: Suggests adjusting search/filters
- Shown when search returns no matches

### 9. Pagination

- **20 Stories per Page**: Optimal balance for performance and UX
- **Page Numbers**: Shows up to 5 page buttons with smart truncation
- **Previous/Next Buttons**: Easy navigation between pages
- **Disabled States**: Buttons disabled at boundaries
- **Smart Page Display**:
  - Shows pages 1-5 when near start
  - Shows current page ±2 when in middle
  - Shows last 5 pages when near end

### 10. Toast Notifications

Success messages for:

- Story duplicated
- Story deleted
- Stories bulk deleted
- Share link copied

Error messages for:

- Failed to load stories
- Failed to duplicate
- Failed to delete
- Failed to load statistics
- Failed to generate share link

Warning messages for:

- Attempting to share incomplete story

## User Flows

### Creating a New Story

1. Click "Create New Story" button
2. Redirected to `/story-setup`
3. Complete story creation flow
4. Return to library to see new story

### Editing a Story

1. Click "Edit" on story card
2. Routed to appropriate page based on status:
   - Early draft → Story Tree editor
   - Character phase → Character Assignment
   - Scene generation → Scene Generation
   - Completed → Story Tree (for modifications)

### Reading a Completed Story

1. Filter to "Completed" stories
2. Click "Read" button on desired story
3. Opens in child reading mode at `/story-reading/:storyId`

### Duplicating a Story

1. Click "Duplicate" on story card
2. System creates copy with "(Copy)" suffix
3. New story appears at top of list as draft
4. Success toast notification shown

### Viewing Statistics

1. Click "Stats" on completed story card
2. Modal opens with comprehensive analytics
3. Review reader behavior and engagement
4. Close modal to return to library

### Sharing a Story

1. Click "Share" on completed story card
2. System generates unique share URL
3. Click "Copy Link" to copy to clipboard
4. Share URL with others

### Deleting Stories

#### Single Delete

1. Click "Delete" on story card
2. Confirmation modal appears
3. Confirm deletion
4. Story removed with success notification

#### Bulk Delete

1. Select multiple stories using checkboxes
2. Click "Delete Selected" button
3. Confirm bulk deletion in modal
4. All selected stories removed

### Searching and Filtering

1. Enter search query in search box
2. Results filter in real-time (with 300ms debounce)
3. Select status filter tab to narrow results
4. Change sort order to organize results
5. Clear search to see all stories

## Technical Details

### State Management

- **React Hooks**: Uses `useState` and `useEffect` for local state
- **Memoization**: `useMemo` for expensive filtering/sorting operations
- **Callbacks**: `useCallback` for optimized event handlers

### Performance Optimizations

- **Debounced Search**: 300ms delay to reduce re-renders
- **Pagination**: Limits DOM nodes to 20 cards maximum
- **Lazy Image Loading**: Images load on-demand with `loading="lazy"`
- **Memoized Filters**: Filtering and sorting only recalculates when dependencies change

### Data Flow

1. **Initial Load**: Fetches all stories on mount
2. **Client-Side Filtering**: Applies filters without API calls
3. **Client-Side Sorting**: Sorts in memory for instant response
4. **Client-Side Pagination**: Slices array for current page
5. **Optimistic Updates**: UI updates immediately for deletions/duplications

### Mock Data

Development mode uses comprehensive mock data:

- **15 Stories**: Mix of 8 completed and 7 draft stories
- **Varied Metadata**: Different themes, formats, ages, read counts
- **Realistic Statistics**: Detailed analytics for testing
- **Random Images**: Uses Unsplash for realistic cover images

### API Integration

Ready for production with API endpoints:

- `GET /api/v1/stories` - Fetch all stories
- `DELETE /api/v1/stories/:id` - Delete story
- `POST /api/v1/stories/:id/duplicate` - Duplicate story
- `GET /api/v1/stories/:id/statistics` - Get statistics
- `POST /api/v1/stories/:id/share` - Generate share link

### Accessibility

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support for all actions
- **Focus Management**: Modal focus trapping
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Color Contrast**: WCAG AA compliant color combinations

### Responsive Design

- **Mobile First**: Optimized for small screens
- **Breakpoints**:
  - Mobile: Single column, stacked filters
  - Tablet: 2 columns, horizontal filters
  - Desktop: 3 columns, full feature set
- **Touch Friendly**: Large tap targets (min 44x44px)

## Usage Example

```tsx
import StoryLibraryPage from '@/app/story-library/page'

// Page is automatically routed at /story-library
// No props needed - uses internal state and routing
```

## Dependencies

- `@/components/Button` - Action buttons
- `@/components/Card` - Story card display
- `@/components/LoadingSpinner` - Loading states
- `@/components/Modal` - Confirmation and detail modals
- `@/components/Toast` - Notification system
- `@/lib/api` - API client (for production)
- `next/navigation` - Routing via `useRouter`

## File Structure

```
story-library/
├── page.tsx                          # Main page component
├── StoryLibrary.page.mock.ts        # Mock data for development
└── README.md                         # This file
```

## Future Enhancements

Potential improvements for future iterations:

1. **Export Stories**: Download stories in various formats (PDF, EPUB)
2. **Import Stories**: Upload existing stories
3. **Story Templates**: Save stories as templates for reuse
4. **Advanced Filtering**: Filter by format, character count, etc.
5. **Story Collections**: Group stories into collections/series
6. **Collaboration**: Share editing access with other parents
7. **Version History**: Track and restore previous versions
8. **Analytics Dashboard**: More detailed analytics and trends
9. **Reading Goals**: Set and track reading goals for children
10. **Story Recommendations**: AI-suggested improvements

## Testing Checklist

- [ ] Page loads without errors
- [ ] Stories display correctly in grid and list views
- [ ] All filters work (All, Completed, Drafts)
- [ ] All sort options work correctly
- [ ] Search filters results in real-time
- [ ] Pagination works correctly
- [ ] Story cards display all information
- [ ] Read button navigates to reading page
- [ ] Edit button routes to correct page based on status
- [ ] Duplicate creates copy successfully
- [ ] Statistics modal shows correct data
- [ ] Share modal generates URL
- [ ] Copy to clipboard works
- [ ] Delete confirmation works
- [ ] Bulk selection works
- [ ] Bulk delete works
- [ ] Empty states display correctly
- [ ] Toast notifications appear
- [ ] Responsive design works on all screen sizes
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

## Known Issues

None currently. This is a new implementation.

## Support

For questions or issues, please contact the development team or refer to the main project documentation.

