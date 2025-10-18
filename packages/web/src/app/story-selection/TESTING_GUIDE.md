# Story Selection Page - Testing Guide

This guide provides step-by-step instructions for testing the Story Selection page.

## 🚀 Quick Test

### 1. Start Development Server
```bash
cd packages/web
npm run dev
```

### 2. Navigate to Page
Open browser to: `http://localhost:3000/story-selection`

### 3. Verify Page Loads
- [ ] Page loads without errors
- [ ] Header displays with title "Choose Your Adventure! 🚀"
- [ ] Stories display in grid (mock data)
- [ ] Loading spinner shows briefly

## 🧪 Detailed Testing

### Test 1: Initial Page Load
**Expected**: Page loads with 12 mock stories in a responsive grid

**Steps**:
1. Navigate to `/story-selection`
2. Wait for loading to complete
3. Verify 12 stories display

**Check**:
- [ ] Header shows "Choose Your Adventure! 🚀"
- [ ] "12 stories available" shows above grid
- [ ] Grid displays stories
- [ ] Each card has image, title, badge, info, button

### Test 2: Story Card Display
**Expected**: Each card shows complete story information

**Steps**:
1. Examine first story card
2. Check all elements present

**Check**:
- [ ] Cover image displays
- [ ] Story title is readable (large, bold)
- [ ] Theme badge shows (colored)
- [ ] Scene count shows (📖 icon)
- [ ] Read count shows (⭐ icon)
- [ ] "Read Story 📚" button visible
- [ ] All text is readable

### Test 3: Hover Interactions (Desktop)
**Expected**: Cards lift and scale on hover

**Steps**:
1. Hover over story card
2. Observe visual feedback

**Check**:
- [ ] Card lifts (translates up)
- [ ] Card scales to 105%
- [ ] Shadow increases (xl)
- [ ] Transition is smooth
- [ ] Cursor shows pointer

### Test 4: Sort Functionality
**Expected**: Stories reorder based on sort selection

**Steps**:
1. Note first story title
2. Change sort to "Most Popular"
3. Note first story title again
4. Change to "A to Z"
5. Verify alphabetical order

**Check**:
- [ ] "Recently Added" shows newest first
- [ ] "Most Popular" shows highest read count first
- [ ] "A to Z" shows alphabetical order
- [ ] Loading spinner shows during change
- [ ] Grid updates correctly
- [ ] Story count remains "12 stories available"

### Test 5: Load More Pagination
**Expected**: Next 12 stories load when clicked

**Note**: With mock data (10 stories), load more won't show

**Steps** (for real API with 12+ stories):
1. Scroll to bottom
2. Click "Load More Stories" button
3. Wait for loading

**Check**:
- [ ] Button shows "Loading..." during fetch
- [ ] Button is disabled during loading
- [ ] New stories append to grid
- [ ] No duplicate stories
- [ ] Button hides when no more stories

### Test 6: Story Navigation
**Expected**: Clicking story navigates to reading page

**Steps**:
1. Click anywhere on a story card
2. Check URL changes

**Check**:
- [ ] Navigation to `/story-reading?storyId={id}`
- [ ] Correct story ID in URL
- [ ] Click on card body works
- [ ] Click on "Read Story" button works

### Test 7: Back Button
**Expected**: Returns to home page

**Steps**:
1. Click "← Back" button
2. Verify navigation

**Check**:
- [ ] Navigates to `/` (home)
- [ ] Button is visible
- [ ] Button is clickable

### Test 8: Empty State
**Expected**: Shows friendly message when no stories

**Steps**:
1. Modify mock data to empty array: `mockCompletedStories = []`
2. Reload page

**Check**:
- [ ] Large emoji shows (📚)
- [ ] Title: "No Stories Yet!"
- [ ] Message: "Ask a parent to create a wonderful story for you!"
- [ ] Centered layout
- [ ] No story grid shows
- [ ] Sort dropdown still shows

### Test 9: Loading State
**Expected**: Shows spinner during initial load

**Steps**:
1. Add delay to mock data fetch (increase timeout)
2. Reload page
3. Observe loading

**Check**:
- [ ] Loading spinner shows
- [ ] "Loading stories..." text shows
- [ ] Centered layout
- [ ] No story grid shows yet
- [ ] Loading completes and stories show

### Test 10: Error Handling
**Expected**: Error toast shows on failure

**Steps**:
1. Set `useMockData = false` (use real API)
2. Ensure backend is not running
3. Reload page

**Check**:
- [ ] Error toast appears (top-right)
- [ ] Error message is user-friendly
- [ ] Toast is red (error variant)
- [ ] Toast auto-dismisses after 5s
- [ ] Can manually dismiss with X button

### Test 11: Responsive - Mobile (< 640px)
**Expected**: Single column layout

**Steps**:
1. Resize browser to 375px width (iPhone)
2. Verify layout

**Check**:
- [ ] Stories in 1 column
- [ ] Cards are full width
- [ ] Text is readable
- [ ] Buttons are touchable (44px+ height)
- [ ] Header title wraps nicely
- [ ] Sort dropdown accessible

### Test 12: Responsive - Tablet (640-1024px)
**Expected**: Two column layout

**Steps**:
1. Resize browser to 768px width (iPad)
2. Verify layout

**Check**:
- [ ] Stories in 2 columns
- [ ] Cards sized appropriately
- [ ] Gap between cards visible
- [ ] Text is readable
- [ ] Buttons accessible

### Test 13: Responsive - Desktop (> 1024px)
**Expected**: Three column layout

**Steps**:
1. Resize browser to 1280px+ width
2. Verify layout

**Check**:
- [ ] Stories in 3 columns
- [ ] Cards sized appropriately
- [ ] Grid centered (max-w-7xl)
- [ ] Plenty of whitespace
- [ ] Hover effects work

### Test 14: Keyboard Navigation
**Expected**: Full keyboard accessibility

**Steps**:
1. Tab through page elements
2. Use Enter/Space to activate
3. Verify focus indicators

**Check**:
- [ ] Can tab to "Back" button
- [ ] Can tab to sort dropdown
- [ ] Can tab through story cards
- [ ] Focus visible (ring)
- [ ] Enter/Space activates buttons
- [ ] Tab order is logical
- [ ] No keyboard traps

### Test 15: Screen Reader (Accessibility)
**Expected**: Content is announced correctly

**Steps**:
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate through page
3. Listen to announcements

**Check**:
- [ ] Page title announced
- [ ] Story count announced
- [ ] Sort label announced
- [ ] Card content announced
- [ ] Button labels announced
- [ ] Image alt text announced
- [ ] Landmarks (header, main) recognized

### Test 16: Theme Badge Colors
**Expected**: Each theme has distinct color

**Steps**:
1. View stories with different themes
2. Check badge colors

**Check**:
- [ ] Honesty: Blue
- [ ] Courage: Red
- [ ] Friendship: Pink
- [ ] Kindness: Green
- [ ] Sharing: Purple
- [ ] Teamwork: Yellow
- [ ] Gratitude: Orange
- [ ] Perseverance: Indigo
- [ ] Respect: Teal
- [ ] Responsibility: Cyan

### Test 17: Image Lazy Loading
**Expected**: Images load as they enter viewport

**Steps**:
1. Open DevTools Network tab
2. Load page
3. Scroll down slowly
4. Watch image requests

**Check**:
- [ ] Not all images load immediately
- [ ] Images load as scrolled into view
- [ ] Placeholder shows before load
- [ ] No layout shift on load

### Test 18: API Integration (Real Data)
**Expected**: Works with backend API

**Steps**:
1. Set `useMockData = false`
2. Start backend server
3. Reload page

**Check**:
- [ ] Stories fetch from API
- [ ] Pagination works with backend
- [ ] Sort query param sent
- [ ] Loading states work
- [ ] Error handling works if API fails

## 📊 Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Functionality | 6 | ✅ |
| UI/Design | 4 | ✅ |
| Responsive | 3 | ✅ |
| Accessibility | 2 | ✅ |
| Performance | 1 | ✅ |
| Integration | 1 | ⏸️ (Backend needed) |
| **Total** | **18** | **Ready** |

## 🐛 Common Issues & Solutions

### Issue 1: Stories Not Loading
**Symptoms**: Empty page, no loading spinner
**Solution**: Check console for errors, verify imports

### Issue 2: Images Not Displaying
**Symptoms**: Broken image icons
**Solution**: Check image paths in mock data, verify public directory

### Issue 3: Sort Not Working
**Symptoms**: Order doesn't change
**Solution**: Check `sortStories()` function, verify state updates

### Issue 4: Load More Not Showing
**Symptoms**: Button not visible
**Solution**: Normal with mock data (only 10 stories), use 13+ stories to test

### Issue 5: Hover Effects Not Working
**Symptoms**: No visual feedback
**Solution**: Check `hoverable` prop is true, verify Tailwind classes

### Issue 6: Navigation Not Working
**Symptoms**: Click doesn't go to reading page
**Solution**: Check `router.push()` call, verify Next.js routing

## 🧰 Testing Tools

### Browser DevTools
- **Elements**: Inspect DOM structure
- **Console**: Check for errors/warnings
- **Network**: Monitor API calls, image loading
- **Application**: Check localStorage if used
- **Lighthouse**: Audit accessibility, performance

### Accessibility Tools
- **WAVE**: Browser extension for accessibility
- **axe DevTools**: Accessibility testing
- **VoiceOver/NVDA**: Screen reader testing
- **Keyboard Only**: Navigate without mouse

### Responsive Testing
- **Chrome DevTools**: Device emulation
- **Responsive Viewer**: Extension for multiple viewports
- **Real Devices**: Test on actual phones/tablets

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] All 18 tests pass
- [ ] No console errors
- [ ] No linting errors
- [ ] Images load correctly
- [ ] API integration works
- [ ] Responsive on all breakpoints
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Performance acceptable (Lighthouse 90+)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Documented for team
- [ ] User testing completed

## 📝 Testing Notes

### Mock Data
- Current mock has 10 stories
- Load more won't show (need 13+ stories)
- All themes represented
- Variety of read counts and dates

### Real API Testing
- Toggle `useMockData` to false
- Requires backend running
- Update API_BASE_URL if needed
- Monitor network requests

### Performance
- Lazy loading enabled
- No unnecessary re-renders
- Efficient state management
- Smooth animations

## 🎯 Next Steps After Testing

1. **Fix any issues** found during testing
2. **Gather user feedback** from children and parents
3. **Monitor analytics** (if implemented)
4. **Iterate on design** based on feedback
5. **Add enhancements** from future enhancements list

---

**Last Updated**: October 18, 2025  
**Test Status**: Ready for Testing ✓  
**Known Issues**: None

