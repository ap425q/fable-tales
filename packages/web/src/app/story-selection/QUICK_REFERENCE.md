# Story Selection Page - Quick Reference

## 🚀 Quick Start

### Navigate to Page
```typescript
router.push('/story-selection')
```

### Mock Data Toggle
```typescript
// In page.tsx, line ~30
const [useMockData] = useState(true) // Set to false for API
```

## 📋 Key Components

| Component | Purpose |
|-----------|---------|
| `page.tsx` | Main page component |
| `StorySelection.page.mock.ts` | Mock data |
| `README.md` | Full documentation |
| `VISUAL_GUIDE.md` | Visual layout guide |

## 🎯 Main Features

- ✅ Story grid (responsive: 1/2/3 columns)
- ✅ Sort by: Recent, Popular, A-Z
- ✅ Load more pagination
- ✅ Empty state
- ✅ Loading states
- ✅ Error handling
- ✅ Child-friendly design
- ✅ Hover effects
- ✅ Theme badges

## 🎨 Design Tokens

### Colors
```typescript
Background: gradient-to-b from-purple-100 via-pink-100 to-blue-100
Header: bg-white
Card: bg-white hover:shadow-xl hover:-translate-y-1
```

### Spacing
```typescript
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Grid Gap: gap-6
Card Padding: p-5
```

### Typography
```typescript
Page Title: text-4xl sm:text-5xl font-bold
Card Title: text-2xl font-bold
Body: text-lg
Badge: text-sm font-semibold
```

## 🔌 API Integration

### Endpoint
```typescript
GET /api/v1/stories
Query: { limit: 12, offset: 0, status: "completed" }
```

### Response Type
```typescript
interface StoriesListResponse {
  stories: Story[]
  total: number
  hasMore: boolean
}
```

## 🎮 User Interactions

| Action | Result |
|--------|--------|
| Click story card | Navigate to `/story-reading?storyId={id}` |
| Click "Read Story" | Navigate to reading page |
| Click "Back" | Navigate to home `/` |
| Change sort | Reload stories with new sort |
| Click "Load More" | Fetch next page |

## 📊 State Variables

```typescript
stories: Story[]              // List of stories
isLoading: boolean           // Initial load state
isLoadingMore: boolean       // Loading more state
sortBy: SortOption          // Current sort
hasMore: boolean            // More stories available
offset: number              // Pagination offset
error: string | null        // Error message
```

## 🎨 Theme Badge Colors

```typescript
const colors = {
  Honesty: "bg-blue-500",
  Courage: "bg-red-500",
  Friendship: "bg-pink-500",
  Kindness: "bg-green-500",
  Sharing: "bg-purple-500",
  Teamwork: "bg-yellow-500",
  Gratitude: "bg-orange-500",
  Perseverance: "bg-indigo-500",
  Respect: "bg-teal-500",
  Responsibility: "bg-cyan-500",
}
```

## 🔄 Sort Options

```typescript
const SORT_OPTIONS = [
  { value: SortOption.RECENT, label: "Recently Added" },
  { value: SortOption.POPULAR, label: "Most Popular" },
  { value: SortOption.TITLE, label: "A to Z" },
]
```

## 📱 Responsive Breakpoints

```typescript
Mobile:  < 640px   → 1 column
Tablet:  640-1024px → 2 columns
Desktop: > 1024px   → 3 columns
```

## 🧪 Testing Checklist

- [ ] Page loads with mock data
- [ ] Stories display in grid
- [ ] Sort dropdown works
- [ ] Load more button works
- [ ] Empty state shows correctly
- [ ] Loading states work
- [ ] Error toast displays
- [ ] Card hover effects work
- [ ] Navigation to reading page works
- [ ] Back button works
- [ ] Responsive on mobile/tablet/desktop
- [ ] Images lazy-load
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## 🎯 File Structure

```
story-selection/
├── page.tsx                          # Main component
├── StorySelection.page.mock.ts       # Mock data
├── README.md                         # Full docs
├── VISUAL_GUIDE.md                   # Visual layout
└── QUICK_REFERENCE.md                # This file
```

## 🔧 Common Tasks

### Add New Sort Option
1. Add to `SortOption` enum in `types.ts`
2. Add to `SORT_OPTIONS` array
3. Add case to `sortStories()` function

### Add New Theme Color
1. Add to `getThemeColor()` function
2. Map theme name to Tailwind color class

### Change Stories Per Page
```typescript
const STORIES_PER_PAGE = 12 // Change this value
```

### Toggle Mock Data
```typescript
const [useMockData] = useState(true) // true = mock, false = API
```

## 📝 Quick Tips

1. **Images**: Cover images lazy-load for performance
2. **Filtering**: Only shows completed & published stories
3. **Navigation**: Uses query param `?storyId={id}` for reading
4. **Sort**: Client-side for mock, server-side for API
5. **Pagination**: Offset resets when sort changes
6. **Accessibility**: Full keyboard & screen reader support
7. **Error Handling**: Shows toast on error with 5s duration

## 🎪 Component Props

### Card Component
```typescript
<Card
  image={string}           // Cover image URL
  imageAlt={string}        // Alt text
  hoverable={boolean}      // Enable hover effect
  onClick={() => void}     // Click handler
  padding={CardPadding}    // Padding size
  className={string}       // Additional classes
>
  {children}
</Card>
```

### Button Component
```typescript
<Button
  variant={ButtonVariant}  // Primary, Secondary
  size={ButtonSize}        // Small, Medium, Large
  onClick={() => void}     // Click handler
  disabled={boolean}       // Disabled state
  className={string}       // Additional classes
>
  {children}
</Button>
```

## 🚨 Error Handling

```typescript
// Error is caught and displayed as toast
try {
  await fetchStories()
} catch (err) {
  setError("Oops! We couldn't load the stories. Please try again.")
}
```

## 🎯 Key Functions

| Function | Purpose |
|----------|---------|
| `fetchStories()` | Fetch and update stories list |
| `sortStories()` | Sort stories by selected option |
| `handleSortChange()` | Change sort and reload |
| `handleLoadMore()` | Load next page of stories |
| `handleStoryClick()` | Navigate to reading page |
| `handleBackClick()` | Navigate to home |
| `getThemeColor()` | Get badge color for theme |

## 💡 Pro Tips

- Use mock data during development to avoid API calls
- Test with empty array to verify empty state
- Test with 1-2 stories to verify layout
- Test hover states on desktop
- Test touch interactions on mobile
- Verify all images have alt text
- Check color contrast for accessibility
- Test with long story titles
- Verify sort persistence during pagination

## 📚 Related Pages

- `/story-reading` - Read selected story
- `/` - Home/role selection
- `/story-setup` - Parent: Create new story
- `/story-tree` - Parent: Edit story structure

