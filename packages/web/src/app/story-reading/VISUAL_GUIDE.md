# Story Reading Page - Visual Guide

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Exit    The Forest of Friendship    [Progress] ↶ A- A+  │ ← Sticky Nav Bar
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┬─────────────────────────────────────┐ │
│  │                  │  Scene 3                            │ │
│  │                  │                                      │ │
│  │                  │  The Safe Journey                   │ │
│  │     [IMAGE]      │                                      │ │
│  │    Luna with     │  Luna carefully carried the bird... │ │
│  │   Bird & Turtle  │  (Large, readable text)             │ │
│  │                  │                                      │ │
│  │   500 x 400px    │  ┌─────────────────────────────┐    │ │
│  │                  │  │ 💙 Take path by stream      │    │ │
│  │                  │  └─────────────────────────────┘    │ │
│  │                  │  ┌─────────────────────────────┐    │ │
│  │                  │  │ 💚 Take path by meadow      │    │ │
│  └──────────────────┴──└─────────────────────────────┘────┘ │
│          45%                      55%                         │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Bar Components

```
┌────────────────────────────────────────────────────────────────┐
│  [← Exit]  Story Title    Scene 5/18 [████████░░] 45%  ↶ A- A+ │
│     │          │               │          │        │     │  └─── Font controls
│     │          │               │          │        │     └────── Back button
│     │          │               │          │        └──────────── Font size
│     │          │               │          └───────────────────── Progress %
│     │          │               └──────────────────────────────── Scene count
│     │          └──────────────────────────────────────────────── Story title
│     └─────────────────────────────────────────────────────────── Exit to home
└────────────────────────────────────────────────────────────────┘
```

## Choice Buttons (Multiple Options)

```
┌─────────────────────────────────────────────┐
│   What should happen next?                  │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │ 💙 Accept Bruno's help            → │   │ ← Blue (Primary)
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ 💚 Try to do it alone             → │   │ ← Green (Secondary)
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Single Choice (Continue Button)

```
┌─────────────────────────────────────────────┐
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │        Continue               →      │  │ ← Pulse animation
│  └──────────────────────────────────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

## Bad Ending Modal

```
                  (Overlay: 50% opacity black)
            ┌─────────────────────────────────┐
            │                                  │
            │            💭                    │
            │                                  │
            │  Hmm, maybe there's a better    │
            │          way?                    │
            │                                  │
            │  Good friends listen carefully   │
            │  to understand what others need. │
            │  Paying attention to details     │
            │  shows you care!                 │
            │                                  │
            │  ┌──────────────────────────┐   │
            │  │   🔄 Try Again!          │   │
            │  └──────────────────────────┘   │
            │                                  │
            └─────────────────────────────────┘
```

## Good Ending Celebration Modal

```
              (Confetti animation: 🎉⭐💖🌟✨)
        ┌───────────────────────────────────────┐
        │                                        │
        │              🎊                        │
        │                                        │
        │       Amazing! You did it!             │
        │                                        │
        │   You made wonderful choices and       │
        │      completed the story!              │
        │                                        │
        │  ┌──────────────────────────────────┐ │
        │  │  What You Learned:                │ │
        │  │                                   │ │
        │  │  True friends are patient,        │ │
        │  │  listen carefully, and aren't     │ │
        │  │  afraid to help each other.       │ │
        │  └──────────────────────────────────┘ │
        │                                        │
        │  ┌───────────────┐ ┌───────────────┐ │
        │  │ 🔄 Read Again │ │ 📚 Choose     │ │
        │  │               │ │    Another    │ │
        │  └───────────────┘ └───────────────┘ │
        │                                        │
        └───────────────────────────────────────┘
```

## Progress Bar States

### Empty (0%)
```
┌──────────────────────────────────────┐
│                                       │
└──────────────────────────────────────┘
```

### In Progress (45%)
```
┌──────────────────────────────────────┐
│████████████████░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────────────┘
```

### Complete (100%)
```
┌──────────────────────────────────────┐
│██████████████████████████████████████│
└──────────────────────────────────────┘
```

## Responsive Layout

### Desktop/Tablet (lg+)
```
┌────────────────────────────────────┐
│  IMAGE (45%)  │  TEXT + CHOICES    │
│               │     (55%)          │
└────────────────────────────────────┘
```

### Mobile (<lg)
```
┌────────────────────┐
│      IMAGE         │
├────────────────────┤
│   TEXT + CHOICES   │
└────────────────────┘
```

## Color Scheme

### Backgrounds
- **Page**: Gradient purple-100 → pink-50 → blue-100
- **Book Card**: White with shadow-2xl
- **Image Area**: Gradient purple-200 → pink-200
- **Celebration**: Gradient yellow-100 → pink-100 → purple-100

### Buttons
```
Primary (Blue):     bg-blue-500 → bg-blue-600 (hover)
Secondary (Green):  bg-green-500 → bg-green-600 (hover)
Tertiary (Yellow):  bg-yellow-500 → bg-yellow-600 (hover)
```

### Progress Bar
```
Container: bg-gray-200
Fill:      gradient purple-500 → pink-500
```

## Animation States

### Scene Transition
```
Forward:  opacity 0→1, translateX(20px)→0
Backward: opacity 0→1, translateX(-20px)→0
Duration: 500ms ease-out
```

### Choice Button Hover
```
Transform: scale(1) → scale(1.05)
Shadow:    shadow-lg → shadow-xl
Duration:  200ms
```

### Celebration Confetti
```
Start:    top: -20px, opacity: 1, rotate: 0deg
End:      top: 100vh, opacity: 0, rotate: 360deg
Duration: 3-5s (random), linear
```

## Typography Scale

### Headings
- **Story Title** (Nav): 20px (xl), bold
- **Scene Title**: 32-48px (3xl-4xl), bold
- **Modal Title**: 24-32px (2xl-4xl), bold

### Body Text
- **Story Text**: 20px (default, adjustable 16-32px)
- **Line Height**: 1.8
- **Choice Text**: 18px (lg)

### Small Text
- **Scene Number Badge**: 14px (sm)
- **Progress Text**: 14px (sm)

## Interactive Elements

### Button Sizes
```
Exit Button:      Small (px-3 py-1.5)
Back Button:      Small (px-3 py-1.5)
Font Controls:    Custom (p-2)
Choice Buttons:   Large (px-6 py-6)
Continue Button:  Large (px-6 py-6)
Modal Buttons:    Large (custom py-6)
```

### Touch Targets
- All buttons: minimum 44px × 44px
- Choice buttons: minimum 60px height
- Generous padding for easy tapping

## State Indicators

### Loading Story
```
┌─────────────────────────────────────┐
│                                      │
│         [Spinner XLarge]             │
│                                      │
│      Loading your story...           │
│                                      │
└─────────────────────────────────────┘
```

### Loading Image
```
┌─────────────────────┐
│   [Spinner Large]   │ ← Overlaid on image area
└─────────────────────┘
```

### Error State
```
┌─────────────────────────────────────┐
│                                      │
│              😕                      │
│                                      │
│   Oops! Something went wrong         │
│                                      │
│   We couldn't load the story.        │
│   Please try again.                  │
│                                      │
│   ┌──────────────────────┐          │
│   │   Go Back Home       │          │
│   └──────────────────────┘          │
│                                      │
└─────────────────────────────────────┘
```

## Node Type Badges

### Scene Number Badge
```
┌──────────────┐
│   Scene 5    │ ← Purple background
└──────────────┘
```

### Good Ending Indicator
```
     🎉
   (bounce)
```

### Bad Ending Indicator
```
     😔
  (static)
```

## Accessibility Features

- ✅ All buttons have aria-labels
- ✅ Loading states have aria-busy
- ✅ High contrast text (WCAG AA)
- ✅ Keyboard navigation support
- ✅ Focus visible on all interactive elements
- ✅ Semantic HTML structure
- ✅ Alt text on images
- ✅ Clear visual hierarchy

