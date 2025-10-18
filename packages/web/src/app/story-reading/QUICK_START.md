# Story Reading Page - Quick Start Guide

## Getting Started

### 1. Navigate to the Page

The Story Reading Page is accessible via the dynamic route:

```
/story-reading/[storyId]
```

**Example URLs:**
```
http://localhost:3000/story-reading/story-123
http://localhost:3000/story-reading/e9780360-5bdc-4c10-92a7-0a303cd7eae1
```

### 2. Development Mode (Mock Data)

In development, the page automatically uses mock data, so you don't need a running backend:

```bash
cd packages/web
npm run dev
```

Then navigate to:
```
http://localhost:3000/story-reading/story-123
```

### 3. Production Mode (Real API)

For production, ensure your backend is running:

```bash
cd packages/server
python main.py
```

The page will automatically connect to the API endpoints.

## Testing the Page

### Test Scenario 1: Complete Story with Good Ending

1. Navigate to `/story-reading/story-123`
2. Click "Continue" on the start scene
3. At each choice, select the first option (blue button)
4. Continue until you reach the good ending
5. Verify celebration modal appears with confetti
6. Test "Read Again" and "Choose Another Story" buttons

**Expected Path (Good Ending):**
```
Start → Into the Forest → Take safer path → Meet turtle → 
Go to stream → Accept Bruno's help → Good Ending 🎉
```

### Test Scenario 2: Hit Bad Ending and Retry

1. Navigate to `/story-reading/story-123`
2. Click through to scene 2
3. Select "Take the short path through thorns" (first choice)
4. **Verify**:
   - Bad ending modal appears
   - Encouraging message shows
   - Lesson message displays
   - "Try Again" button is visible
5. Click "Try Again"
6. **Verify**:
   - Returns to choice scene (scene 2)
   - Can make different choice
7. Select correct path and continue

**Bad Ending Path 1:**
```
Start → Into the Forest → Take thorny path → Bad Ending 😔
```

### Test Scenario 3: Navigation and Back Button

1. Start story
2. Progress through 3-4 scenes
3. Click the back button (↶) in top nav
4. **Verify**:
   - Returns to previous scene
   - Previous choices are removed from history
   - Can make different choices
5. Navigate forward again
6. Verify progress bar updates correctly

### Test Scenario 4: Font Size Controls

1. Start story
2. Click "A+" button multiple times
3. **Verify**: Text gets larger (max 32px)
4. Click "A-" button multiple times
5. **Verify**: Text gets smaller (min 16px)
6. Verify font size persists across scenes

### Test Scenario 5: Progress Saving (Auto-save)

1. Start story and progress to scene 3
2. Wait 2 seconds (auto-save delay)
3. Check console for "Progress saved (mock):" message
4. Refresh the page
5. **Verify**: Returns to scene 3 (not start)

### Test Scenario 6: Exit and Return

1. Start story
2. Progress to scene 4
3. Click "Exit" button
4. Navigate back to `/story-reading/story-123`
5. **Verify**: Resumes at scene 4 with saved progress

### Test Scenario 7: Image Loading

1. Start story
2. **Verify**: Loading spinner appears while image loads
3. **Verify**: Image displays smoothly once loaded
4. Navigate to next scene
5. **Verify**: Smooth transition (image should be preloaded)

### Test Scenario 8: Responsive Design

1. Open story on desktop (>1024px)
2. **Verify**: Side-by-side layout (image left, text right)
3. Resize browser to tablet (<1024px)
4. **Verify**: Stacked layout (image top, text bottom)
5. Test on mobile device
6. **Verify**: Touch-friendly button sizes

### Test Scenario 9: Keyboard Navigation

1. Navigate to story page
2. Use **Tab** key to navigate between buttons
3. **Verify**: Focus visible on all interactive elements
4. Use **Enter** to activate buttons
5. **Verify**: Choices can be selected via keyboard

### Test Scenario 10: Error Handling

**Test 10a: Invalid Story ID**
```
http://localhost:3000/story-reading/invalid-id-12345
```
**Verify**: Error state displays with "Go Back Home" button

**Test 10b: Missing Image**
1. Modify mock data to use invalid imageUrl
2. Navigate to story
3. **Verify**: Graceful handling, no crash

## Mock Data Structure

The mock data in `page.mock.ts` includes:

### Story Structure
- **10 nodes total**
- **1 start node**: "A New Adventure Begins"
- **3 choice nodes**: Decision points with 2-3 options
- **2 normal nodes**: Linear narrative sections
- **3 bad endings**: Each with lesson message and previousNodeId
- **1 good ending**: With celebration and lesson

### All Possible Paths

**Good Ending Path:**
```
node-1 → node-2 → node-3 → node-4 → node-5 → node-6 → node-7 ✅
```

**Bad Ending Paths:**
```
node-1 → node-2 → node-3-bad ❌
node-1 → node-2 → node-3 → node-4 → node-5-bad ❌
node-1 → node-2 → node-3 → node-4 → node-5 → node-6 → node-7-bad ❌
```

## Common Issues & Solutions

### Issue 1: "Failed to load story"
**Solution**: 
- Check if backend is running (if not in dev mode)
- Verify story ID exists in database
- Check browser console for detailed error

### Issue 2: Images not loading
**Solution**:
- In dev mode, placeholder images may not work
- Replace with actual image URLs or local images
- Check imageUrl format in mock data

### Issue 3: Progress not saving
**Solution**:
- Wait 2+ seconds for debounce
- Check console for save messages
- Verify API endpoint is accessible (production mode)

### Issue 4: Back button not working
**Solution**:
- Ensure visitedNodes array has items
- Check if currentNode has valid previousNodeId (for bad endings)
- Verify node IDs exist in story data

### Issue 5: Celebration not showing
**Solution**:
- Ensure node type is exactly `NodeType.GOOD_ENDING`
- Check if showCelebration state is being set
- Verify modal z-index is high enough

## Customization

### Change Colors

Edit the choice button colors in `page.tsx`:

```typescript
const colors = [
  "bg-blue-500 hover:bg-blue-600",    // Change to your color
  "bg-green-500 hover:bg-green-600",  // Change to your color
  "bg-yellow-500 hover:bg-yellow-600", // Change to your color
]
```

### Change Emojis

Edit the emoji array:

```typescript
const emojis = ["💙", "💚", "💛"]  // Add your emojis
```

### Adjust Animation Timing

Edit the style block at the bottom of `page.tsx`:

```css
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);  /* Adjust distance */
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Change Auto-save Delay

Edit the timeout in `page.tsx`:

```typescript
autoSaveTimerRef.current = setTimeout(() => {
  saveProgress()
}, 2000)  // Change to desired delay (milliseconds)
```

### Adjust Font Size Range

Edit the font size controls:

```typescript
fontSize: Math.max(16, Math.min(32, prev.fontSize + delta))
//                  ^min        ^max
```

## API Endpoints Reference

### Get Story for Reading
```
GET /api/v1/stories/{storyId}/read
Response: StoryForReading
```

### Get Reading Progress
```
GET /api/v1/stories/{storyId}/reading-progress
Response: ReadingProgress
```

### Save Reading Progress
```
POST /api/v1/stories/{storyId}/reading-progress
Body: ReadingProgressRequest
Response: ReadingProgress
```

### Record Completion
```
POST /api/v1/stories/{storyId}/reading-complete
Body: ReadingCompletionRequest
Response: ReadingCompletionResponse
```

## Development Tips

### 1. Use React DevTools
Install React DevTools browser extension to inspect:
- Component state
- Props
- Performance

### 2. Check Console Logs
The page logs important events:
```
Progress saved (mock): {...}
Playing sound: click
Story completed (mock): node-7
```

### 3. Test Edge Cases
- Empty choices array
- Missing image URLs
- Invalid node IDs
- Network failures
- Slow image loading

### 4. Monitor Performance
- Check animation smoothness
- Verify image preloading works
- Monitor memory usage during long sessions
- Test on slower devices

### 5. Accessibility Testing
- Use screen reader (VoiceOver, NVDA)
- Navigate with keyboard only
- Check color contrast ratios
- Verify focus indicators

## Next Steps

After testing the Story Reading Page:

1. ✅ Verify all features work as expected
2. ✅ Test on multiple devices and browsers
3. ✅ Gather user feedback (especially from children)
4. 📝 Document any bugs or improvements
5. 🎨 Consider adding text-to-speech
6. 🎵 Add actual sound effects and music
7. 📊 Add reading statistics and analytics
8. 🏆 Implement achievement badges
9. 📄 Create printable certificates
10. 🔗 Add social sharing features

## Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the VISUAL_GUIDE.md for layout reference
- Examine the mock data in page.mock.ts
- Check browser console for errors
- Review backend API logs (production mode)

