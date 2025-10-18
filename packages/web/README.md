## 1. **Home/Role Selection Page**
**Features:**
- "Parent Mode" / "Child Mode" selection buttons
- Simple explanatory text
- (Optional) Existing story list

---

## 2. **Parent Mode - Story Setup Page**
**Features:**

### Moral Input
- **"Moral you want to convey to your child"** text input field
- Example placeholder: "Lying is bad", "You should help your friends", etc.

### Story Characteristics Input
- **Number of Characters**: Fixed guidance text ("Up to 4 characters will appear")
  
- **Preferred Theme** (free input):
  - Text input field
  - Examples: "Space adventure", "Forest animals", "Ocean exploration", "Magic school", etc.
  
- **Desired Story Format** (free input):
  - Text input field
  - Examples: "Good triumphs over evil", "Aesop's fable style", "Coming-of-age story", "Friendship story", etc.

### Bottom Buttons
- **"Generate Story"** button (large button, emphasized)
- Loading state display (AI is generating story...)

---

## 3. **Parent Mode - Story Tree Editing Page**
**Features:**

### Tree Structure Visualization
- Node-based flowchart
- **Visual distinction by node type**:
  - Start node
  - Regular scene node
  - Choice branch point node
  - Good ending node (green/star icon)
  - Bad ending node (red/X icon)
- Zoom in/out, drag to move screen

### Node Editing (side panel when node is clicked)
- **Scene Information**:
  - Scene number and title (editable)
  - Story text (editable)
  - Background location tag (e.g., "forest", "village", "castle", etc.) - used later for background generation
  
- **Choice Management**:
  - Choice text input/modification
  - Next scene connection setup
  - "Correct choice" / "Wrong choice" tag
  - Add/delete choice buttons
  
- **Node Operations**:
  - Delete node
  - Add new node
  - Add branch

### Overall Controls
- **"Finalize Story Structure"** button → Go to character setup page
- Auto-save
- Node count display

---

## 4. **Parent Mode - Character Role Assignment Page**
**Features:**

### Character Gallery
- **Pre-made character list** (simple grid):
  - Character image (thumbnail)
  - Character name
  - About 10-20 characters (not too many)

### Role Matching
- **Character roles extracted from story** (up to 4):
  - E.g., "Protagonist", "Friend", "Helper", "Antagonist", etc.
  - Empty slots for each role (4 slots)
  
- **Character Assignment Method**:
  - Click character → Drag and drop to role slot
  - Or click role slot → Select character
  - Preview assigned character
  - Unassign/change button

### Bottom Buttons
- **"Next: Background Setup"** button
- "Go to Previous Step" button

---

## 5. **Parent Mode - Background Setup and Generation Page** ⭐ Newly Added!
**Features:**

### Background Location List
- **Locations automatically extracted from story**:
  - Identify background locations appearing through scene analysis
  - E.g., "Magic forest", "Kingdom castle", "Beach", "Village square", etc.
  - Display each location in card format

### Each Background Card
- **Location Information**:
  - Location name (editable)
  - Display scene numbers where this location appears (e.g., "Used in Scenes 1, 3, 7, 15")
  
- **Background Description Input**:
  - Text input field
  - Description for AI to reference when generating background
  - E.g., "Bright forest with sunlight", "Inside a dark cave", "Splendid throne room"
  
- **Background Image Area**:
  - Before generation: Display "Waiting for background generation"
  - After generation: Display background image
  - "Regenerate" button
  - Generated version history (small thumbnails)

### Overall Controls
- **"Generate All Backgrounds"** button (generate all backgrounds at once)
- **"Add Background"** button (manually add background location)
- Individual "Generate" button for each background

### After Completion
- **"Next: Final Image Generation"** button (activated when all backgrounds are generated)

---

## 6. **Parent Mode - Final Scene Image Generation and Management Page**
**Features:**

### Loading Screen (Promise.all processing)
- **Simple loading display**:
  - "Generating all scene images..." message
  - Animation spinner or cute loading graphic
  - (Optional) Friendly message like "Please wait a moment ☕"

### Scene-by-Scene Image Management (grid layout)
Each scene card includes:

- **Scene Information**:
  - Scene number and title
  - Story text preview (abbreviated)
  - Display used characters (small icons)
  - Display used background
  
- **Final Composite Image Area**:
  - Display currently selected image
  - "Character + background" composite completed image
  
- **Version History**:
  - All generated image version thumbnails (horizontal scroll at bottom)
  - Click each version → Select as current image
  - Display generation time
  
- **Action Buttons**:
  - **"Regenerate"** button (regenerate only this scene)
  - Image zoom view button

### Overall Controls
- **Filter/Sort**: 
  - By scene number
  - (Optional) By background, by character
  
- **Batch Regeneration**: 
  - Select multiple scenes with checkboxes
  - "Regenerate Selected Scenes" button
  
- **"Story Complete!"** button (activated when all scenes have images)

### Completion Screen
- Congratulations message and animation
- **"Preview in Child Mode"** button
- **"Generate Share Link"** button (optional)
- **"Continue Editing"** button

---

## 7. **Child Mode - Story Selection Page** (Optional)
**Features:**
- Completed story list (card format)
- Each story: Cover image + title + moral tag
- Click → Start reading

---

## 8. **Child Mode - Story Reading Page** ⭐ Core!
**Features:**

### Layout (book format)
- **Left Side (40-50%)**: 
  - Current scene's final composite image (character + background)
  - Smooth page turn animation
  
- **Right Side (50-60%)**:
  - **Top**: Story text 
    - Large font (adjustable)
    - Highly readable typeface
  - **Bottom**: Choice area

### Choice Interaction
- **1 Choice**: Single "Next" button (center-aligned, large button)
- **2+ Choices**: 
  - Large buttons in different colors for each
  - Add icons
- Click animation on selection

### Bad Ending Handling
- **Upon Reaching**:
  - Screen effect (blur, etc.)
  - "Oops! Shall we think again?" message
  
- **Return Feature**:
  - "Choose Again" button
  - Auto-navigate to previous choice scene
  - Smooth transition

### Good Ending Handling
- **Upon Reaching**:
  - Congratulations animation (stars, hearts, etc.)
  - "Well done! That was an excellent choice!" message
  - **Highlight moral message**
  
- **Exit Options**:
  - "Read from Beginning" button
  - "View Other Stories" button

### Additional Features
- **Top UI**:
  - Progress bar (simple progress indicator)
  - Scene counter (e.g., "5/18")
  - Exit button
  
- **Reading Assistance** (optional):
  - 🔊 TTS voice reading
  - Background music ON/OFF
  - Font size adjustment

---

## 9. **Common - Story Library Page**
**Features:**
- List of created stories
- For each story:
  - Cover image, title, creation date
  - Moral tag
  - Status (completed/editing)
  - Read count
- **Available Actions**:
  - Edit story (tree structure, characters, backgrounds, scenes)
  - Delete story (single or bulk)
  - Share completed stories (generates shareable link)
- **Filters & Sort**:
  - Filter by status (All / Completed / Drafts)
  - Sort by: Recently Updated, Title, Most Read
- **View Modes**: Grid or List view

---

## 📋 Overall Workflow Summary

```
Parent Mode:
1. Story setup input (moral + theme/format)
   ↓
2. AI generates story tree
   ↓
3. Edit story tree (adjust choices, branches)
   ↓
4. Assign character roles (up to 4)
   ↓
5. Background setup and generation (background image for each location)
   ↓
6. Final scene image generation (character + background composite)
   ↓
7. Complete!

Child Mode:
1. Select story
   ↓
2. Read (progress by following choices)
   ↓
3. Reach Good/Bad Ending
```

---

## MVP Development Priority

### Phase 1 (Essential - for hackathon demo)
1. ✅ Story setup page (#2)
2. ✅ Story tree editing page (#3) - basic features
3. ✅ Character role assignment (#4)
4. ✅ **Background setup and generation (#5) - Newly added!**
5. ✅ Final image generation and management (#6)
6. ✅ Child reading page (#8)

### Phase 2 (if time permits)
- Home/role selection (#1)
- Story selection page (#7)
- Image version history UI improvements

### Phase 3 (improvements after demo)
- Story library (#9)
- TTS, background music
- Share feature

**Core Demo Points**: #3 (tree editing) → #5 (background generation) → #6 (final composite) → #8 (child reading)