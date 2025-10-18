# Visual Guide - Story Setup Feature

## Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE (/)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         🎨 Fable Tales                               │  │
│  │  Create Interactive Stories for Your Children        │  │
│  │  ─────────────────────────────────────────────────  │  │
│  │                                                       │  │
│  │  ┌────────────────┐    ┌────────────────┐          │  │
│  │  │  👨‍👩‍👧‍👦           │    │  📚            │          │  │
│  │  │ Parent Mode    │    │ Child Mode     │          │  │
│  │  │ [Create Story] │    │ [Coming Soon]  │          │  │
│  │  └────────────────┘    └────────────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    [Click Parent Mode]
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 STORY SETUP PAGE (/story-setup)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Create Your Magical Story                     │  │
│  │  AI will create a personalized interactive story... │  │
│  │  ─────────────────────────────────────────────────  │  │
│  │                                                       │  │
│  │  ℹ️ Your story will include:                         │  │
│  │    • Up to 4 unique characters                       │  │
│  │    • 15-20 interactive scenes                        │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Lesson or Moral *                              │ │  │
│  │  │ ┌────────────────────────────────────────────┐ │ │  │
│  │  │ │ e.g., "Honesty is important"               │ │ │  │
│  │  │ └────────────────────────────────────────────┘ │ │  │
│  │  │ [27 / 200 characters]                          │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Preferred Theme                                │ │  │
│  │  │ ┌────────────────────────────────────────────┐ │ │  │
│  │  │ │ e.g., "Space adventure"                    │ │ │  │
│  │  │ └────────────────────────────────────────────┘ │ │  │
│  │  │ [0 / 150 characters]                           │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Desired Story Format                           │ │  │
│  │  │ ┌────────────────────────────────────────────┐ │ │  │
│  │  │ │ e.g., "Aesop's fable style"                │ │ │  │
│  │  │ └────────────────────────────────────────────┘ │ │  │
│  │  │ [0 / 150 characters]                           │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │       [Generate Story] (Blue Button)         │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  📝 Need inspiration? Try these examples:           │  │
│  │  ┌──────────────┐ ┌──────────────┐                 │  │
│  │  │ Honesty      │ │ Sharing      │                 │  │
│  │  │ Story        │ │ Story        │                 │  │
│  │  └──────────────┘ └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                   [Click Generate Story]
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    LOADING OVERLAY                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                  ⏳ [Spinning Animation]             │  │
│  │                                                       │  │
│  │          Creating your magical story...              │  │
│  │                                                       │  │
│  │   Our AI is crafting a personalized story just      │  │
│  │   for you. This usually takes about 30 seconds.     │  │
│  │                                                       │  │
│  │         ✨ Please wait while magic happens...        │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                      [API Success Response]
                              ↓
┌─────────────────────────────────────────────────────────────┐
│          STORY TREE PAGE (/story-tree/story_456)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Story Tree Editor                       │  │
│  │  ─────────────────────────────────────────────────  │  │
│  │                                                       │  │
│  │  Story ID: story_456                                 │  │
│  │                                                       │  │
│  │  Story tree editing interface coming soon...         │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Error States

### Validation Error
```
┌──────────────────────────────────────────────────────┐
│ Lesson or Moral *                                    │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Hi                                               │ │
│ └──────────────────────────────────────────────────┘ │
│ ⚠️ Lesson must be at least 5 characters long         │
└──────────────────────────────────────────────────────┘
```

### API Error
```
┌──────────────────────────────────────────────────────┐
│ ❌ Error                                             │
│ Unable to connect to server. Please check your       │
│ internet connection.                                  │
└──────────────────────────────────────────────────────┘
```

## Component States

### Input Component States

#### Normal State
```
┌──────────────────────────────────────────────────────┐
│ Label Text                                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ User input here...                               │ │
│ └──────────────────────────────────────────────────┘ │
│ Helper text appears here                             │
└──────────────────────────────────────────────────────┘
```

#### Focus State
```
┌──────────────────────────────────────────────────────┐
│ Label Text                                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ User input here... [Blue border + ring]          │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

#### Error State
```
┌──────────────────────────────────────────────────────┐
│ Label Text *                                         │
│ ┌──────────────────────────────────────────────────┐ │
│ │ [Red border]                                     │ │
│ └──────────────────────────────────────────────────┘ │
│ ⚠️ Error message in red                              │
└──────────────────────────────────────────────────────┘
```

#### With Character Counter
```
┌──────────────────────────────────────────────────────┐
│ Label Text                                           │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Some text content here                           │ │
│ └──────────────────────────────────────────────────┘ │
│                              [22 / 200 characters]  │
└──────────────────────────────────────────────────────┘
```

### Button Component States

#### Primary Button (Normal)
```
┌──────────────────────────────────────┐
│      Generate Story                  │
│ [Blue bg, white text, shadow]        │
└──────────────────────────────────────┘
```

#### Primary Button (Hover)
```
┌──────────────────────────────────────┐
│      Generate Story                  │
│ [Darker blue, larger shadow]         │
└──────────────────────────────────────┘
```

#### Primary Button (Loading)
```
┌──────────────────────────────────────┐
│  ⏳ Creating Your Story...           │
│ [Disabled, spinner icon]             │
└──────────────────────────────────────┘
```

### Example Cards

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ Honesty Story           │  │ Sharing Story           │
│ ─────────────────────── │  │ ─────────────────────── │
│ Magical forest •        │  │ Space adventure •       │
│ Aesop's fable style     │  │ Sci-fi style            │
│ [Hover: blue border]    │  │ [Hover: blue border]    │
└─────────────────────────┘  └─────────────────────────┘
```

## Mobile Responsive Layouts

### Mobile View (< 640px)
```
┌──────────────────┐
│   Create Your    │
│  Magical Story   │
├──────────────────┤
│  ℹ️ Info Card    │
│                  │
├──────────────────┤
│  Lesson Field    │
│  (Full width)    │
├──────────────────┤
│  Theme Field     │
│  (Full width)    │
├──────────────────┤
│  Format Field    │
│  (Full width)    │
├──────────────────┤
│ [Generate Story] │
│  (Full width)    │
├──────────────────┤
│  Example 1       │
│  (Full width)    │
├──────────────────┤
│  Example 2       │
│  (Full width)    │
└──────────────────┘
```

### Desktop View (> 1024px)
```
┌──────────────────────────────────────────────────┐
│            Create Your Magical Story             │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │            ℹ️ Info Card                    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Lesson Field                              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Theme Field                               │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Format Field                              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         [Generate Story]                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Example 1 │  │Example 2 │  │Example 3 │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└──────────────────────────────────────────────────┘
```

## Color Palette

```
Background Gradient:
  from-blue-50 → via-purple-50 → to-pink-50

Primary Colors:
  Blue:    #2563eb (buttons, accents)
  Purple:  #9333ea (gradient)
  Pink:    #ec4899 (gradient)

Neutral Colors:
  Gray-900: #111827 (headings)
  Gray-600: #4b5563 (body text)
  Gray-500: #6b7280 (helper text)
  Gray-300: #d1d5db (borders)
  White:    #ffffff (cards, inputs)

Status Colors:
  Success: #10b981 (green)
  Error:   #ef4444 (red)
  Warning: #f59e0b (yellow)
  Info:    #3b82f6 (blue)
```

## Typography Scale

```
Heading 1 (h1):
  text-4xl md:text-5xl
  font-bold
  text-gray-900

Heading 2 (h2):
  text-2xl md:text-3xl
  font-bold
  text-gray-900

Heading 3 (h3):
  text-xl md:text-2xl
  font-semibold
  text-gray-900

Body Text:
  text-base md:text-lg
  text-gray-600

Small Text:
  text-sm
  text-gray-500

Label Text:
  text-sm
  font-medium
  text-gray-700
```

## Spacing Guidelines

```
Section Padding:
  Mobile:  p-4 (16px)
  Desktop: p-8 (32px)

Element Spacing:
  Small gap:  gap-2 (8px)
  Medium gap: gap-4 (16px)
  Large gap:  gap-6 (24px)
  XL gap:     gap-8 (32px)

Card Padding:
  Mobile:  p-6 (24px)
  Desktop: p-8 (32px)

Margins:
  Between sections: mb-6 md:mb-8
  Between elements: mb-4
  Between inputs:   mb-6
```

## Animation Timings

```
Button Hover:
  transition-all duration-200

Loading Spinner:
  animate-spin (continuous)

Toast Notifications:
  Enter: 300ms ease-out
  Exit:  300ms ease-in

Form Validation:
  Error appear: 200ms
  Error fade:   200ms
```

## Icons Used

```
Info Icon:        ℹ️ (info circle)
Error Icon:       ⚠️ (exclamation triangle)
Success Icon:     ✅ (checkmark circle)
Loading Icon:     ⏳ (spinning circle)
Parent Mode:      👨‍👩‍👧‍👦 (family emoji)
Child Mode:       📚 (books emoji)
Features:         🎨 🌳 📖
Magic:            ✨ (sparkles)
```

## Accessibility Features

```
Keyboard Navigation:
  Tab Order:
    1. Lesson input
    2. Theme textarea
    3. Format textarea
    4. Generate button
    5. Example buttons (4x)

Screen Reader:
  - All inputs have labels
  - Error messages linked via aria-describedby
  - Required fields marked with aria-required
  - Loading states have aria-busy
  - Error alerts have role="alert"

Focus Indicators:
  - Blue ring: focus:ring-2 focus:ring-blue-500
  - Ring offset: focus:ring-offset-2
  - Visible on all interactive elements
```

## Loading States Timeline

```
0s   │ User clicks "Generate Story"
     │ ↓
0.1s │ Loading overlay fades in
     │ ↓
0.2s │ Spinner animation starts
     │ Form becomes disabled
     │ ↓
     │ ... API call in progress ...
     │ (estimated 30 seconds)
     │ ↓
30s  │ API response received
     │ ↓
30.1s│ Loading overlay fades out
     │ ↓
30.2s│ Navigation to story tree page
```

## Error Handling Flow

```
Form Submit
    ↓
Client-side Validation
    ├─ PASS ─→ API Call
    │           ├─ SUCCESS ─→ Navigate to tree
    │           ├─ NETWORK ERROR ─→ Show error + retry
    │           └─ API ERROR ─→ Show error + retry
    │
    └─ FAIL ─→ Show inline errors
               (lesson too short, etc.)
```

## Example Prompt Data

```javascript
Honesty Story:
  lesson: "Honesty is always the best policy"
  theme: "Magical forest with talking animals"
  format: "Aesop's fable style with clear moral"

Sharing Story:
  lesson: "Sharing makes everyone happier"
  theme: "Space station with friendly aliens"
  format: "Science fiction adventure"

Courage Story:
  lesson: "Courage means facing your fears"
  theme: "Medieval kingdom with dragons"
  format: "Classic hero's journey"

Friendship Story:
  lesson: "True friends support each other"
  theme: "School playground and neighborhood"
  format: "Everyday life, realistic story"
```

---

This visual guide helps understand the UI/UX design decisions and provides a reference for maintaining consistent styling throughout the application.

