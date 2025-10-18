# Story Tree Editor

An interactive tree visualization page where parents can view and edit the branching story structure.

## Features

### 🌳 Tree Visualization
- Interactive flow diagram built with React Flow
- **Fixed Node Positions** - Nodes are locked in place (no dragging)
- **Hover-Based Relationships** - Hover over any node to see:
  - **Blue highlight** on the current hovered node
  - **Purple rings** on parent nodes (where you came from)
  - **Green rings** on child nodes (where you can go)
  - **Dimmed unrelated nodes** (30% opacity)
  - **Highlighted edges** (blue, thicker, animated)
  - **Dimmed unrelated edges** (30% opacity)
- Visual node types with distinct colors and icons:
  - **Start Node**: Green with play icon
  - **Normal Scene**: Blue with document icon
  - **Choice Point**: Yellow with branching icon
  - **Good Ending**: Bright green with star icon
  - **Bad Ending**: Red with X icon
- Zoom and pan controls
- Automatic layout algorithm
- Interactive guidance panel showing hover behavior

### ✏️ Node Editing
- Side panel for detailed node editing
- Edit scene title, text, and location
- Manage choices (add, edit, delete - max 3 per node)
- Mark choices as "correct" or "incorrect"
- Character counter for text (500 char limit)
- Real-time validation

### 🔍 Validation
- Tree structure validation
- Checks for:
  - Orphan nodes (disconnected from start)
  - Missing good endings
  - Dead ends (non-ending nodes with no choices)
  - Broken connections
- Warnings for:
  - Single choice nodes
  - Too many choices (> 3)
  - Long text (> 400 chars)
  - Short paths to endings

### ⌨️ Keyboard Shortcuts
- `Esc`: Close editing panel
- `Delete`: Delete selected node (except start node)
- `Ctrl/Cmd + S`: Save changes (when panel is open)

### 📊 Additional Features
- Preview full story in sequential order
- Node count indicator
- Unsaved changes warning
- Finalize structure to proceed to character assignment

## File Structure

```
story-tree/
├── [storyId]/
│   ├── page.tsx                     # Main page component
│   ├── story-tree.page.mock.ts      # Mock data
├── components/
│   ├── CustomTreeNode.tsx           # Custom node component
│   ├── NodeEditPanel.tsx            # Side panel component
├── utils/
│   ├── treeValidation.ts            # Validation logic
│   ├── treeLayout.ts                # Layout algorithm
├── types.ts                          # TypeScript types
└── README.md                         # This file
```

## Usage

### Viewing the Tree
1. Navigate to `/story-tree/[storyId]`
2. The tree will load and display automatically
3. Use mouse to pan and zoom
4. Use controls in bottom-left corner
5. **Hover over nodes** to see parent-child relationships:
   - Hovered node gets a **blue ring**
   - Parent nodes (incoming) get **purple rings**
   - Child nodes (outgoing) get **green rings**
   - Unrelated nodes dim to 30% opacity
   - Connected edges highlight in blue and animate

### Editing a Node
1. Click on any node to select it
2. Edit panel opens on the right
3. Modify title, text, location, and choices
4. Click "Save Changes" to apply
5. Click "Cancel" to discard changes

### Deleting a Node
1. Select the node
2. Click "Delete Node" button in the panel
3. Confirm the deletion
4. Connected edges will be removed

### Validation
1. Click the validation status button in top bar
2. View all errors and warnings
3. Errors must be fixed before finalizing
4. Warnings are recommendations

### Finalizing Structure
1. Ensure validation shows "Valid"
2. Click "Finalize Structure" button
3. Confirm finalization
4. Proceed to character assignment

## API Integration

The page integrates with these API endpoints:

- `GET /api/v1/stories/{storyId}` - Load story data
- `PATCH /api/v1/stories/{storyId}/nodes/{nodeId}` - Update node
- `DELETE /api/v1/stories/{storyId}/nodes/{nodeId}` - Delete node
- `POST /api/v1/stories/{storyId}/finalize-structure` - Finalize

## Mock Data

For development, the page uses mock data from `story-tree.page.mock.ts` which includes:

- Complete story with 11 nodes
- Complex branching with multiple paths
- 2 good endings, 1 bad ending
- Node with 3 choices (demonstrating maximum)
- Various node types

## Technical Details

### React Flow Integration
- Uses `@xyflow/react` v12.3.5
- Custom node types for different scene types
- Automatic layout using hierarchical algorithm
- Controlled state management
- **Fixed positions** - `nodesDraggable={false}`
- **Hover interactions** - `onNodeMouseEnter` and `onNodeMouseLeave`
- **Dynamic styling** - Real-time opacity and ring updates based on relationships

### State Management
- React hooks for local state
- Optimistic UI updates
- Debounced auto-save (optional)
- Validation on every change

### TypeScript
- Full type safety
- Custom types for tree structures
- Type-safe API responses
- Validated form data

## Future Enhancements

- [ ] Add node (insert new scenes)
- [ ] Undo/redo functionality
- [ ] Drag and drop node repositioning
- [ ] Export story as JSON
- [ ] Import story from JSON
- [ ] Multi-select nodes
- [ ] Bulk operations
- [ ] Auto-save with debouncing
- [ ] Collaborative editing

