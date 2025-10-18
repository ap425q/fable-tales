# Story Setup Feature Documentation

## Overview

The Story Setup feature is the entry point for the parent mode story creation flow. It allows parents to input educational goals and preferences, which are then sent to an AI to generate a branching narrative with 15-20 scenes.

## File Structure

```
packages/web/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Home page with mode selection
│   │   ├── story-setup/
│   │   │   └── page.tsx                      # Story setup form page
│   │   └── story-tree/
│   │       └── [storyId]/
│   │           └── page.tsx                  # Story tree editor (placeholder)
│   ├── components/
│   │   ├── Toast.tsx                         # Toast notification component
│   │   ├── types.ts                          # Updated with ToastVariant enum
│   │   └── index.ts                          # Updated exports
│   └── lib/
│       └── api.ts                            # API client utility
```

## Features Implemented

### 1. **Story Setup Page** (`/story-setup`)

#### Form Fields:
- **Lesson/Moral** (Required)
  - Minimum 5 characters
  - Maximum 200 characters
  - Character counter displayed
  - Example: "Honesty is important", "Be kind to others"

- **Preferred Theme** (Optional)
  - Maximum 150 characters
  - Character counter displayed
  - Example: "Space adventure", "Forest animals"

- **Story Format** (Optional)
  - Maximum 150 characters
  - Character counter displayed
  - Example: "Good triumphs over evil", "Aesop's fable style"

#### Validation:
- Real-time validation with inline error messages
- Form submission prevented if validation fails
- Errors cleared when user starts typing
- Required field indicators

#### User Experience:
- **Welcoming Header**: Explains the story creation process
- **Information Card**: Shows what the story will include (4 characters, 15-20 scenes, etc.)
- **Example Prompts**: Four pre-filled examples users can click to populate the form
  - Honesty Story (Magical forest, Aesop's fable)
  - Sharing Story (Space station, Sci-fi)
  - Courage Story (Medieval kingdom, Hero's journey)
  - Friendship Story (School setting, Realistic)
- **Helpful Tooltips**: Guidance text under each input field

#### Loading State:
- Full-screen overlay during API call
- Large animated spinner
- Encouraging message: "Creating your magical story..."
- Estimated time display (~30 seconds)
- Prevents form interaction during generation

#### Error Handling:
- User-friendly error messages
- Retry capability on failure
- Network error detection
- Validation error display
- API error messages shown in prominent alert box

#### Success Behavior:
- Automatic navigation to Story Tree Editing page
- Story ID passed via URL parameter (`/story-tree/{storyId}`)
- Form state preserved during generation

### 2. **API Client** (`/lib/api.ts`)

A comprehensive API client utility built with axios:

#### Features:
- Centralized API configuration
- Request/response interceptors
- Error handling and transformation
- TypeScript type safety
- Standardized error format

#### API Methods:

**Stories:**
- `api.stories.generate()` - Generate new story
- `api.stories.getById()` - Get story details
- `api.stories.getAll()` - List all stories
- `api.stories.updateNode()` - Update story node
- `api.stories.addNode()` - Add new node
- `api.stories.deleteNode()` - Delete node
- `api.stories.finalizeStructure()` - Finalize story structure

**Characters:**
- `api.characters.getAll()` - Get preset characters
- `api.characters.saveAssignments()` - Save character assignments
- `api.characters.getAssignments()` - Get character assignments

**Backgrounds:**
- `api.backgrounds.getAll()` - Get backgrounds for story
- `api.backgrounds.update()` - Update background description
- `api.backgrounds.generateAll()` - Generate all backgrounds
- `api.backgrounds.getGenerationStatus()` - Check generation status
- `api.backgrounds.regenerate()` - Regenerate individual background
- `api.backgrounds.selectVersion()` - Select background version

**Scenes:**
- `api.scenes.generateAll()` - Generate all scene images
- `api.scenes.getGenerationStatus()` - Check generation status
- `api.scenes.getVersions()` - Get scene image versions
- `api.scenes.regenerate()` - Regenerate scene image
- `api.scenes.selectVersion()` - Select scene image version
- `api.scenes.regenerateMultiple()` - Bulk regenerate scenes

**Other:**
- `api.completeStory()` - Complete story

### 3. **Toast Notification Component** (`/components/Toast.tsx`)

A reusable toast notification component:

#### Features:
- Four variants: Success, Error, Info, Warning
- Auto-dismiss with configurable duration
- Manual dismissal option
- Smooth animations
- Accessible (ARIA attributes)
- Responsive design

#### Usage:
```tsx
import { Toast, ToastVariant } from "@/components"

<Toast
  message="Story created successfully!"
  variant={ToastVariant.Success}
  duration={3000}
  isVisible={showToast}
  onDismiss={() => setShowToast(false)}
/>
```

### 4. **Updated Home Page** (`/page.tsx`)

#### Features:
- Beautiful gradient background
- Two mode cards: Parent Mode and Child Mode
- Parent Mode linked to `/story-setup`
- Child Mode shows "Coming Soon"
- Features section highlighting key benefits
- Responsive design for mobile and desktop

## API Integration

### Request Format

```typescript
POST /api/v1/stories/generate
Content-Type: application/json

{
  "lesson": "Honesty is always the best policy",
  "theme": "Magical forest with talking animals",
  "storyFormat": "Aesop's fable style with clear moral",
  "characterCount": 4
}
```

### Response Format

```typescript
{
  "success": true,
  "data": {
    "storyId": "story_456",
    "tree": {
      "nodes": [...],
      "edges": [...]
    },
    "characters": [...],
    "locations": [...]
  }
}
```

### Error Format

```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input. Please check your entries and try again.",
    "details": { ... }
  }
}
```

## Configuration

### Environment Variables

Set in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Default value: `http://localhost:3001/api`

## Responsive Design

The story setup page is fully responsive:

- **Mobile** (< 640px): Single column layout, stacked cards
- **Tablet** (640px - 1024px): Optimized spacing and typography
- **Desktop** (> 1024px): Maximum width container with ample whitespace

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus states for all interactive elements
- Screen reader friendly error messages
- Color contrast compliance

## Form Validation Rules

| Field | Required | Min Length | Max Length | Validation |
|-------|----------|------------|------------|------------|
| Lesson | Yes | 5 chars | 200 chars | Non-empty, trimmed |
| Theme | No | - | 150 chars | - |
| Story Format | No | - | 150 chars | - |

## User Flow

```
1. User lands on home page (/)
   ↓
2. User clicks "Parent Mode" card
   ↓
3. Navigate to /story-setup
   ↓
4. User fills in lesson (required)
   ↓
5. User optionally fills in theme and format
   ↓
6. User clicks "Generate Story" or selects example
   ↓
7. Form validates inputs
   ↓
8. Loading overlay appears
   ↓
9. API call to POST /api/v1/stories/generate
   ↓
10. On success: Navigate to /story-tree/{storyId}
    On error: Show error message, allow retry
```

## Future Enhancements

- [ ] Auto-save form data to localStorage
- [ ] Story template selection
- [ ] Advanced options (scene count, complexity level)
- [ ] Preview of similar existing stories
- [ ] Image upload for custom characters
- [ ] Multi-language support
- [ ] Voice input for lesson
- [ ] Story difficulty slider
- [ ] Age range selection

## Testing Recommendations

### Manual Testing Checklist

- [ ] Form validation works for all fields
- [ ] Character counters update correctly
- [ ] Example buttons populate form
- [ ] Loading state appears during API call
- [ ] Error messages display properly
- [ ] Success navigation works
- [ ] Mobile responsive design
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### Test Cases

1. **Valid Submission**
   - Input: All fields with valid data
   - Expected: API call succeeds, navigate to story tree

2. **Minimum Lesson Length**
   - Input: Lesson with 4 characters
   - Expected: Validation error

3. **Empty Required Field**
   - Input: Empty lesson field
   - Expected: Validation error on submit

4. **Character Limit Exceeded**
   - Input: Lesson with 201 characters
   - Expected: Validation error

5. **API Error**
   - Simulate network error
   - Expected: User-friendly error message, retry option

6. **Example Button Click**
   - Click example button
   - Expected: Form populated with example data

## Dependencies

- **axios** (^1.6.0): HTTP client for API requests
- **next** (15.5.6): React framework
- **react** (19.1.0): UI library
- **tailwindcss** (^4): Styling framework

## Component API

### StorySetupPage

No props - it's a page component.

### Toast

```typescript
interface ToastProps {
  message: string
  variant?: ToastVariant
  duration?: number
  isVisible: boolean
  onDismiss: () => void
}
```

## Styling

Uses Tailwind CSS for all styling:

- Gradient background: `bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50`
- Cards: `bg-white rounded-xl shadow-xl`
- Primary button: Blue theme (`bg-blue-600`)
- Focus states: Ring with offset
- Hover effects: Shadow and scale transitions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)

## Performance

- Form state managed with React useState
- No unnecessary re-renders
- Optimized images with Next.js Image component
- Code splitting with Next.js automatic optimization
- Lazy loading for components

## Security

- Input sanitization (trimmed values)
- XSS protection via React
- CSRF protection via API
- Secure API communication
- No sensitive data in URLs

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `NEXT_PUBLIC_API_BASE_URL` environment variable
   - Ensure backend server is running
   - Check CORS configuration

2. **Form Not Submitting**
   - Check validation errors
   - Verify lesson field is not empty
   - Check browser console for errors

3. **Loading State Stuck**
   - Check API timeout settings
   - Verify API response format
   - Check network tab in DevTools

## Contact & Support

For issues or questions about this feature, please refer to the main project README or open an issue in the repository.

