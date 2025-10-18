# Story Selection Page (Child Mode)

A visual library page for children to browse and select completed stories to read. This is the child mode's home page after role selection.

## 📁 Files

- `page.tsx` - Main page component with story grid and interactions
- `StorySelection.page.mock.ts` - Mock data for development and testing
- `README.md` - This documentation file

## 🎯 Features

### Page Header
- **Cheerful Title**: "Choose Your Adventure! 🚀" with gradient text
- **Mascot Element**: Rocket emoji for visual appeal
- **Back Button**: Navigate back to role selection/home page
- **Subtitle**: Encouraging message for children

### Story Grid
- **Responsive Layout**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- **Story Cards**: Each card displays:
  - Large cover image (lazy-loaded)
  - Story title (bold, large font)
  - Lesson/theme badge (color-coded)
  - Scene count and read count
  - "Read Story" button (large, colorful)
- **Interactions**:
  - Hover effect: Cards lift and scale slightly
  - Click anywhere on card to start reading
  - Smooth transitions

### Filtering & Sorting
- **Sort Options**:
  - Recently Added (newest first)
  - Most Popular (by read count)
  - Alphabetical (A to Z)
- **Result Count**: Shows number of available stories
- **Easy-to-use Dropdown**: Large, colorful select input

### Empty State
- Shows when no stories are available
- Friendly message: "No stories yet! Ask a parent to create one!"
- Large emoji illustration (📚)
- Centered, child-friendly design

### Pagination
- **Load More Button**: Loads additional stories
- Loading indicator during fetch
- Shows only when more stories are available
- Disabled state while loading

### Theme Colors
Theme badges are color-coded for visual interest:
- **Honesty**: Blue
- **Courage**: Red
- **Friendship**: Pink
- **Kindness**: Green
- **Sharing**: Purple
- **Teamwork**: Yellow
- **Gratitude**: Orange
- **Perseverance**: Indigo
- **Respect**: Teal
- **Responsibility**: Cyan

## 🎨 Design Principles

### Child-Friendly
- **Large Text**: Easy to read for children
- **Big Buttons**: Easy to click/tap
- **Colorful**: Engaging gradient backgrounds and colored badges
- **Clear Layout**: Simple, intuitive navigation
- **Visual Feedback**: Hover effects and transitions

### Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Alt Text**: All images have descriptive alt text
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Clear focus indicators
- **Semantic HTML**: Proper heading hierarchy

### Responsive
- Mobile-first design
- Flexible grid that adapts to screen size
- Touch-friendly button sizes
- Readable text on all devices

## 🔌 API Integration

### Endpoints Used
- `GET /api/v1/stories` - Fetch stories list
  - Query params:
    - `limit`: Number of stories per page (default: 12)
    - `offset`: Starting index for pagination
    - `status`: Filter by status (use "completed")

### Mock Data Toggle
The page includes a `useMockData` toggle for development:
```typescript
const [useMockData] = useState(true) // Toggle for development
```

Set to `false` to use real API data.

## 📊 Mock Data

The mock data file includes:
- **10 Sample Stories**: Variety of themes, formats, and read counts
- **Cover Images**: Using existing background images
- **Empty State Content**: Title, message, and icon

## 🎮 User Flow

1. **Page Load**: Stories fetch and display in grid
2. **Browse**: Child scrolls through colorful story cards
3. **Sort** (Optional): Child or parent changes sort order
4. **Select Story**: Click on any card
5. **Navigate**: Redirects to `/story-reading?storyId={id}`

## 🚀 Usage

### Navigation to Page
```typescript
// From parent component
router.push('/story-selection')
```

### Reading a Story
When a child clicks a story, they're redirected to:
```
/story-reading?storyId={storyId}
```

## 🎯 State Management

### Local State
- `stories`: Array of Story objects
- `isLoading`: Initial loading state
- `isLoadingMore`: Loading more stories
- `sortBy`: Current sort option
- `hasMore`: Whether more stories are available
- `offset`: Current pagination offset
- `error`: Error message if any

### Loading States
- Initial load: Shows loading spinner
- Load more: Shows loading text in button
- Error: Shows error toast notification

## 🎨 Styling

### Color Scheme
- **Background**: Purple → Pink → Blue gradient
- **Header**: White with shadow
- **Cards**: White with shadow, lift on hover
- **Buttons**: Primary (purple/blue) and Secondary (gray)
- **Badges**: Theme-specific colors

### Typography
- **Title**: 4xl/5xl, bold, gradient text
- **Story Title**: 2xl, bold
- **Body Text**: lg, readable
- **Badges**: sm, semibold

## 🧪 Testing

### Manual Testing
1. Check page loads with stories
2. Verify sort changes work correctly
3. Test load more functionality
4. Verify empty state shows when no stories
5. Test story navigation
6. Check responsive design on different screens
7. Verify accessibility with keyboard navigation

### Mock Data Testing
Use the mock data toggle to test without backend:
```typescript
const [useMockData] = useState(true)
```

## 🔄 Future Enhancements

### Possible Additions
1. **Filter by Theme**: Dropdown to filter stories by lesson/theme
2. **Search**: Text input to search story titles
3. **Story Preview Modal**: Hover/click info icon to see full details
4. **Favorites**: Allow children to mark favorite stories
5. **Reading Progress**: Show progress indicator on started stories
6. **Animations**: Add entrance animations for cards
7. **Sound Effects**: Add audio feedback on interactions
8. **Achievements**: Show badges for reading milestones
9. **Recommendations**: "Stories you might like" section
10. **Infinite Scroll**: Auto-load on scroll instead of button

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

## 🐛 Known Issues

None at this time.

## 📝 Notes

- Images are lazy-loaded for performance
- Cover images fallback to scene 1 image if no custom cover
- Stories must have `status: "completed"` and `isPublished: true`
- Sort happens client-side for mock data, server-side for API
- Pagination offset resets when sort changes

