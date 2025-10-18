# Story Selection Page - Visual Guide

This guide provides a visual representation of the Story Selection page layout and interactions.

## 📐 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
│  ┌────────┐  Choose Your Adventure! 🚀                      │
│  │← Back  │  Pick a story and let's start reading!          │
│  └────────┘                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       CONTROLS BAR                           │
│  12 stories available          Sort by: [Recently Added ▼]  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       STORY GRID                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  [IMAGE] │  │  [IMAGE] │  │  [IMAGE] │                 │
│  │          │  │          │  │          │                 │
│  │ Story    │  │ Story    │  │ Story    │                 │
│  │ Title    │  │ Title    │  │ Title    │                 │
│  │          │  │          │  │          │                 │
│  │ [Badge]  │  │ [Badge]  │  │ [Badge]  │                 │
│  │ 📖 7     │  │ 📖 8     │  │ 📖 6     │                 │
│  │ ⭐ 145   │  │ ⭐ 267   │  │ ⭐ 189   │                 │
│  │          │  │          │  │          │                 │
│  │[Read Story]│[Read Story]│[Read Story]                  │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  [IMAGE] │  │  [IMAGE] │  │  [IMAGE] │                 │
│  │   ...    │  │   ...    │  │   ...    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOAD MORE SECTION                         │
│                  [Load More Stories]                         │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Story Card Details

```
┌─────────────────────────────┐
│                             │
│      ┌───────────────┐      │
│      │               │      │
│      │  COVER IMAGE  │      │
│      │   (Lazy Load) │      │
│      │               │      │
│      └───────────────┘      │
│                             │
│  ╔═══════════════════════╗  │
│  ║ The Lost Treasure of  ║  │  ← Title (Large, Bold)
│  ║   Honesty Island      ║  │
│  ╚═══════════════════════╝  │
│                             │
│  ┌───────────────────────┐  │
│  │  About: Honesty       │  │  ← Theme Badge (Colored)
│  └───────────────────────┘  │
│                             │
│  📖 7 scenes    ⭐ 145 reads │  ← Story Info
│                             │
│  ╔═════════════════════════╗│
│  ║  Read Story 📚          ║│  ← Action Button
│  ╚═════════════════════════╝│
│                             │
└─────────────────────────────┘
```

## 🎭 Interaction States

### Normal State
```
┌─────────────────────────┐
│  Story Card             │
│  (White Background)     │
│  Shadow: md             │
└─────────────────────────┘
```

### Hover State
```
┌─────────────────────────┐
│  Story Card             │ ↗️  (Lifts up and scales 105%)
│  (White Background)     │
│  Shadow: xl             │
└─────────────────────────┘
```

### Click/Tap
```
┌─────────────────────────┐
│  Story Card             │ 
│  ➜ Navigate to          │
│     /story-reading      │
└─────────────────────────┘
```

## 🎨 Color Palette

### Background Gradient
```
┌────────────────────────────┐
│ Purple (#f3e8ff)           │
│        ↓                   │
│ Pink   (#fce7f3)           │
│        ↓                   │
│ Blue   (#dbeafe)           │
└────────────────────────────┘
```

### Theme Badge Colors
```
Honesty:        🔵 Blue      #3b82f6
Courage:        🔴 Red       #ef4444
Friendship:     💗 Pink      #ec4899
Kindness:       🟢 Green     #22c55e
Sharing:        🟣 Purple    #a855f7
Teamwork:       🟡 Yellow    #eab308
Gratitude:      🟠 Orange    #f97316
Perseverance:   🟣 Indigo    #6366f1
Respect:        🔷 Teal      #14b8a6
Responsibility: 🔷 Cyan      #06b6d4
```

## 📱 Responsive Layout

### Mobile (< 640px)
```
┌─────────────┐
│   [Story]   │
├─────────────┤
│   [Story]   │
├─────────────┤
│   [Story]   │
├─────────────┤
│   [Story]   │
└─────────────┘
(1 column)
```

### Tablet (640px - 1024px)
```
┌──────────┬──────────┐
│ [Story]  │ [Story]  │
├──────────┼──────────┤
│ [Story]  │ [Story]  │
├──────────┼──────────┤
│ [Story]  │ [Story]  │
└──────────┴──────────┘
(2 columns)
```

### Desktop (> 1024px)
```
┌────────┬────────┬────────┐
│[Story] │[Story] │[Story] │
├────────┼────────┼────────┤
│[Story] │[Story] │[Story] │
├────────┼────────┼────────┤
│[Story] │[Story] │[Story] │
└────────┴────────┴────────┘
(3 columns)
```

## 🎬 Empty State

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            📚📚📚                   │
│          (Large Emoji)              │
│                                     │
│      No Stories Yet!                │
│   (Large, Bold Heading)             │
│                                     │
│  Ask a parent to create a           │
│    wonderful story for you!         │
│     (Friendly Message)              │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## 🔄 Loading States

### Initial Loading
```
┌─────────────────────────────────────┐
│                                     │
│            🔄                       │
│      (Loading Spinner)              │
│                                     │
│      Loading stories...             │
│                                     │
└─────────────────────────────────────┘
```

### Loading More
```
┌─────────────────────────────────────┐
│  [Story Cards Already Visible]      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔄 Loading...              │   │  ← Button with spinner
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🎯 User Flow Diagram

```
      [Story Selection Page]
              ↓
    ┌─────────────────────┐
    │ View Story Grid     │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │ Optional: Change    │ ←─┐
    │ Sort Order          │   │ (Can repeat)
    └─────────────────────┘   │
              ↓                │
    ┌─────────────────────┐   │
    │ Browse Stories      │ ──┘
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │ Click Story Card    │
    └─────────────────────┘
              ↓
    ┌─────────────────────┐
    │ Navigate to         │
    │ /story-reading      │
    └─────────────────────┘
```

## 🎪 Component Hierarchy

```
StorySelectionPage
├── Header
│   ├── Back Button
│   ├── Title
│   └── Subtitle
├── Controls Bar
│   ├── Story Count
│   └── Sort Dropdown
├── Content Area
│   ├── Loading State (conditional)
│   ├── Empty State (conditional)
│   └── Story Grid
│       └── Story Card (repeated)
│           ├── Cover Image
│           ├── Title
│           ├── Theme Badge
│           ├── Info (scenes, reads)
│           └── Read Button
└── Load More Section
    └── Load More Button
```

## 🎨 Typography Hierarchy

```
H1 (Page Title)
├── Size: 4xl (mobile), 5xl (desktop)
├── Weight: Bold
└── Style: Gradient (purple to pink)

H2 (Story Title)
├── Size: 2xl
├── Weight: Bold
└── Color: Gray-900

H3 (Empty State Title)
├── Size: 4xl
├── Weight: Bold
└── Color: Gray-800

Body Text
├── Size: lg (large), base (normal), sm (small)
├── Weight: Normal, Medium, Semibold
└── Color: Gray-600 (secondary), Gray-700 (primary)

Badge Text
├── Size: sm
├── Weight: Semibold
└── Color: White (on colored background)
```

## 📊 Data Flow

```
┌─────────────────────┐
│ API or Mock Data    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Sort Stories        │ ← Based on sortBy state
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Paginate (12/page)  │ ← Based on offset
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Render Cards        │
└─────────────────────┘
```

## 🎮 Interactive Elements

### Sort Dropdown
```
┌──────────────────────────┐
│ Sort by: [Recently Added▼]│ ← Clickable dropdown
└──────────────────────────┘
         ↓ (Opens)
┌──────────────────────────┐
│ ✓ Recently Added         │
│   Most Popular           │
│   A to Z                 │
└──────────────────────────┘
```

### Story Card (Clickable)
```
┌─────────────────────┐
│  Entire Card        │ ← Click anywhere
│  is Clickable       │   navigates to story
│                     │
│  [Read Story]       │ ← Button also works
└─────────────────────┘
```

## 🎨 Accessibility Features

```
┌─────────────────────────────────────┐
│ ✓ Semantic HTML (header, main)     │
│ ✓ ARIA labels on buttons           │
│ ✓ Alt text on images               │
│ ✓ Keyboard navigation              │
│ ✓ Focus indicators                 │
│ ✓ Color contrast (WCAG AA)         │
│ ✓ Screen reader friendly           │
└─────────────────────────────────────┘
```

## 🎯 Key Features Visualization

### Cover Image with Fallback
```
┌─────────────────────┐
│                     │
│  Cover Image        │ ← Uses coverImageUrl
│  (If available)     │   or scene 1 image
│                     │
└─────────────────────┘
```

### Read Count Indicator
```
⭐ 145 reads  ← Shows popularity
📖 7 scenes   ← Shows length
```

### Theme Badge
```
┌──────────────────┐
│ About: Honesty   │ ← Color-coded by theme
└──────────────────┘
     (Blue)
```

This visual guide helps understand the layout, interactions, and design of the Story Selection page at a glance.

