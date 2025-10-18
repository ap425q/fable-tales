# Story Library - Visual Guide

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ My Story Library 📚                [Back] [+ Create]    │ │
│ │ Manage and organize all your stories                    │ │
│ │ 15 stories total                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Filters and Controls                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [All Stories] [Completed] [Drafts]                      │ │
│ │                                                          │ │
│ │ [Search: _________________] [Sort: ▼] [Grid/List: ▤▤]  │ │
│ │                                                          │ │
│ │ [✓] 3 selected  [Select All]          [Delete Selected] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Story Grid (3 columns)                                       │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │  [✓]     │  │  [ ]     │  │  [ ]     │                   │
│ │  ┌────┐  │  │  ┌────┐  │  │  ┌────┐  │                   │
│ │  │ 🖼️ │  │  │  │ 🖼️ │  │  │  │ 🖼️ │  │                   │
│ │  └────┘  │  │  └────┘  │  │  └────┘  │                   │
│ │  Title   │  │  Title   │  │  Title   │                   │
│ │  [Badge] │  │  [Badge] │  │  [Badge] │                   │
│ │  Lesson  │  │  Lesson  │  │  Lesson  │                   │
│ │  Stats   │  │  Stats   │  │  Stats   │                   │
│ │  [Btn..] │  │  [Btn..] │  │  [Btn..] │                   │
│ └──────────┘  └──────────┘  └──────────┘                   │
│                                                              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │  [ ]     │  │  [ ]     │  │  [ ]     │                   │
│ │  [Card]  │  │  [Card]  │  │  [Card]  │                   │
│ └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Pagination                                                   │
│           [← Previous] [1] [2] [3] [4] [5] [Next →]        │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Header Section

```
┌─────────────────────────────────────────────────────────┐
│  My Story Library 📚              [← Back] [+ Create]   │
│  Manage and organize all your stories                   │
│  15 stories total                                       │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- **Title**: Large, bold heading with book emoji
- **Subtitle**: Gray text explaining page purpose
- **Story Count**: Shows filtered story count
- **Back Button**: Secondary style, returns to home
- **Create Button**: Primary style, prominent positioning

---

### 2. Filter Tabs

```
┌─────────────────────────────────────────┐
│  [All Stories] [Completed] [Drafts]     │
└─────────────────────────────────────────┘
```

**Styles:**
- **Active Tab**: Blue background, white text, shadow
- **Inactive Tab**: Gray background, dark text
- **Hover**: Slightly darker background

**Counts (implied):**
- All Stories: 15
- Completed: 8
- Drafts: 7

---

### 3. Search and Sort Bar

```
┌───────────────────────────────────────────────────────────┐
│  [🔍 Search by title, lesson, or theme...             ]  │
│                                                           │
│  Sort by: [Recently Updated ▼]      View: [▦] [☰]       │
└───────────────────────────────────────────────────────────┘
```

**Search Box:**
- Full width on mobile, 50% on desktop
- Placeholder text guides user
- Magnifying glass icon (optional)
- 2px border, rounded corners

**Sort Dropdown:**
- Standard select element
- 4 options visible
- Active option shown

**View Toggle:**
- Grid icon: ▦ (default)
- List icon: ☰
- Active button highlighted in blue

---

### 4. Bulk Actions Bar

```
┌─────────────────────────────────────────────────────────┐
│  [✓] 3 selected    [Select All]      [Delete Selected]  │
└─────────────────────────────────────────────────────────┘
```

**Appearance:**
- Only visible when stories are selected
- Light blue background (#EFF6FF)
- Blue border
- Flex layout: left-aligned count, right-aligned delete

---

### 5. Story Card (Grid View)

```
┌──────────────────────────────┐
│ [✓] ┌────────────────────┐   │  ← Selection Checkbox
│     │                    │   │
│     │    Cover Image     │   │  ← Image (h-48)
│     │    🖼️              │   │
│     └────────────────────┘   │
│                              │
│  The Brave Little Fox  [✓]   │  ← Title + Status Badge
│                              │
│  [Honesty]                   │  ← Theme Badge (colored)
│                              │
│  Being honest earns trust    │  ← Lesson (2 lines max)
│                              │
│  📄 18 scenes  👁️ 47 reads   │  ← Statistics
│                              │
│  Created: 2 weeks ago        │  ← Timestamps
│  Updated: 3 days ago         │
│                              │
│  [Read]            [Edit]    │  ← Primary Actions
│                              │
│  [Duplicate]  [Stats] [Share]│  ← Secondary Actions
│                              │
│  [Delete]                    │  ← Destructive Action
└──────────────────────────────┘
```

**Card Dimensions:**
- Width: Responsive (1/1, 1/2, 1/3 based on screen)
- Height: Auto, maintains aspect ratio
- Padding: 1.25rem (p-5)
- Shadow: md, increases to xl on hover
- Border Radius: xl (rounded-xl)

**Status Badges:**
```
✓ Completed  → Green background (#DEF7EC)
⏳ In Progress → Yellow background (#FEF3C7)
📝 Draft      → Gray background (#F3F4F6)
```

**Theme Badges (Color-Coded):**
```
Honesty       → Blue    (#3B82F6)
Courage       → Red     (#EF4444)
Friendship    → Pink    (#EC4899)
Kindness      → Green   (#10B981)
Sharing       → Purple  (#A855F7)
Teamwork      → Yellow  (#EAB308)
Gratitude     → Orange  (#F97316)
Perseverance  → Indigo  (#6366F1)
Respect       → Teal    (#14B8A6)
Responsibility→ Cyan    (#06B6D4)
```

---

### 6. Story Card (List View)

```
┌────────────────────────────────────────────────────────────┐
│ [✓] [🖼️] The Brave Little Fox [✓ Completed] [Honesty]    │
│           Being honest earns trust and respect             │
│           📄 18 scenes │ 👁️ 47 reads │ Updated: 3 days ago │
│           [Read] [Edit] [Duplicate] [Stats] [Share] [...] │
└────────────────────────────────────────────────────────────┘
```

**Compact Layout:**
- Single row per story
- Image: 80x80px thumbnail
- Information laid out horizontally
- Actions condensed to inline buttons

---

### 7. Empty States

#### No Stories
```
        📚
        
  Start Your Storytelling Journey!
  
  You haven't created any stories yet.
  Click 'Create New Story' to begin
  crafting magical tales.
  
      [Create New Story]
```

#### No Completed Stories
```
        ✨
        
     No Completed Stories Yet
     
  Complete your first story to see it here.
  Your published stories will be available
  for children to read.
```

#### No Drafts
```
        🎉
        
   All Your Stories Are Complete!
   
  You don't have any drafts. All your
  stories are finished and ready!
```

#### No Search Results
```
        🔍
        
      No Stories Found
      
  Try adjusting your search or filters
  to find what you're looking for.
```

---

### 8. Statistics Modal

```
┌─────────────────────────────────────────────────────────┐
│  Story Statistics                              [✕]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │   124   │ │ 12.5min │ │ 87.5%   │ │2 days ago│     │
│  │ Reads   │ │Avg Time │ │Complete │ │Last Read │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                         │
│  Choice Distribution                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Scene 3: Help your friend    79.0% ████████████▌ │ │
│  │ Scene 3: Go play games       21.0% ███          │ │
│  │ Scene 7: Share your snacks   84.7% █████████████│ │
│  │ Scene 7: Keep all snacks     15.3% ██▌         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Most Visited Scenes                                    │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Scene 1: A New Day at School    124 visits 100%  │ │
│  │ Scene 2: Meeting a Friend        124 visits 100%  │ │
│  │ Scene 4: Helping Out              98 visits  79%  │ │
│  │ Scene 8: Making Friends Happy    105 visits  85%  │ │
│  │ ...                                               │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                          [Close]        │
└─────────────────────────────────────────────────────────┘
```

**Modal Sizing:**
- Width: max-w-4xl (XLarge)
- Height: Auto with max-height scroll
- Padding: 1.5rem

**Overview Cards:**
- 4 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Colored backgrounds (blue, green, purple, orange)

**Progress Bars:**
- Full width
- Height: 0.5rem
- Blue fill (#2563EB)
- Gray background (#E5E7EB)
- Rounded ends

---

### 9. Delete Confirmation Modal

```
┌─────────────────────────────────────────┐
│  Delete Story                    [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  Are you sure you want to delete        │
│  "The Brave Little Fox"?                │
│                                         │
│  This action cannot be undone.          │
│                                         │
├─────────────────────────────────────────┤
│                    [Cancel]  [Delete]   │
└─────────────────────────────────────────┘
```

**Modal Sizing:**
- Width: max-w-lg (Medium)
- Centered on screen

**Buttons:**
- Cancel: Secondary style (gray)
- Delete: Danger style (red)

---

### 10. Share Modal

```
┌─────────────────────────────────────────┐
│  Share Story                     [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  Share this link with others to let     │
│  them read your story:                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ https://app.com/story-reading/... │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│                  [Close]  [Copy Link]   │
└─────────────────────────────────────────┘
```

**URL Display:**
- Light gray background
- Border around box
- Monospace font
- Word-break to prevent overflow

---

### 11. Pagination Controls

```
┌───────────────────────────────────────────────────────┐
│   [← Previous]  [1] [2] [3] [4] [5]  [Next →]        │
└───────────────────────────────────────────────────────┘
```

**Page Numbers:**
- Current page: Blue background, white text
- Other pages: White background, gray border
- Hover: Light gray background
- Size: 40x40px buttons
- Gap: 0.5rem between buttons

**Navigation Buttons:**
- Previous/Next: Secondary style
- Disabled: Opacity reduced, not clickable
- Padding: Larger for easier clicking

---

## Color Palette

### Primary Colors
```
Blue (Primary):    #2563EB
Green (Success):   #10B981
Red (Danger):      #EF4444
Yellow (Warning):  #F59E0B
```

### Background Colors
```
Page Background:   Gradient (blue-50 → purple-50 → pink-50)
Card Background:   #FFFFFF
Gray Background:   #F9FAFB
Selected Card:     Border #2563EB
```

### Text Colors
```
Heading:           #111827 (gray-900)
Body Text:         #374151 (gray-700)
Muted Text:        #6B7280 (gray-500)
Very Muted:        #9CA3AF (gray-400)
```

### Status Colors
```
Completed:         #DEF7EC (green-50) / #047857 (green-700)
In Progress:       #FEF3C7 (yellow-50) / #B45309 (yellow-700)
Draft:             #F3F4F6 (gray-100) / #374151 (gray-700)
```

---

## Spacing and Typography

### Spacing Scale
```
xs:  0.25rem  (4px)
sm:  0.5rem   (8px)
md:  1rem     (16px)
lg:  1.5rem   (24px)
xl:  2rem     (32px)
2xl: 3rem     (48px)
```

### Typography
```
Page Title:        text-4xl (36px), font-bold
Card Title:        text-xl (20px), font-bold
Section Heading:   text-lg (18px), font-bold
Body Text:         text-base (16px), font-normal
Small Text:        text-sm (14px)
Tiny Text:         text-xs (12px)
```

---

## Responsive Breakpoints

### Grid Columns
```
Mobile (< 640px):     1 column
Tablet (640-1024px):  2 columns
Desktop (> 1024px):   3 columns
```

### Layout Changes
```
Mobile:
- Stack header buttons vertically
- Single column filters
- Full width search
- List view recommended

Tablet:
- 2 column layout
- Horizontal filters
- Side-by-side buttons

Desktop:
- 3 column grid
- Full feature set
- Optimal spacing
```

---

## Interactive States

### Hover States
```
Card:           Shadow increases (md → xl), slight lift (-translate-y-1)
Button:         Background darkens slightly
Page Number:    Background lightens
Checkbox:       Border color intensifies
```

### Active States
```
Filter Tab:     Blue background, white text, shadow
Sort Option:    Bold text
Selected Card:  Blue ring, increased shadow
Checked Box:    Blue fill with white checkmark
```

### Loading States
```
Initial Load:   Centered spinner with text
Button Action:  Button text changes, disabled state
Statistics:     Spinner in modal content area
```

### Disabled States
```
Button:         Opacity 0.5, no hover effect, no pointer cursor
Checkbox:       Grayed out, no pointer cursor
Page Button:    Same as Button
```

---

## Accessibility Features

### ARIA Labels
- All buttons have descriptive `aria-label`
- Modals have `aria-modal="true"`
- Checkboxes have associated labels

### Keyboard Support
- Tab through all interactive elements
- Enter/Space activates buttons
- Escape closes modals
- Arrow keys in dropdowns

### Screen Reader Support
- Semantic HTML structure
- Status announcements for changes
- Alternative text for images
- Clear focus indicators

---

## Animation Details

### Transitions
```
Hover:          duration-200 (200ms)
Modal Open:     animate-fade-in, animate-scale-in
Toast:          slide-in-right
Page Change:    fade-transition
```

### Micro-interactions
- Card lift on hover (transform: translateY(-4px))
- Button press effect (active:scale-95)
- Checkbox check animation
- Progress bar fill animation

---

This visual guide provides a complete reference for understanding the Story Library interface design and interactions.

