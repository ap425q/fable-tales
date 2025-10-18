# Character Assignment Page - Development Guide

## 🚀 Getting Started

### File Locations
```
/src/app/character-assignment/
├── [storyId]/
│   ├── page.tsx                              # Main page component
│   └── character-assignment.page.mock.ts     # Mock data
├── README.md                                 # Full documentation
├── QUICK_START.md                            # User guide
├── IMPLEMENTATION_SUMMARY.md                 # Technical details
├── FEATURES.md                               # Feature list
└── DEVELOPMENT.md                            # This file
```

### Running the Page

1. **Start the development server:**
   ```bash
   cd /Users/lcpnine/fable-tales/packages/web
   npm run dev
   ```

2. **Navigate to the page:**
   ```
   http://localhost:3000/character-assignment/test-story-id
   ```
   (Replace `test-story-id` with any story ID)

3. **The page will load with mock data automatically**

## 🔧 Enabling API Integration

Currently, the page uses mock data. To switch to real API:

### Step 1: Verify Backend is Running
Ensure the Python backend server is running:
```bash
cd /Users/lcpnine/fable-tales/packages/server
python main.py
```

### Step 2: Update the Frontend Code

In `/src/app/character-assignment/[storyId]/page.tsx`:

**Line ~40: Uncomment API calls**
```typescript
// Change from:
await simulateDelay(800)
const charactersResult = mockCharactersResponse
const rolesResult = { success: true, data: { characters: mockStoryRoles } }

// To:
const charactersResult = await api.characters.getAll()
const rolesResult = await api.stories.getById(storyId)
const assignmentsResult = await api.characters.getAssignments(storyId)
```

**Line ~260: Uncomment save call**
```typescript
// Change from:
// const assignmentData = Object.entries(assignments).map(...)
// await api.characters.saveAssignments(storyId, assignmentData)
await simulateDelay(1000)

// To:
const assignmentData = Object.entries(assignments).map(
  ([roleId, characterId]) => ({
    characterRoleId: roleId,
    presetCharacterId: characterId,
  })
)
await api.characters.saveAssignments(storyId, assignmentData)
```

### Step 3: Remove Mock Imports
```typescript
// Remove these imports:
import {
  mockCharactersResponse,
  mockStoryRoles,
  simulateDelay,
} from "./character-assignment.page.mock"
```

### Step 4: Test
- Load the page with a real story ID
- Verify character gallery loads
- Test assignments
- Verify save works
- Check navigation to background setup

## 🧪 Testing

### Manual Testing Checklist

#### Load States
- [ ] Load page with no existing assignments
- [ ] Load page with partial assignments (2 of 4)
- [ ] Load page with complete assignments (4 of 4)
- [ ] Test loading spinner displays
- [ ] Test error states

#### Click-to-Assign Method
- [ ] Click a character (should get blue ring)
- [ ] Click a role slot (character should assign)
- [ ] Click another character then another role
- [ ] Try clicking an already-assigned character (should not select)
- [ ] Verify selection clears after assignment

#### Drag-and-Drop Method
- [ ] Drag a character (should become semi-transparent)
- [ ] Hover over role slot (should highlight)
- [ ] Drop on role slot (should assign)
- [ ] Try dragging an already-assigned character (should not work)
- [ ] Verify drag state clears after drop

#### Validation
- [ ] Try to assign same character to two roles (should show error)
- [ ] Try to proceed with incomplete assignments (button disabled)
- [ ] Complete all assignments (button should enable)
- [ ] Verify progress indicator updates correctly

#### Actions
- [ ] Remove an assignment (should free character)
- [ ] Change an assignment (should remove then allow reassign)
- [ ] Verify assignment preview appears when complete

#### Navigation
- [ ] Click "Back to Story Editor" (should navigate back)
- [ ] Complete assignments and click "Next" (should save and navigate)
- [ ] Verify story ID is preserved in navigation

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test layout switches at breakpoints

#### Accessibility
- [ ] Tab through all interactive elements
- [ ] Press Enter/Space to select
- [ ] Verify focus indicators visible
- [ ] Test with screen reader (VoiceOver/NVDA)

### Automated Testing (Future)

```typescript
// Example test structure
describe('CharacterAssignmentPage', () => {
  it('should load preset characters', async () => {
    // Test implementation
  })
  
  it('should assign character on click', async () => {
    // Test implementation
  })
  
  it('should prevent duplicate assignments', async () => {
    // Test implementation
  })
  
  // More tests...
})
```

## 🔨 Modifying the Component

### Adding a New Character

1. Add image to `/public/characters/`:
   ```bash
   cp new_character.png /Users/lcpnine/fable-tales/packages/web/public/characters/
   ```

2. Update mock data in `character-assignment.page.mock.ts`:
   ```typescript
   {
     id: "char_new",
     name: "New Character",
     imageUrl: "/characters/new_character.png",
     category: CharacterCategory.HUMAN,
     description: "A new character",
   }
   ```

3. Update backend database with new preset character

### Changing the Layout

**Adjust Gallery Width:**
```typescript
// In page.tsx, find:
<div className="lg:w-2/5">  // Currently 40%

// Change to:
<div className="lg:w-1/3">  // For 33%
```

**Adjust Grid Columns:**
```typescript
// Find:
<div className="grid grid-cols-2 gap-4">

// Change to:
<div className="grid grid-cols-3 gap-4">  // For 3 columns
```

### Adding Character Filtering

```typescript
// Add state
const [categoryFilter, setCategoryFilter] = useState<CharacterCategory | null>(null)

// Filter characters
const filteredCharacters = presetCharacters.filter(char => 
  !categoryFilter || char.category === categoryFilter
)

// Add filter buttons in UI
<div className="flex gap-2 mb-4">
  <button onClick={() => setCategoryFilter(null)}>All</button>
  <button onClick={() => setCategoryFilter(CharacterCategory.HUMAN)}>Humans</button>
  <button onClick={() => setCategoryFilter(CharacterCategory.ANIMAL)}>Animals</button>
  {/* More filters... */}
</div>
```

### Adding Character Search

```typescript
// Add state
const [searchQuery, setSearchQuery] = useState("")

// Filter characters
const searchedCharacters = presetCharacters.filter(char =>
  char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  char.description?.toLowerCase().includes(searchQuery.toLowerCase())
)

// Add search input in UI
<Input
  placeholder="Search characters..."
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

## 🐛 Common Issues & Solutions

### Issue: Characters not loading
**Solution:** Check that:
- Backend server is running
- API endpoint is correct
- Mock data is properly imported (if in mock mode)
- Network requests aren't blocked

### Issue: Drag and drop not working
**Solution:** Check that:
- `draggable` attribute is set correctly
- Event handlers are attached properly
- Character is not already assigned
- Browser supports HTML5 drag API

### Issue: Assignment not saving
**Solution:** Check that:
- API call is uncommented
- Story ID is valid
- Assignment data format is correct
- Backend endpoint is working

### Issue: Layout broken on mobile
**Solution:** Check that:
- Tailwind breakpoints are correct
- Responsive classes are applied
- Content fits within screen width

### Issue: Images not displaying
**Solution:** Check that:
- Image files exist in `/public/characters/`
- Image paths start with `/characters/` (not `public/`)
- Image file names match exactly (case-sensitive)

## 📊 Performance Optimization

### Current Optimizations
- Lazy image loading with `loading="lazy"`
- Conditional rendering of large sections
- Efficient state updates
- Memoized lookup functions

### Future Optimizations
```typescript
// Memoize character lookup
const getCharacterById = useMemo(() => {
  return (id: string) => presetCharacters.find(c => c.id === id)
}, [presetCharacters])

// Debounce drag events
const debouncedDragOver = useMemo(() => 
  debounce((e, roleId) => handleDragOver(e, roleId), 100),
  []
)

// Virtual scrolling for large character lists
import { FixedSizeGrid } from 'react-window'
```

## 🎨 Styling Guide

### Color Palette
- **Primary Blue:** `blue-500`, `blue-600`, `blue-700`
- **Success Green:** `green-100`, `green-500`, `green-800`
- **Error Red:** `red-50`, `red-200`, `red-600`, `red-800`
- **Neutral Gray:** `gray-50` to `gray-900`
- **Gradient:** `from-purple-50 via-pink-50 to-blue-50`

### Spacing System
- **Small Gap:** `gap-2` (0.5rem)
- **Medium Gap:** `gap-4` (1rem)
- **Large Gap:** `gap-6` (1.5rem)
- **Card Padding:** `p-6` (1.5rem)

### Shadow System
- **Default:** `shadow-md`
- **Hover:** `shadow-lg`
- **Elevated:** `shadow-xl`
- **Card:** `shadow-2xl`

### Interactive States
```css
/* Hover Effect */
hover:shadow-xl hover:-translate-y-1

/* Selected State */
ring-2 ring-blue-500

/* Disabled State */
opacity-50 cursor-not-allowed

/* Dragging State */
opacity-50
```

## 🔐 Security Considerations

### Input Validation
- Validate story ID format (UUID)
- Validate character IDs against preset list
- Validate role IDs against story roles
- Sanitize any user-generated content

### XSS Prevention
- Use React's built-in XSS protection
- Don't use `dangerouslySetInnerHTML`
- Validate all data from API

### CSRF Protection
- Use proper authentication tokens
- Validate session on backend
- Use HTTPS in production

## 📱 Browser Support

### Tested Browsers
- ✅ Chrome 120+ (Desktop & Mobile)
- ✅ Safari 17+ (Desktop & Mobile)
- ✅ Firefox 120+
- ✅ Edge 120+

### Known Issues
- Drag-and-drop may be less smooth on older mobile browsers
- Some older browsers may not support all CSS features

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Switch from mock data to real API
- [ ] Remove all console.log statements
- [ ] Verify error handling covers all cases
- [ ] Test with real story data
- [ ] Test on all target devices
- [ ] Verify accessibility compliance
- [ ] Check performance metrics
- [ ] Update API_BASE_URL for production
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Test with slow network (throttling)
- [ ] Verify all images are optimized
- [ ] Check bundle size
- [ ] Run production build and test

## 📚 Additional Resources

### Related Documentation
- [Story Tree Page](/src/app/story-tree/README.md)
- [API Documentation](/src/lib/api.ts)
- [Component Library](/src/components/README.md)
- [Type Definitions](/src/types.ts)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React DnD](https://react-dnd.github.io/react-dnd/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments to functions
- Use functional components with hooks
- Keep components focused and modular

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/character-assignment-enhancement

# Make changes and commit
git add .
git commit -m "Add character filtering feature"

# Push and create PR
git push origin feature/character-assignment-enhancement
```

### PR Checklist
- [ ] Code follows style guide
- [ ] All tests pass
- [ ] No linter errors or warnings
- [ ] Documentation updated
- [ ] Screenshots added for UI changes
- [ ] Tested on multiple devices
- [ ] Accessibility verified

## 📞 Support

For questions or issues:
1. Check this development guide
2. Review the README.md
3. Check existing issues in repository
4. Create new issue with details

---

**Happy Coding!** 🎉

