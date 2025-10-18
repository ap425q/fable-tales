# Scene Image Generation - Quick Start

## Getting Started

### Accessing the Page

Navigate to: `/scene-generation/[storyId]`

Example: `/scene-generation/e9780360-5bdc-4c10-92a7-0a303cd7eae1`

### Prerequisites

Before reaching this page, users should have:
1. ✅ Created a story with structure
2. ✅ Assigned characters to roles
3. ✅ Generated background images for all locations

## Basic Usage

### 1. Generate All Scenes

Click the **"Generate All Scene Images"** button at the top:
- Triggers generation for all scenes
- Shows loading overlay with progress
- Updates cards as they complete
- Takes 2-5 minutes for 10-15 scenes

### 2. Review Generated Images

Browse the scene grid:
- **Green "Ready" badge** = Image generated successfully
- **Blue spinner** = Currently generating
- **Red "Failed" badge** = Generation error (click "Retry")
- **Gray placeholder** = Not yet generated

### 3. View Scene Details

Click any scene card to open the detail modal:
- See full scene text
- View large image
- Browse version history
- Regenerate if needed

### 4. Select Preferred Versions

If a scene has multiple versions:
- Click version thumbnails in the modal
- Selected version gets purple border + checkmark
- Selection saves automatically

### 5. Regenerate Scenes

**Individual Regeneration:**
- Click "Regenerate" button on card
- Or open modal and click "Regenerate" in footer
- New version appears in ~10-20 seconds

**Bulk Regeneration:**
- Check boxes on multiple scenes
- Click "Regenerate Selected"
- All selected scenes regenerate

### 6. Complete Story

When all scenes have images:
1. Click **"Complete Story"** button (bottom right)
2. Enter a story title in the modal
3. Click **"Complete Story"** to finalize
4. See confetti animation! 🎉
5. Auto-navigates to preview/dashboard

## Key Features

### Filtering

Use the filter dropdown to show:
- **All Scenes** - Everything
- **Completed** - Only scenes with images
- **Needs Regeneration** - Pending or failed

### Bulk Selection

- **"Select All"** - Select all visible scenes
- **Checkboxes** - Select individual scenes
- **"Clear"** - Deselect everything
- **Count display** - Shows "X selected"

### Progress Tracking

The progress bar at the top shows:
- Completed scenes / Total scenes
- Visual progress bar
- Green checkmark when all complete

## Common Tasks

### Task: Regenerate a Single Scene

1. Find the scene in the grid
2. Click "Regenerate" button on the card
3. Wait for generation (~10-20 seconds)
4. New version appears and auto-selects

### Task: Compare Multiple Versions

1. Click scene card to open modal
2. Scroll through version thumbnails
3. Click each to preview
4. Select your favorite (purple border)

### Task: Regenerate Multiple Scenes

1. Check boxes on scenes you want to regenerate
2. Click "Regenerate Selected"
3. Watch as they regenerate one by one
4. Selection clears when complete

### Task: Filter Incomplete Scenes

1. Click filter dropdown at top
2. Select "Needs Regeneration"
3. Only incomplete scenes show
4. Generate or regenerate as needed

### Task: Complete the Story

1. Ensure all scenes have green "Ready" badges
2. Click "Complete Story" button
3. Enter a title (required)
4. Confirm completion
5. Celebrate! 🎉

## Keyboard Shortcuts

- **ESC** - Close modal
- **Tab** - Navigate between elements
- **Enter** - Activate focused button
- **Space** - Toggle checkbox

## Status Indicators

| Badge | Meaning | Action |
|-------|---------|--------|
| 🟢 Ready | Scene has image | Can regenerate or select version |
| 🔵 Generating | Creating image | Wait for completion |
| 🔴 Failed | Generation error | Click "Retry" |
| ⚪ No Image | Not generated yet | Click "Generate" or use bulk |

## Tips & Best Practices

### Generation Tips

1. **Use bulk generation first** - Faster than individual
2. **Let it complete** - Don't navigate away during generation
3. **Check failed scenes** - Retry them individually
4. **Be patient** - AI generation takes time

### Version Selection Tips

1. **Generate multiple versions** - Gives you options
2. **Review in modal** - See full size before selecting
3. **Trust your instinct** - Pick what looks best
4. **You can always regenerate** - Not permanent

### Organization Tips

1. **Use filters** - Find incomplete scenes quickly
2. **Work in batches** - Regenerate similar scenes together
3. **Check progress bar** - Know how close you are
4. **Select versions as you go** - Don't wait until the end

### Quality Tips

1. **Review all scenes** - Check for consistency
2. **Regenerate if needed** - Don't settle for poor quality
3. **Check character appearance** - Should match across scenes
4. **Verify locations** - Should match story locations

## Troubleshooting

### All Scenes Stuck in Generating

**Cause**: Polling might have stopped
**Solution**: Refresh the page - status will update

### Generation Failed for Scene

**Cause**: API error or content issue
**Solution**: Click "Retry" button - usually works second time

### Can't Complete Story

**Cause**: Some scenes don't have images
**Solution**: 
1. Use "Needs Regeneration" filter
2. Generate missing scenes
3. Try completing again

### Image Not Loading

**Cause**: Network issue or bad URL
**Solution**: 
1. Wait a moment for retry
2. Regenerate the scene if persists

### Selected Version Not Saving

**Cause**: API error (in mock mode, this is expected)
**Solution**: In production, this will persist automatically

### Modal Won't Close

**Cause**: Focus trap or event issue
**Solution**: 
1. Press ESC key
2. Click backdrop (outside modal)
3. Click X button

## Mock Data Mode

Currently using mock data for development:

**What's Mocked:**
- Scene generation (instant)
- Status polling (simulated progress)
- Version creation (random images)
- Story completion (no real save)

**What Works:**
- All UI interactions
- State management
- Component behavior
- Visual feedback

**To Switch to Real API:**
- Uncomment API calls in page.tsx
- Comment out MOCK sections
- Update API endpoints in config
- Test with real backend

## Development Notes

### File Structure
```
scene-generation/
├── [storyId]/
│   ├── page.tsx                          # Main page component
│   └── scene-generation.page.mock.ts     # Mock data
├── README.md                              # Full documentation
├── FEATURES.md                            # Feature list
└── QUICK_START.md                         # This file
```

### Key Dependencies
- React (hooks: useState, useEffect, useCallback, useRef)
- Next.js (useRouter, navigation)
- Components: Card, Modal, Button, LoadingSpinner
- Types from @/types and @/lib/apiTypes

### State Management
- Local component state (no global store)
- useState for UI state
- useRef for timers and polling
- Optimistic updates for better UX

## Next Steps

After completing scene generation:

1. **Preview Story** - See it in child reading mode
2. **Publish Story** - Make it available to children
3. **Share Story** - Get shareable link
4. **Create Another** - Start a new story
5. **View Analytics** - See how children interact

## Related Pages

- **[Background Setup](../background-setup/)** - Previous step
- **[Character Assignment](../character-assignment/)** - Two steps back
- **[Story Tree](../story-tree/)** - Edit story structure
- **[Story Setup](../story-setup/)** - Create new story

## Support

Need help? Check:
- README.md for detailed documentation
- FEATURES.md for complete feature list
- Component documentation in /components
- Type definitions in /types.ts

## Quick Reference Commands

### View Page Locally
```bash
cd packages/web
npm run dev
# Navigate to http://localhost:3000/scene-generation/test-story-id
```

### Check Types
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

## API Endpoint Summary

```typescript
// Generate all scenes
POST /api/v1/stories/{storyId}/scenes/generate-all-images

// Poll status
GET /api/v1/stories/{storyId}/scenes/generation-status?jobId={jobId}

// Regenerate scene
POST /api/v1/stories/{storyId}/scenes/{sceneId}/regenerate-image

// Regenerate multiple
POST /api/v1/stories/{storyId}/scenes/regenerate-multiple

// Select version
POST /api/v1/stories/{storyId}/scenes/{sceneId}/select-version

// Complete story
POST /api/v1/stories/{storyId}/complete
```

See README.md for full API documentation.

---

**Happy Story Creating! 🎨📚✨**

