# Character Assignment Page - Visual Flow Guide

## 📸 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER SECTION                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Choose Your Characters                                   │  │
│  │  Select preset characters for each role in your story... │  │
│  │                                                           │  │
│  │              [📊 3 / 4 Characters Assigned ✓]            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      MAIN CONTENT AREA                          │
│                                                                 │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │  CHARACTER         │  │  ROLE ASSIGNMENT AREA            │  │
│  │  GALLERY (40%)     │  │  (60%)                           │  │
│  │                    │  │                                  │  │
│  │  ┌──────┬──────┐  │  │  ┌────────────────────────────┐ │  │
│  │  │ Char │ Char │  │  │  │ Protagonist                │ │  │
│  │  │  1   │  2   │  │  │  │ A brave young hero...      │ │  │
│  │  │[IMG] │[IMG] │  │  │  │                            │ │  │
│  │  └──────┴──────┘  │  │  │ [Assigned: Amelia]         │ │  │
│  │                    │  │  │ [Remove] [Change]          │ │  │
│  │  ┌──────┬──────┐  │  │  └────────────────────────────┘ │  │
│  │  │ Char │ Char │  │  │                                  │  │
│  │  │  3   │  4   │  │  │  ┌────────────────────────────┐ │  │
│  │  │[IMG] │[IMG] │  │  │  │ Best Friend                │ │  │
│  │  └──────┴──────┘  │  │  │ The protagonist's loyal... │ │  │
│  │                    │  │  │                            │ │  │
│  │  ┌──────┬──────┐  │  │  │ [Click to assign]          │ │  │
│  │  │ Char │ Char │  │  │  │                            │ │  │
│  │  │  5   │  6   │  │  │  └────────────────────────────┘ │  │
│  │  │[IMG] │[IMG] │  │  │                                  │  │
│  │  └──────┴──────┘  │  │  ┌────────────────────────────┐ │  │
│  │        ...         │  │  │ Wise Helper                │ │  │
│  └────────────────────┘  │  │ A mentor figure who...     │ │  │
│     (Scrollable)         │  │                            │ │  │
│                          │  │ [Assigned: Joseph]         │ │  │
│                          │  │ [Remove] [Change]          │ │  │
│                          │  └────────────────────────────┘ │  │
│                          │                                  │  │
│                          │  ┌────────────────────────────┐ │  │
│                          │  │ Antagonist                 │ │  │
│                          │  │ The challenge or...        │ │  │
│                          │  │                            │ │  │
│                          │  │ [Click to assign]          │ │  │
│                          │  │                            │ │  │
│                          │  └────────────────────────────┘ │  │
│                          └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ASSIGNMENT PREVIEW                           │
│  (Shown when all 4 roles are assigned)                         │
│                                                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐              │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │              │
│  │ Amelia │  │  John  │  │ Joseph │  │  Ava   │              │
│  │Protag. │  │Friend  │  │Helper  │  │Antagon.│              │
│  └────────┘  └────────┘  └────────┘  └────────┘              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION SECTION                           │
│                                                                 │
│  [← Back to Story Editor]        [Next: Background Setup →]    │
│                                             (Disabled if incomplete)
└─────────────────────────────────────────────────────────────────┘
```

## 🎬 Interaction Flow

### Flow 1: Click-to-Assign Method

```
Step 1: User clicks on a character
┌─────────────┐
│   Amelia    │  ← Click!
│   [IMAGE]   │  → Blue ring appears (selected)
│   ✓ Human   │
└─────────────┘

Step 2: User clicks on a role slot
┌────────────────────────────────┐
│ Protagonist                    │  ← Click!
│ A brave young hero...          │
│                                │
│ [Click to assign selected]     │  → Character assigned!
└────────────────────────────────┘

Step 3: Assignment complete
┌────────────────────────────────┐
│ Protagonist                    │  ✓ Assigned
│ A brave young hero...          │
│                                │
│ ┌──────┐ Amelia                │
│ │[IMG] │ A curious and brave..│
│ └──────┘                       │
│ [Remove] [Change]              │
└────────────────────────────────┘
```

### Flow 2: Drag-and-Drop Method

```
Step 1: User starts dragging a character
┌─────────────┐
│   John      │  ← Hold and drag
│   [IMAGE]   │  → Becomes semi-transparent
│   ✓ Human   │
└─────────────┘
      ↓
      ↓ (Dragging)
      ↓

Step 2: User hovers over role slot
┌────────────────────────────────┐
│ Best Friend               ⚡   │  ← Hover
│ The protagonist's loyal...     │
│                                │  → Blue highlight appears
│ [Drag a character here]        │  → Ready to drop!
└────────────────────────────────┘

Step 3: User drops character
┌────────────────────────────────┐
│ Best Friend                    │  ✓ Assigned
│ The protagonist's loyal...     │
│                                │
│ ┌──────┐ John                  │
│ │[IMG] │ A brave and...        │
│ └──────┘                       │
│ [Remove] [Change]              │
└────────────────────────────────┘
```

## 🎨 Visual States

### Character Card States

#### 1. Default State
```
┌─────────────┐
│   Amelia    │
│   [IMAGE]   │  ← White background
│   ✓ Human   │  ← Subtle shadow
└─────────────┘
```

#### 2. Hover State (Available)
```
┌─────────────┐
│   Amelia    │  ⬆ Lifts up slightly
│   [IMAGE]   │  ← Larger shadow
│   ✓ Human   │  ← Pointer cursor
└─────────────┘
```

#### 3. Selected State
```
┌═════════════┐  ← Blue ring (2px)
║   Amelia    ║
║   [IMAGE]   ║
║   ✓ Human   ║
└═════════════┘
```

#### 4. Assigned State
```
┌─────────────┐
│   Amelia    │  ← 50% opacity
│   [IMAGE]   │  ← "✓ Assigned" badge
│   ✓ Human   │  ← No-drop cursor
└─────────────┘
```

#### 5. Dragging State
```
┌- - - - - - -┐  ← Dashed border
:   Amelia    :  ← Semi-transparent
:   [IMAGE]   :
:   ✓ Human   :
└- - - - - - -┘
```

### Role Card States

#### 1. Empty Slot
```
┌────────────────────────────────┐
│ Best Friend                    │
│ The protagonist's loyal...     │
│                                │
│    ╔════════════════════╗      │
│    ║       [👤]         ║      │  ← Dashed border
│    ║  Click to select   ║      │  ← Placeholder icon
│    ║   or drag here     ║      │  ← Gray background
│    ╚════════════════════╝      │
└────────────────────────────────┘
```

#### 2. Hover with Character Selected
```
┌────────────────────────────────┐
│ Best Friend                    │
│ The protagonist's loyal...     │
│                                │
│    ╔════════════════════╗      │
│    ║       [👤]         ║      │  ← Blue background
│    ║ Click to assign    ║      │  ← Blue border
│    ║  selected character║      │  ← Pointer cursor
│    ╚════════════════════╝      │
└────────────────────────────────┘
```

#### 3. Drag Hover State
```
┌════════════════════════════════┐  ← Blue ring (4px)
║ Best Friend               ⚡   ║  ← Scales up 105%
║ The protagonist's loyal...     ║
║                                ║
║    ╔════════════════════╗      ║  ← Blue highlight
║    ║    Drop here! 📥   ║      ║
║    ╚════════════════════╝      ║
└════════════════════════════════┘
```

#### 4. Assigned State
```
┌────────────────────────────────┐
│ Best Friend              ✓     │  ← Green checkmark
│ The protagonist's loyal...     │
│                                │
│ ┌──────────┐                   │
│ │  [IMAGE] │ John              │  ← Character image
│ │          │ A brave and...    │  ← Character name
│ └──────────┘                   │  ← Character description
│                                │
│ [Remove]      [Change]         │  ← Action buttons
└────────────────────────────────┘
```

## 📊 Progress Indicator States

### Incomplete (0/4)
```
┌─────────────────────────────────┐
│  👥  0 / 4 Characters Assigned  │
└─────────────────────────────────┘
```

### Partial (2/4)
```
┌─────────────────────────────────┐
│  👥  2 / 4 Characters Assigned  │
└─────────────────────────────────┘
```

### Complete (4/4)
```
┌─────────────────────────────────┐
│  👥  4 / 4 Characters Assigned ✓│  ← Green checkmark
└─────────────────────────────────┘
```

## 🎯 Button States

### Next Button - Disabled
```
┌─────────────────────────────────┐
│  Next: Background Setup →       │  ← Gray color
└─────────────────────────────────┘  ← 50% opacity
                                      ← No-drop cursor
```

### Next Button - Enabled
```
┌─────────────────────────────────┐
│  Next: Background Setup →       │  ← Blue color
└─────────────────────────────────┘  ← Full opacity
                                      ← Pointer cursor
```

### Next Button - Loading
```
┌─────────────────────────────────┐
│  ⟳ Saving...                    │  ← Spinner icon
└─────────────────────────────────┘  ← Disabled state
```

## ⚠️ Error States

### Duplicate Assignment Error
```
┌─────────────────────────────────────────────────────┐
│  ⚠️  This character is already assigned to another  │
│      role. Please choose a different character.     │
└─────────────────────────────────────────────────────┘
         (Disappears after 3 seconds)
```

### Incomplete Assignment Error
```
┌─────────────────────────────────────────────────────┐
│  ⚠️  Please assign all roles before continuing      │
└─────────────────────────────────────────────────────┘
```

## 🎊 Success States

### All Assigned - Preview
```
┌─────────────────────────────────────────────────────┐
│            Your Story Characters                    │
│                                                     │
│   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐      │
│   │[IMG] │   │[IMG] │   │[IMG] │   │[IMG] │      │
│   │Amelia│   │ John │   │Joseph│   │ Ava  │      │
│   └──────┘   └──────┘   └──────┘   └──────┘      │
│   Protagonist  Friend    Helper   Antagonist      │
└─────────────────────────────────────────────────────┘
```

## 📱 Responsive Layouts

### Mobile View (< 640px)
```
┌─────────────────────┐
│      HEADER         │
│  ┌───────────────┐  │
│  │  Progress     │  │
│  └───────────────┘  │
└─────────────────────┘

┌─────────────────────┐
│  CHARACTER GALLERY  │
│  ┌───────┐          │
│  │ Char  │          │  ← Single column
│  │ [IMG] │          │
│  └───────┘          │
│  ┌───────┐          │
│  │ Char  │          │
│  │ [IMG] │          │
│  └───────┘          │
│       ...            │
└─────────────────────┘

┌─────────────────────┐
│  ROLE ASSIGNMENT    │
│  ┌───────────────┐  │
│  │ Protagonist   │  │  ← Full width
│  │ [Slot]        │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Friend        │  │
│  │ [Slot]        │  │
│  └───────────────┘  │
│       ...            │
└─────────────────────┘

┌─────────────────────┐
│  NAVIGATION         │
│  [Back]             │  ← Stacked
│  [Next]             │
└─────────────────────┘
```

### Desktop View (> 1024px)
```
┌─────────────────────────────────────────────┐
│               HEADER                        │
└─────────────────────────────────────────────┘

┌────────────────┬────────────────────────────┐
│   GALLERY      │   ROLE ASSIGNMENT          │
│   (40%)        │   (60%)                    │
│                │                            │
│   [Chars]      │   [Role 1]                 │
│   [Chars]      │   [Role 2]                 │
│   [Chars]      │   [Role 3]                 │
│   [Chars]      │   [Role 4]                 │
└────────────────┴────────────────────────────┘

┌─────────────────────────────────────────────┐
│     [PREVIEW]                               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│   [Back]                        [Next]      │
└─────────────────────────────────────────────┘
```

## 🎭 Animation Timings

- **Hover Effects:** 200ms ease-in-out
- **Selection Change:** 200ms ease
- **Drag Start:** Immediate
- **Drop Animation:** 200ms ease
- **Error Display:** Fade in 200ms
- **Error Dismiss:** Fade out 200ms after 3s
- **Loading Spinner:** Continuous rotation
- **Button State:** 200ms ease

## 🎨 Color Code Reference

- **Selected:** `#3B82F6` (blue-500)
- **Success:** `#10B981` (green-500)
- **Error:** `#EF4444` (red-500)
- **Hover:** `#2563EB` (blue-600)
- **Disabled:** 50% opacity
- **Background:** Gradient purple-pink-blue

---

This visual guide helps understand the complete user interface and interaction patterns of the Character Assignment Page.

