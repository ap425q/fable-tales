# Background Setup - Quick Start Guide

## Getting Started

The Background Setup page is accessible at `/background-setup/[storyId]` after completing character assignment.

## Basic Usage

### 1. Review Locations

When you first load the page, you'll see all locations from your story:
- Location name (extracted from story, read-only)
- Scene numbers where used (hover to see scene content)
- Description field (editable)
- Current image (if generated)

### 2. Edit Descriptions (Optional)

Improve AI generation by editing descriptions:
```
Good: "A magical forest with tall ancient trees, glowing mushrooms, and sparkling fireflies"
Better: "An enchanted forest at twilight with massive oak trees, bioluminescent mushrooms casting blue light, and golden fireflies dancing between branches"
```

**Tips:**
- Be specific about colors, lighting, and mood
- Include important visual details
- Keep descriptions under 300 characters
- Changes auto-save after 1 second

### 3. Generate Backgrounds

**Option A: Generate All** (Recommended)
```typescript
Click "Generate All Backgrounds" button
→ System generates all backgrounds at once
→ Watch progress in overlay (X / Y completed)
→ Takes 1-2 minutes per background
```

**Option B: Generate Individually**
```typescript
Click "Generate Background" on specific cards
→ Only that background generates
→ Use for testing or fixing specific backgrounds
```

### 4. Review & Regenerate

If you're not satisfied with a background:
1. Click "Regenerate" button on the background card
2. Wait for new version to generate (30-60 seconds)
3. New version appears in version history
4. Automatically selected as current version

### 5. Select Version (Optional)

If you want to use a previous version:
1. Scroll through version history thumbnails
2. Click on preferred version
3. Selected version is highlighted with blue border
4. Main image updates to show selected version

### 6. Continue to Scene Generation

Once all backgrounds show "Ready":
1. Green checkmark appears in progress indicator
2. "Next" button becomes enabled
3. Click "Next: Generate Scene Images →"

## Common Workflows

### Workflow 1: Quick Generation
```
1. Load page
2. Click "Generate All Backgrounds"
3. Wait for completion
4. Click "Next"
```
**Time: 5-10 minutes**

### Workflow 2: Custom Descriptions
```
1. Load page
2. Edit all descriptions for better results
3. Wait for auto-save (1 second)
4. Click "Generate All Backgrounds"
5. Review results
6. Regenerate any unsatisfactory backgrounds
7. Click "Next"
```
**Time: 10-20 minutes**

### Workflow 3: Selective Generation
```
1. Load page
2. Generate one background as test
3. Review result
4. Adjust description if needed
5. Generate remaining backgrounds
6. Click "Next"
```
**Time: 10-15 minutes**

## Status Indicators

| Status | What It Means | What To Do |
|--------|--------------|------------|
| ❌ Pending | Not generated yet | Add description and click Generate |
| 🔄 Generating | Currently creating image | Wait (30-60 seconds) |
| ✅ Completed | Image ready | Review and optionally regenerate |
| ⚠️ Failed | Generation error | Check description and try again |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between inputs |
| `Enter` | Submit focused input |
| `Esc` | Close overlay (if open) |

## Troubleshooting

### Problem: Generate button is disabled
**Solution:** Make sure the background has a description. Add text to the description field.

### Problem: Generation stuck at "Generating..."
**Solution:** 
1. Wait 2-3 minutes (some generations take longer)
2. If still stuck, refresh the page
3. Progress is saved - you won't lose completed backgrounds

### Problem: Generated image doesn't match description
**Solution:**
1. Click "Regenerate" to try again
2. Make description more specific
3. Try different wording
4. AI generates variations each time

### Problem: Can't proceed to next step
**Solution:**
1. Check that ALL backgrounds show as "Completed"
2. Verify each has at least one image
3. Look for any error messages
4. Try regenerating failed backgrounds

### Problem: Changes not saving
**Solution:**
1. Wait 1 second after typing (auto-save delay)
2. Check internet connection
3. Look for error messages
4. Try editing again

## Best Practices

### Description Writing
✅ **Do:**
- Be specific and descriptive
- Include colors, lighting, mood
- Mention key visual elements
- Keep it concise (under 300 chars)

❌ **Don't:**
- Use vague terms like "nice" or "pretty"
- Include character descriptions
- Add irrelevant details
- Write extremely long descriptions

### Generation Strategy
✅ **Do:**
- Generate all at once for efficiency
- Review descriptions before generating
- Use regenerate for improvements
- Keep multiple versions for options

❌ **Don't:**
- Generate repeatedly without changing description
- Delete all versions (keep at least one)
- Skip locations (all must be generated)
- Leave descriptions empty

### Version Management
✅ **Do:**
- Review all versions before selecting
- Keep multiple versions as backups
- Select version that best matches story mood
- Compare versions side-by-side

❌ **Don't:**
- Select first version without review
- Regenerate endlessly (2-3 versions usually enough)
- Ignore version timestamps
- Forget to select preferred version

## Performance Tips

1. **Batch Operations**: Generate all backgrounds at once rather than individually
2. **Description Quality**: Better descriptions = fewer regenerations needed
3. **Network**: Stable internet connection speeds up generation
4. **Browser**: Use modern browsers (Chrome, Firefox, Safari, Edge)
5. **Multitasking**: While backgrounds generate, you can edit descriptions

## Integration with Other Pages

### From Character Assignment
- Characters are already assigned
- Story structure is finalized
- Locations are extracted from scenes
- No character data needed on this page

### To Scene Generation
- All backgrounds must be complete
- Selected versions are used for scenes
- Scene images will composite characters onto these backgrounds
- Can return to this page later if needed

## API Status (for Developers)

Currently using **mock data** for development:
- All API calls are simulated
- Delays match expected production behavior
- Polling mechanism is functional
- Auto-save is implemented

To integrate with real API:
1. Remove mock imports from page.tsx
2. Uncomment API call sections
3. Update API endpoints if needed
4. Test with real backend

## Need Help?

- **Documentation**: See [README.md](./README.md) for technical details
- **Related Pages**: [Character Assignment](../character-assignment/README.md)
- **Story Setup**: [Story Tree Editor](../story-tree/README.md)

