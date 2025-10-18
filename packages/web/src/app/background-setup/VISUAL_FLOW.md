# Background Setup - Visual Flow

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    Background Setup Page                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │              Story Backgrounds (Title)             │      │
│  │   Create beautiful backgrounds for each location   │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │  🎨 4 / 4 Backgrounds Ready  ✓                  │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │  [Generate All Backgrounds]  (or) All Generated │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  Background Card 1   │  │  Background Card 2   │        │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │        │
│  │  │ Location Name  │  │  │  │ Location Name  │  │        │
│  │  └────────────────┘  │  │  └────────────────┘  │        │
│  │  Scenes: 1, 3, 5, 8  │  │  Scenes: 2, 6, 9     │        │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │        │
│  │  │ Description    │  │  │  │ Description    │  │        │
│  │  │                │  │  │  │                │  │        │
│  │  └────────────────┘  │  │  └────────────────┘  │        │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │        │
│  │  │  [Image View]  │  │  │  │  [Generating]  │  │        │
│  │  │                │  │  │  │       🔄        │  │        │
│  │  └────────────────┘  │  │  └────────────────┘  │        │
│  │  [v1][v2][v3]       │  │                      │        │
│  │  [Regenerate]       │  │                      │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  Background Card 3   │  │  Background Card 4   │        │
│  │  (similar layout)    │  │  (similar layout)    │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                               │
│  [← Back to Characters]    [Next: Scene Images →]           │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │  ℹ️  How to create backgrounds:                │          │
│  │  • Edit descriptions to customize              │          │
│  │  • Generate all or individual backgrounds      │          │
│  │  • Select from version history                 │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## User Journey Flow

```
┌─────────────────┐
│  User arrives   │
│  from Character │
│   Assignment    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Page loads     │
│  backgrounds    │
│  (800ms delay)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User reviews   │
│  4 locations    │
│  with metadata  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Edit   │ │ Skip   │
│ Desc.  │ │ Edits  │
└───┬────┘ └───┬────┘
    │          │
    │ Auto-    │
    │ save     │
    │ (1s)     │
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│ Click "Generate │
│ All Backgrounds"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Overlay shows  │
│  Progress:      │
│  "0 / 4"        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Poll status    │
│  every 2s       │
│  Update cards   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Progress:      │
│  "2 / 4"        │
│  Halfway!       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Progress:      │
│  "4 / 4" ✓      │
│  Complete!      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Overlay closes │
│  All cards show │
│  images         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Regen  │ │ Accept │
│ Some?  │ │ & Next │
└───┬────┘ └───┬────┘
    │          │
    │          │
    │          ▼
    │     ┌────────┐
    │     │ Scene  │
    │     │  Gen   │
    │     └────────┘
    │
    ▼
┌─────────────────┐
│ Click Regenerate│
│ on specific bg  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Card shows     │
│  generating     │
│  (2s delay)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  New version    │
│  added to       │
│  history        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User selects   │
│  preferred      │
│  version        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click Next     │
│  → Scene Gen    │
└─────────────────┘
```

## State Transitions

```
Background State Machine:
┌─────────┐
│ PENDING │ ← Initial state
└────┬────┘
     │
     │ (Generate clicked)
     ▼
┌────────────┐
│ GENERATING │ ← Showing spinner
└────┬───────┘
     │
     │ (API returns success)
     ▼
┌───────────┐
│ COMPLETED │ ← Has images
└────┬──────┘
     │
     │ (Regenerate clicked)
     ▼
┌────────────┐
│ GENERATING │ ← Creating new version
└────┬───────┘
     │
     ▼
┌───────────┐
│ COMPLETED │ ← New version added
└───────────┘

Error Flow:
┌────────────┐
│ GENERATING │
└────┬───────┘
     │
     │ (API returns error)
     ▼
┌────────┐
│ FAILED │ ← Error state
└────┬───┘
     │
     │ (User clicks retry)
     ▼
┌────────────┐
│ GENERATING │
└────────────┘
```

## Card State Visual

### Pending State
```
┌──────────────────────┐
│  Enchanted Forest    │ ← Read-only heading
│                      │
│  Scenes: 1, 3, 5, 8  │ ← Hover shows tooltips
│       ↑  ↑  ↑  ↑     │
│       └──┴──┴──┴─ Scene content on hover
│                      │
│  ┌────────────────┐  │
│  │ Description    │  │ ← Editable
│  │ [empty]        │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │      📷        │  │
│  │  No image yet  │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │   Generate     │  │ ← Disabled if no description
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

### Generating State
```
┌──────────────────────┐
│  Royal Castle        │
│                      │
│  Scenes: 2, 6, 9     │
│                      │
│  ┌────────────────┐  │
│  │ Description    │  │
│  │ A grand castle │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │      🔄        │  │ ← Spinning animation
│  │  Generating... │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

### Completed State
```
┌──────────────────────┐
│  Village Square      │
│                      │
│  Scenes: 4, 7        │
│                      │
│  ┌────────────────┐  │
│  │ Description    │  │
│  │ A peaceful...  │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │    [Image]     │  │ ← Generated image
│  │                │  │
│  └────────────────┘  │
│                      │
│  [v1] [v2] [v3]     │ ← Version history
│   ▲                 │
│   └─ Selected       │
│                      │
│  [Regenerate]       │ ← Create new version
│                      │
└──────────────────────┘
```

## Bulk Generation Flow

### Step 1: Initial State
```
Progress: 0 / 4

[Card 1: Pending]
[Card 2: Pending]
[Card 3: Pending]
[Card 4: Pending]

[Generate All Backgrounds] ← Click here
```

### Step 2: Generation Started
```
┌─────────────────────────┐
│  Creating Beautiful     │
│  Backgrounds...         │
│         🔄              │
│                         │
│  0 / 4 completed        │
│                         │
│  This may take a few    │
│  moments...             │
└─────────────────────────┘

Background cards:
[Card 1: Generating]
[Card 2: Pending]
[Card 3: Pending]
[Card 4: Pending]
```

### Step 3: In Progress
```
┌─────────────────────────┐
│  Creating Beautiful     │
│  Backgrounds...         │
│         🔄              │
│                         │
│  2 / 4 completed        │
│                         │
│  This may take a few    │
│  moments...             │
└─────────────────────────┘

Background cards:
[Card 1: Completed ✓]
[Card 2: Completed ✓]
[Card 3: Generating]
[Card 4: Pending]
```

### Step 4: Complete
```
All cards: Completed ✓

Progress badge: 4 / 4 Backgrounds Ready ✓

Overlay closes automatically
```

## Scene Number Tooltip Interaction

```
Normal State:
Used in scenes: 1, 3, 5, 8

Hover on "3":
Used in scenes: 1, 3̲, 5, 8
                 ↑
        ┌────────┴────────────────────────┐
        │ Scene 3:                        │
        │ Deep in the magical woods, a    │
        │ path appears...                 │
        └─────────────────────────────────┘
        Dark tooltip appears above scene number

Features:
- Blue highlighted numbers
- Cursor: help icon (?)
- Dark background tooltip
- White text
- Scene number + content
- Appears on hover
- Disappears on mouse leave
```

## Version Selection Flow

```
Current View:
┌────────────────┐
│  [Image v3]    │ ← Currently shown
│                │
└────────────────┘

Version History:
┌──┐ ┌──┐ ┌──┐
│v1│ │v2│ │v3│
└──┘ └──┘ └▲─┘
           │
       Selected

User clicks v1:
┌──┐ ┌──┐ ┌──┐
│v1│ │v2│ │v3│
└▲─┘ └──┘ └──┘
 │
Selected

Main view updates:
┌────────────────┐
│  [Image v1]    │ ← Now shown
│                │
└────────────────┘
```

## Navigation Decision Tree

```
User on Background Setup Page
│
├─ Click "Back"
│  └─ Navigate to Character Assignment
│     (No validation required)
│
└─ Click "Next"
   │
   ├─ All backgrounds ready? NO
   │  └─ Show error: "Generate all backgrounds first"
   │     Stay on page
   │
   └─ All backgrounds ready? YES
      └─ Navigate to Scene Generation
         (Validation passed)
```

## Responsive Breakpoints

### Desktop (lg: 1024px+)
```
┌─────────────────────────────────────┐
│         [Card 1]    [Card 2]        │
│         [Card 3]    [Card 4]        │
└─────────────────────────────────────┘
2-column grid, side-by-side
```

### Tablet (md: 768px - 1023px)
```
┌─────────────────────────────────────┐
│         [Card 1]    [Card 2]        │
│         [Card 3]    [Card 4]        │
└─────────────────────────────────────┘
2-column grid, narrower
```

### Mobile (sm: < 768px)
```
┌──────────────┐
│   [Card 1]   │
│   [Card 2]   │
│   [Card 3]   │
│   [Card 4]   │
└──────────────┘
1-column stack
```

## Interactive Elements Map

```
Page Elements:

1. Header
   - Title (static text)
   - Description (static text)
   - Progress badge (dynamic)

2. Generate All Button
   - Enabled: when pending backgrounds exist
   - Disabled: when all complete or generating
   - Loading: shows spinner during generation

3. Background Cards (×4)
   a. Name Input
      - Editable
      - Auto-saves after 1s
   
   b. Scene Numbers
      - Read-only badge
   
   c. Description Textarea
      - Editable
      - Character counter
      - Auto-saves after 1s
   
   d. Status Indicator
      - Shows during generation
   
   e. Image Viewer
      - Shows image or placeholder
      - Click to zoom
      - Regenerate button (if has image)
   
   f. Version History
      - Thumbnails of all versions
      - Click to select
      - Horizontal scroll
   
   g. Generate Button
      - Only if no images
      - Disabled if no description

4. Navigation
   - Back button (always enabled)
   - Next button (validates completion)

5. Help Card
   - Shows if not complete
   - Instructional text

6. Overlay
   - Shows during bulk generation
   - Progress counter
   - Cannot dismiss
```

## Color Coding

```
Status Colors:

PENDING:    Gray    (border-gray-300)
GENERATING: Blue    (text-blue-600, spinner)
COMPLETED:  Green   (checkmark, text-green-600)
FAILED:     Red     (text-red-600, error icon)

UI Colors:

Primary:    Blue    (buttons, accents)
Secondary:  Gray    (secondary buttons)
Success:    Green   (completion states)
Error:      Red     (error messages)
Background: Purple/Pink gradient
Cards:      White   (bg-white)
Text:       Gray-900 (primary text)
```

## Animation Timeline

```
Page Load:
0ms:   Render loading spinner
800ms: Data arrives, fade in cards
1000ms: Animation complete

Generate All:
0ms:    Button click, show overlay
100ms:  Overlay fades in
1000ms: API returns jobId
1000ms: Start polling (interval: 2000ms)
3000ms: First poll completes, update card 1
5000ms: Second poll, update cards 1-2
7000ms: Third poll, update cards 1-3
9000ms: Fourth poll, all complete
9100ms: Overlay fades out
9300ms: Animation complete

Regenerate:
0ms:    Button click
100ms:  Show loading on card
2000ms: New version arrives
2100ms: Fade in new image
2200ms: Add to version history
2300ms: Animation complete

Version Select:
0ms:    Thumbnail click
100ms:  Update main image
200ms:  Fade in transition
300ms:  Animation complete
```

## Error States Visual

### Load Error
```
┌────────────────────────────┐
│  ⚠️ Error Loading           │
│  Failed to load backgrounds│
│  Please try again          │
│                            │
│  [Retry]                   │
└────────────────────────────┘
```

### Generation Error
```
┌──────────────────────┐
│  Enchanted Forest    │
│                      │
│  ┌────────────────┐  │
│  │  ❌ Failed     │  │
│  │  Generation    │  │
│  │  error         │  │
│  └────────────────┘  │
│                      │
│  [Try Again]         │
│                      │
└──────────────────────┘
```

### Validation Error
```
┌────────────────────────────┐
│  ⚠️ Cannot Continue         │
│  Please generate all       │
│  backgrounds before        │
│  continuing                │
└────────────────────────────┘
```

This visual flow document provides a comprehensive view of how the page looks and behaves throughout the user journey.

