# Background Setup Page

## Overview

The Background Setup page allows parents to manage and generate background images for all locations in their story. This is a critical step in the story creation workflow, occurring after character assignment and before scene image generation.

## Features

### 1. Location Management
- **View All Locations**: Display all locations extracted from the story structure
- **Edit Names**: Modify location names with auto-save
- **Edit Descriptions**: Update location descriptions to improve image generation quality
- **Scene Numbers**: View which scenes use each location

### 2. Image Generation
- **Bulk Generation**: Generate all backgrounds at once with a single button
- **Individual Generation**: Generate backgrounds one at a time
- **Individual Regeneration**: Regenerate specific backgrounds if not satisfied
- **Real-time Status**: Visual indicators show generation progress

### 3. Version Management
- **Multiple Versions**: Each background can have multiple generated versions
- **Version History**: View all generated versions in a horizontal scroll
- **Version Selection**: Click to select preferred version
- **Visual Indicators**: Selected version is highlighted

### 4. Progress Tracking
- **Overall Progress**: Shows X/Y backgrounds ready
- **Completion Status**: Visual checkmark when all backgrounds complete
- **Individual Status**: Each card shows its generation status
- **Polling Updates**: Automatic updates every 2 seconds during generation

## User Flow

1. **Load Page**: Backgrounds load with existing data
2. **Review & Edit**: Parent reviews location names and descriptions
3. **Generate**: Parent clicks "Generate All" or individual "Generate" buttons
4. **Monitor Progress**: System polls for updates and displays progress
5. **Review Results**: Parent reviews generated backgrounds
6. **Regenerate (Optional)**: Parent can regenerate any background if needed
7. **Select Versions (Optional)**: Parent can choose from multiple versions
8. **Continue**: Once all backgrounds are ready, proceed to scene generation

## Technical Details

### State Management

```typescript
- backgrounds: Location[] - Array of all locations with images
- editingDescriptions: {[key: string]: string} - Current description values
- editingNames: {[key: string]: string} - Current name values
- isLoading: boolean - Initial page load state
- isBulkGenerating: boolean - Bulk generation in progress
- regeneratingIds: Set<string> - Individual backgrounds being regenerated
- error: string - Error message to display
- jobId: string | null - Current generation job ID
```

### Polling Mechanism

When bulk generation starts:
1. System starts polling every 2 seconds
2. Updates individual background statuses
3. Shows progress in overlay
4. Stops polling when all complete
5. Cleans up polling on unmount

### Auto-save

- **Debounced**: 1 second delay after last keystroke
- **Name Changes**: Saved to backend automatically
- **Description Changes**: Saved to backend automatically
- **Cleanup**: All timers cleared on unmount

## API Integration

### Endpoints Used

1. `GET /api/v1/stories/{storyId}/backgrounds`
   - Load all backgrounds for the story
   - Called on component mount

2. `PATCH /api/v1/stories/{storyId}/backgrounds/{backgroundId}`
   - Update background name or description
   - Called after 1s debounce on input changes

3. `POST /api/v1/stories/{storyId}/backgrounds/generate-all`
   - Start bulk generation of all backgrounds
   - Returns jobId for polling

4. `GET /api/v1/stories/{storyId}/backgrounds/generation-status?jobId={jobId}`
   - Poll generation progress
   - Called every 2 seconds during generation

5. `POST /api/v1/stories/{storyId}/backgrounds/{backgroundId}/regenerate`
   - Regenerate individual background
   - Creates new version

6. `POST /api/v1/stories/{storyId}/backgrounds/{backgroundId}/select-version`
   - Mark a version as selected/preferred
   - Updates current version

## Component Structure

```
BackgroundSetupPage/
├── Header (Title, description, progress)
├── Error Display (if any)
├── Bulk Controls (Generate All button)
├── Background Grid (2 columns on desktop)
│   └── BackgroundCard (for each location)
│       ├── Name Input
│       ├── Scene Numbers
│       ├── Description Textarea
│       ├── Status Indicator
│       ├── ImageViewer
│       │   ├── Image Display
│       │   ├── Regenerate Button
│       │   └── Version History
│       └── Generate Button (if not generated)
├── Navigation (Back/Next buttons)
├── Help Card (instructions)
└── Generation Overlay (during bulk generation)
```

## Generation Status Values

```typescript
enum GenerationStatus {
  PENDING = "pending",       // Not started
  GENERATING = "generating", // In progress
  COMPLETED = "completed",   // Finished successfully
  FAILED = "failed"          // Error occurred
}
```

## Navigation Rules

- **Back Button**: Always enabled (unless bulk generating)
- **Next Button**: Enabled only when ALL backgrounds have at least one generated image
- **Warning**: Shows error if user tries to continue without all backgrounds ready

## Responsive Design

- **Desktop (lg+)**: 2-column grid
- **Mobile**: 1-column grid (full width)
- **Cards**: Full width within grid column
- **Version History**: Horizontal scroll on all sizes

## Error Handling

1. **Load Failure**: Shows error message, allows retry
2. **Generation Failure**: Resets background to previous state, shows error
3. **Network Issues**: Clear error messages guide user
4. **Empty Description**: Disables generate button, shows helper text

## Accessibility

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper labels on all buttons and inputs
- **Loading States**: Screen readers announce loading states
- **Error Messages**: Announced to screen readers
- **Focus Management**: Logical tab order

## Mock Data

The page includes comprehensive mock data for development:
- 4 backgrounds with different states
- Multiple versions for testing version selection
- Polling simulation that progresses through states
- Realistic delays for better UX testing

## Future Enhancements

1. **Custom Upload**: Allow parents to upload their own backgrounds
2. **Style Presets**: Offer art style options (watercolor, cartoon, realistic)
3. **Batch Edit**: Edit multiple descriptions at once
4. **Templates**: Provide description templates for common locations
5. **Preview Scenes**: Show which scenes will use each background
6. **Drag & Drop Reorder**: Allow reordering backgrounds
7. **Advanced Editing**: In-browser image editing tools
8. **AI Suggestions**: Auto-generate description suggestions

## Related Pages

- **Previous**: [Character Assignment](../character-assignment/README.md)
- **Next**: Scene Generation (to be implemented)
- **Related**: [Story Tree Editor](../story-tree/README.md)

