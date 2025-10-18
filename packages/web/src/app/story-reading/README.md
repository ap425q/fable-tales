# Story Reading Page (Child Mode)

## Overview

The Story Reading Page provides an engaging, interactive reading experience for children. It displays stories in a beautiful book-like format with images, text, and branching choices that lead through the narrative.

## Location

- **Route**: `/story-reading/[storyId]`
- **Component**: `packages/web/src/app/story-reading/[storyId]/page.tsx`
- **Mock Data**: `packages/web/src/app/story-reading/[storyId]/page.mock.ts`

## Features Implemented

### ✅ Book Layout (Full Screen)

- **Left Side (45%)**: Large scene image that fills the area with smooth transitions
- **Right Side (55%)**: 
  - Top: Story text with large, readable font (adjustable 16-32px)
  - Bottom: Choice buttons with vibrant colors and emojis

### ✅ Navigation & Progress

- **Top Navigation Bar** with:
  - Exit button (returns to story list)
  - Story title
  - Scene progress indicator (e.g., "Scene 5 / 18")
  - Visual progress bar with gradient
  - Back button to return to previous scene
  - Font size controls (A- and A+)

### ✅ Choice Interaction

- **Single Choice**: Large "Continue" button with pulse animation
- **Multiple Choices**: 
  - 2-3 colorful buttons (blue, green, yellow)
  - Fun emojis for each choice (💙, 💚, 💛)
  - Hover effects with scale transformation
  - Clear, simple choice text

### ✅ Bad Ending Handling

- Gentle modal overlay (not scary)
- Encouraging message: "Hmm, maybe there's a better way?"
- Shows lesson hint from `lessonMessage` field
- Large "Try Again" button with refresh emoji
- Automatically returns to previous choice scene
- Smooth back navigation with removed choices from history

### ✅ Good Ending Celebration

- Full-screen celebration modal with gradient background
- Animated confetti (🎉, ⭐, 💖, 🌟, ✨) floating across screen
- Congratulatory message
- Lesson highlight in beautiful card
- Options:
  - "Read Again" button (restarts story)
  - "Choose Another Story" button (returns to home)

### ✅ Reading Assistance Features

- **Font Size Controls**: Adjustable from 16px to 32px via A-/A+ buttons
- **Image Preloading**: Preloads next scene images for smooth transitions
- **Loading States**: Beautiful loading spinners for story and images
- **Responsive Design**: Works on tablets and desktops
- **Keyboard Support**: All buttons are keyboard accessible

### ✅ Progress Saving

- **Auto-save**: Debounced auto-save after 2 seconds of inactivity
- **Save on Exit**: Automatically saves progress when leaving page
- **Resume Reading**: Loads saved progress on return
- Tracks:
  - Current node ID
  - Visited node IDs
  - Choices made with timestamps

### ✅ Smooth Animations

- **Scene Transitions**: Slide-in animations (forward/backward)
- **Choice Buttons**: Hover effects with scale and shadow
- **Bad Ending Modal**: Scale-in animation
- **Good Ending**: Bounce animation and floating confetti
- **Progress Bar**: Smooth width transitions

## API Integration

### Endpoints Used

1. **GET `/api/v1/stories/{storyId}/read`**
   - Loads complete story data formatted for reading
   - Returns: `StoryForReading` with nodes and startNodeId

2. **GET `/api/v1/stories/{storyId}/reading-progress`**
   - Loads saved reading progress
   - Returns: `ReadingProgress` with currentNodeId, visitedNodeIds, choicesMade

3. **POST `/api/v1/stories/{storyId}/reading-progress`**
   - Saves current reading progress
   - Body: `ReadingProgressRequest`

4. **POST `/api/v1/stories/{storyId}/reading-complete`**
   - Records story completion
   - Body: `ReadingCompletionRequest` with endingNodeId

## Data Structures

### StoryForReading
```typescript
interface StoryForReading {
  id: string
  title: string
  lesson: string
  nodes: ReadingNode[]
  startNodeId: string
}
```

### ReadingNode
```typescript
interface ReadingNode {
  id: string
  sceneNumber: number
  title: string
  text: string
  imageUrl: string
  type: NodeType  // START, NORMAL, CHOICE, GOOD_ENDING, BAD_ENDING
  choices: ChoiceData[]
  lessonMessage?: string      // For endings
  previousNodeId?: string     // For bad endings
}
```

### ReadingProgress
```typescript
interface ReadingProgress {
  storyId: string
  currentNodeId: string
  visitedNodeIds: string[]
  choicesMade: ChoiceMade[]
  lastReadAt: string
}
```

## Mock Data

The implementation includes comprehensive mock data in `page.mock.ts`:

- **mockStoryReadData**: Complete story with 10 nodes including:
  - 1 START node
  - 3 CHOICE nodes with branching paths
  - 2 NORMAL nodes
  - 3 BAD_ENDING nodes with lessons
  - 1 GOOD_ENDING node with celebration
  
- **mockReadingProgress**: Sample progress at scene 4

- **mockCompletionData**: Sample completion response

## Usage

### Development Mode

The page automatically uses mock data when `NODE_ENV === "development"`:

```typescript
const useMockData = process.env.NODE_ENV === "development"
```

This allows for testing without a running backend.

### Production Mode

In production, the page connects to the real API endpoints and handles:
- Loading states with spinners
- Error states with friendly messages
- Network errors with retry options

## Child-Friendly Design

### Visual Design
- Vibrant gradient backgrounds (purple, pink, blue)
- Large, colorful buttons (min 60px height)
- High contrast text for readability
- Generous spacing and padding
- Rounded corners everywhere (border-radius: 1.5rem+)

### Typography
- Large base font size (20px, adjustable)
- High line height (1.8) for easy reading
- Bold, clear headings
- Readable sans-serif font

### Colors
- **Blue buttons**: Primary choices
- **Green buttons**: Positive actions
- **Yellow buttons**: Alternative choices
- **Purple/Pink gradients**: Magical, story-like feel

### Emojis & Icons
- Happy emojis for celebrations (🎉, 🎊, ⭐)
- Thoughtful emoji for bad endings (💭)
- Sad emoji for mistakes (😔)
- Heart emojis for choices (💙, 💚, 💛)

## Accessibility

- All buttons have `aria-label` attributes
- Loading states have `aria-busy` attribute
- Keyboard navigation supported
- High contrast for readability
- Focus states on all interactive elements

## Performance Optimizations

1. **Image Preloading**: Next scene images loaded in advance
2. **Debounced Auto-save**: Prevents excessive API calls
3. **Conditional Rendering**: Only renders active modals
4. **Optimized State Updates**: Minimal re-renders
5. **CSS Animations**: Hardware-accelerated transforms

## Future Enhancements

Potential additions for future iterations:

- [ ] Text-to-speech functionality
- [ ] Background music toggle
- [ ] Sound effects for interactions
- [ ] Reading timer and statistics
- [ ] Achievement badges
- [ ] Certificate of completion (printable)
- [ ] Social sharing features
- [ ] Bookmark specific scenes
- [ ] Custom themes/backgrounds

## Testing

To test the Story Reading Page:

1. **Navigate to a story**:
   ```
   http://localhost:3000/story-reading/story-123
   ```

2. **Test scenarios**:
   - Complete story with good ending
   - Hit a bad ending and try again
   - Use back button navigation
   - Adjust font size
   - Test on different screen sizes
   - Test keyboard navigation

3. **Mock data testing**:
   - The page uses mock data in development
   - No backend required for initial testing

## Dependencies

- **React**: Core framework
- **Next.js**: Routing and SSR
- **Tailwind CSS**: Styling
- **Custom Components**: Button, LoadingSpinner from `/components`
- **API Client**: Centralized API communication

## Browser Support

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Mobile Chrome (Android 8+)

## Notes

- Images are loaded from `/api/placeholder/` in mock mode
- Real images should be served from backend storage
- Auto-save works offline with localStorage fallback (not yet implemented)
- Sound effects are placeholders (console.log) - actual audio needs implementation

