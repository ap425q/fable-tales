# Scene Image Generation - Visual Flow

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                     ENTRY POINT                              │
│  User clicks "Generate Scene Images" from Background Setup   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PAGE LOAD                                 │
│  • Show loading spinner                                      │
│  • Load scenes and character data                            │
│  • Initialize state                                          │
│  • Display gradient background                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  MAIN VIEW                                   │
│  ┌─────────────────────────────────────────────────┐        │
│  │  HEADER                                          │        │
│  │  • "Scene Images" title (gradient)               │        │
│  │  • "Generate and review..." subtitle             │        │
│  │  • Progress bar: X / Y scenes                    │        │
│  │  • Visual progress indicator                     │        │
│  └─────────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────────┐        │
│  │  ACTION BAR                                      │        │
│  │  • "Generate All Scene Images" button            │        │
│  │  • Filter dropdown (All/Completed/Needs Regen)   │        │
│  │  • Selection controls (Select All/Clear)         │        │
│  │  • "X selected" count                            │        │
│  │  • "Regenerate Selected" button                  │        │
│  └─────────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────────┐        │
│  │  SCENE GRID (3 columns on desktop)              │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │        │
│  │  │  SCENE 1 │  │  SCENE 2 │  │  SCENE 3 │      │        │
│  │  │  ☑ Ready │  │  ◌ Gener │  │  ☑ Ready │      │        │
│  │  │  [Image] │  │  [Spin.] │  │  [Image] │      │        │
│  │  │  Title   │  │  Title   │  │  Title   │      │        │
│  │  │  Text... │  │  Text... │  │  Text... │      │        │
│  │  │  👤👤    │  │  👤      │  │  👤👤👤  │      │        │
│  │  │  Location│  │  Location│  │  Location│      │        │
│  │  │ [Regen]  │  │ Loading  │  │ [Regen]  │      │        │
│  │  └──────────┘  └──────────┘  └──────────┘      │        │
│  │  ... more scenes ...                            │        │
│  └─────────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────────┐        │
│  │  NAVIGATION                                      │        │
│  │  [◀ Back to Backgrounds]  [Complete Story ▶]    │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Scene Card States

### 1. Completed Scene
```
┌────────────────────────────────┐
│ ☑ Checkbox    ✓ Ready   v2 🔄 │ ← Status badges
├────────────────────────────────┤
│                                │
│         [Scene Image]          │ ← Large image display
│                                │
├────────────────────────────────┤
│ ① Scene 1: The Forest Entrance │ ← Number + Title
│ Emma stood at the edge...      │ ← Text preview
│ 👤👤 Characters                │ ← Character avatars
│ 📍 Enchanted Forest            │ ← Location
│ [Regenerate]                   │ ← Action button
└────────────────────────────────┘
```

### 2. Generating Scene
```
┌────────────────────────────────┐
│ ☑ Checkbox    ⟳ Generating     │
├────────────────────────────────┤
│          ◌◌◌◌                  │
│       Creating...              │ ← Loading spinner
│                                │
├────────────────────────────────┤
│ ④ Scene 4: The Castle Gates    │
│ The magnificent castle...      │
│ 👤👤 Characters                │
│ 📍 Royal Castle                │
│ [Loading]                      │
└────────────────────────────────┘
```

### 3. Failed Scene
```
┌────────────────────────────────┐
│ ☑ Checkbox    ✗ Failed         │ ← Red badge
├────────────────────────────────┤
│           ✗                    │
│   Generation Failed            │ ← Error state
│                                │
├────────────────────────────────┤
│ ⑦ Scene 7: Dark Cave Entrance  │
│ A mysterious cave loomed...    │
│ 👤 Character                   │
│ 📍 Dark Cave                   │
│ [Retry]                        │ ← Red retry button
└────────────────────────────────┘
```

### 4. Pending Scene
```
┌────────────────────────────────┐
│ ☑ Checkbox    ○ No Image       │
├────────────────────────────────┤
│          📷                    │
│       No image yet             │ ← Placeholder
│                                │
├────────────────────────────────┤
│ ⑫ Scene 12: The Final Choice   │
│ Emma faced her greatest...     │
│ 👤 Character                   │
│ 📍 Enchanted Forest            │
│ [Generate]                     │ ← Purple generate button
└────────────────────────────────┘
```

## User Interaction Flows

### Flow 1: Initial Generation

```
User clicks "Generate All Scene Images"
           │
           ▼
Modal overlay appears
"Bringing your story to life..."
           │
           ▼
All cards show "Generating" state
           │
           ▼
Polling starts (every 2 seconds)
           │
           ▼
Cards update as they complete
Scene 1 ✓ → Scene 2 ✓ → Scene 3 ✓...
           │
           ▼
All scenes complete
Modal closes automatically
Progress bar shows 100%
"All scenes ready!" message
```

### Flow 2: View Scene Details

```
User clicks scene card
           │
           ▼
Modal opens (XL size)
┌──────────────────────────────────┐
│ Scene 1: The Forest Entrance  [×]│
├──────────────────────────────────┤
│ Full Scene Text:                 │
│ Emma stood at the edge of the    │
│ Enchanted Forest, her heart...   │
│                                  │
│ [Large Scene Image]              │
│                                  │
│ Version History (3):             │
│ ┌────┐ ┌────┐ ┌────┐           │
│ │ v1 │ │ v2 │ │✓v3 │ ← Selected │
│ └────┘ └────┘ └────┘           │
│                                  │
│ Location: Enchanted Forest       │
│ Scene Type: Start                │
├──────────────────────────────────┤
│     [Close]    [Regenerate]      │
└──────────────────────────────────┘
           │
           ▼
User clicks version thumbnail
           │
           ▼
Image updates immediately
Border moves to selected version
Checkmark appears
```

### Flow 3: Bulk Regeneration

```
User checks multiple scenes
           │
           ▼
"X selected" appears
"Regenerate Selected" button appears
           │
           ▼
User clicks "Regenerate Selected"
           │
           ▼
Selected scenes show "Generating"
           │
           ▼
Scenes regenerate with staggered updates
Scene 1 generating → complete
Wait 500ms
Scene 2 generating → complete
Wait 500ms...
           │
           ▼
All complete
Selection clears
New versions added
```

### Flow 4: Story Completion

```
All scenes have images
           │
           ▼
"Complete Story" button enabled
(glowing, prominent)
           │
           ▼
User clicks "Complete Story"
           │
           ▼
Completion modal opens
┌──────────────────────────────────┐
│ Complete Your Story           [×]│
├──────────────────────────────────┤
│ Enter story title:               │
│ [___________________________]    │
│ 0 / 100 characters               │
│                                  │
│ ℹ️ What happens next?            │
│ ✓ Story will be finalized        │
│ ✓ Children can start reading     │
│ ✓ Preview in child mode          │
│ ✓ Create more stories!           │
├──────────────────────────────────┤
│     [Cancel]    [Complete Story] │
└──────────────────────────────────┘
           │
           ▼
User enters title
"Complete Story" button enables
           │
           ▼
User clicks "Complete Story"
           │
           ▼
Modal closes
           │
           ▼
🎉 CONFETTI ANIMATION 🎉
┌──────────────────────────────────┐
│          🎉                      │
│     Story Complete!              │
│ Your magical story is ready!     │
└──────────────────────────────────┘
           │
           ▼
Wait 3 seconds
           │
           ▼
Navigate to dashboard/preview
```

## Responsive Breakpoints

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────┐
│              SCENE GRID                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Scene 1 │ │ Scene 2 │ │ Scene 3 │      │ ← 3 columns
│  └─────────┘ └─────────┘ └─────────┘      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Scene 4 │ │ Scene 5 │ │ Scene 6 │      │
│  └─────────┘ └─────────┘ └─────────┘      │
└─────────────────────────────────────────────┘
```

### Tablet (640px - 1023px)
```
┌───────────────────────────────┐
│        SCENE GRID             │
│  ┌──────────┐ ┌──────────┐   │
│  │ Scene 1  │ │ Scene 2  │   │ ← 2 columns
│  └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐   │
│  │ Scene 3  │ │ Scene 4  │   │
│  └──────────┘ └──────────┘   │
└───────────────────────────────┘
```

### Mobile (<640px)
```
┌─────────────────┐
│   SCENE GRID    │
│  ┌───────────┐  │
│  │  Scene 1  │  │ ← 1 column
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Scene 2  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Scene 3  │  │
│  └───────────┘  │
└─────────────────┘
```

## Color Coding

### Status Colors
- 🟢 **Green** = Completed/Ready
- 🔵 **Blue** = Generating/In Progress
- 🔴 **Red** = Failed/Error
- ⚪ **Gray** = Pending/No Image
- 🟣 **Purple** = Selected/Primary Action

### Visual Indicators
```
Checkmark ✓  = Completed
Spinner  ⟳  = Generating
Cross    ✗  = Failed
Circle   ○  = Pending
Selected ☑  = Checkbox checked
```

## Animation Sequences

### 1. Card Hover
```
Default State → Hover State
[Card]       → [Card with shadow]
               [View icon appears]
Duration: 200ms
```

### 2. Generation Progress
```
Pending → Generating → Complete
  ○    →     ⟳      →    ✓
Gray       Blue         Green
Duration: Varies (10-30 seconds per scene)
```

### 3. Version Selection
```
Click Thumbnail
     ↓
Border appears (purple)
     ↓
Ring effect
     ↓
Checkmark fades in
     ↓
Scale to 105%
Duration: 200ms
```

### 4. Bulk Generation
```
Idle State
     ↓
Click "Generate All"
     ↓
Modal fades in (backdrop blur)
     ↓
Spinner appears
     ↓
Count updates: 0 → 1 → 2 → ... → 10
     ↓
Progress bar fills
     ↓
Modal fades out
```

### 5. Confetti
```
Story Complete Confirmation
     ↓
Modal closes
     ↓
Confetti overlay fades in
     ↓
Bounce animation (3 bounces)
     ↓
Hold for 2 seconds
     ↓
Fade out
     ↓
Navigate
```

## Component Hierarchy

```
Page
├── Header
│   ├── Title (gradient text)
│   ├── Subtitle
│   └── Progress Bar
│       ├── Label
│       ├── Count
│       ├── Bar (gradient fill)
│       └── Success Message
├── Error Banner (conditional)
│   ├── Icon
│   ├── Message
│   └── Dismiss Button
├── Action Bar
│   ├── Generate All Button
│   ├── Filter Dropdown
│   └── Selection Controls
│       ├── Select All Button
│       ├── Count Display
│       ├── Regenerate Selected Button
│       └── Clear Button
├── Scene Grid
│   └── Scene Cards (map)
│       ├── Checkbox
│       ├── Status Badge
│       ├── Image Display
│       │   ├── Image or Placeholder
│       │   ├── Loading Spinner
│       │   └── Error State
│       ├── Scene Info
│       │   ├── Number Badge
│       │   ├── Title
│       │   ├── Text Preview
│       │   ├── Character Avatars
│       │   └── Location
│       └── Action Button
├── Navigation
│   ├── Back Button
│   └── Complete Story Button
├── Modals
│   ├── Scene Detail Modal
│   │   ├── Header (title + close)
│   │   ├── Content
│   │   │   ├── Full Text
│   │   │   ├── Large Image
│   │   │   ├── Version History
│   │   │   └── Metadata
│   │   └── Footer
│   │       ├── Close Button
│   │       └── Regenerate Button
│   ├── Completion Modal
│   │   ├── Header
│   │   ├── Content
│   │   │   ├── Instructions
│   │   │   ├── Title Input
│   │   │   └── Info Section
│   │   └── Footer
│   │       ├── Cancel Button
│   │       └── Complete Button
│   └── Loading Overlay Modal
│       ├── Spinner
│       ├── Heading
│       ├── Progress Count
│       └── Message
└── Confetti Overlay (conditional)
    ├── Icon
    ├── Title
    └── Message
```

## Key Interactions

### Click Interactions
| Element | Action | Result |
|---------|--------|--------|
| Scene Card | Click | Open detail modal |
| Checkbox | Click | Toggle selection |
| Generate All Button | Click | Start bulk generation |
| Regenerate Button (card) | Click | Regenerate single scene |
| Regenerate Button (modal) | Click | Regenerate scene + close modal |
| Version Thumbnail | Click | Select that version |
| Filter Dropdown | Select | Filter scene grid |
| Select All | Click | Check all visible scenes |
| Clear/Deselect All | Click | Uncheck all scenes |
| Regenerate Selected | Click | Bulk regenerate |
| Complete Story | Click | Open completion modal |
| Title Input | Type | Enter story title |
| Complete Button | Click | Finalize and celebrate |

### Keyboard Interactions
| Key | Context | Action |
|-----|---------|--------|
| ESC | Modal open | Close modal |
| Tab | Any | Navigate elements |
| Enter | Button focused | Activate button |
| Space | Checkbox focused | Toggle checkbox |

## State Transitions

```
INITIAL LOAD
     ↓
VIEWING GRID (main state)
     ↓ (multiple paths)
     ├→ BULK GENERATING → VIEWING GRID
     ├→ INDIVIDUAL REGENERATING → VIEWING GRID
     ├→ SELECTING SCENES → BULK REGENERATING → VIEWING GRID
     ├→ VIEWING DETAIL MODAL → VIEWING GRID
     │       ├→ SELECTING VERSION → VIEWING DETAIL MODAL
     │       └→ REGENERATING → VIEWING DETAIL MODAL → VIEWING GRID
     └→ COMPLETING STORY → COMPLETION MODAL → CELEBRATING → NAVIGATION
```

## Visual Feedback Summary

Every action provides immediate visual feedback:
- ✅ Buttons show loading spinners
- ✅ Cards update status instantly
- ✅ Selections show purple rings
- ✅ Hover effects on interactive elements
- ✅ Progress indicators during generation
- ✅ Success animations on completion
- ✅ Error states with retry options
- ✅ Smooth transitions between states

This creates a **responsive, engaging, and intuitive user experience**.

