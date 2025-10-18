# Hover-Based Interaction System

## Overview

The Story Tree Editor uses a hover-based interaction model to clearly show parent-child relationships in the story tree. Instead of allowing drag-and-drop repositioning, nodes are fixed in position and relationships are highlighted through visual feedback.

## Visual Feedback System

### Node States

#### 1. Normal State (No Hover)
- Full opacity (100%)
- Base color based on node type
- Standard shadow

#### 2. Hovered Node
- Full opacity (100%)
- **Blue ring** (4px, ring-blue-500)
- Enhanced shadow (shadow-xl)
- Slight scale-up effect

#### 3. Parent Nodes
- Slightly reduced opacity (90%)
- **Purple ring** (2px, ring-purple-400)
- Medium shadow (shadow-lg)

#### 4. Child Nodes
- Slightly reduced opacity (90%)
- **Green ring** (2px, ring-green-400)
- Medium shadow (shadow-lg)

#### 5. Unrelated Nodes
- Significantly reduced opacity (30%)
- Standard styling
- Clearly de-emphasized

### Edge States

#### 1. Normal State (No Hover)
- Gray color (#9CA3AF)
- 2px stroke width
- Full opacity
- Static (not animated)

#### 2. Related Edges (Connected to Hovered Node)
- **Blue color** (#3B82F6)
- **3px stroke width** (thicker)
- Full opacity (100%)
- **Animated** flow

#### 3. Unrelated Edges
- Light gray (#D1D5DB)
- 2px stroke width
- **30% opacity** (dimmed)
- Static

## Implementation Details

### State Management

```typescript
const [hoveredNode, setHoveredNode] = useState<string | null>(null)
```

### Node Data Properties

Each node's data includes:
```typescript
{
  isHovered: boolean,    // True if this is the currently hovered node
  isParent: boolean,     // True if this is a parent of the hovered node
  isChild: boolean,      // True if this is a child of the hovered node
}
```

### Event Handlers

#### onNodeMouseEnter
1. Set `hoveredNode` state
2. Find parent and child nodes using edges
3. Update all nodes with relationship flags
4. Update edge styles (highlight related, dim others)

#### onNodeMouseLeave
1. Clear `hoveredNode` state
2. Reset all node relationship flags
3. Reset all edge styles to default

### Relationship Detection

```typescript
const getRelatedNodes = (nodeId: string) => {
  const parents = edges
    .filter((e) => e.target === nodeId)
    .map((e) => e.source)
  
  const children = edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target)
  
  return { parents, children }
}
```

## User Experience Benefits

### 1. **Clear Relationship Visualization**
- Instantly see which nodes lead to the current node
- Instantly see which nodes the current node leads to
- No need to trace edges manually

### 2. **Reduced Cognitive Load**
- Unrelated nodes fade into background
- Focus on relevant connections only
- Color-coded relationship types

### 3. **No Accidental Repositioning**
- Fixed positions prevent layout corruption
- Automatic layout maintains optimal spacing
- Consistent view across sessions

### 4. **Better for Complex Trees**
- Works well even with many nodes
- Handles cycles and complex branching
- Scales to large story structures

## Color Coding Rationale

### Purple for Parents
- Represents "where you came from"
- Cool color for retrospective direction
- Distinct from other UI elements

### Green for Children  
- Represents "where you can go"
- Positive, forward-looking color
- Associated with growth and progression

### Blue for Current
- Strong, clear highlight color
- Matches primary action color in UI
- High contrast and visibility

## Accessibility Considerations

- Color is not the only indicator (rings + opacity)
- Smooth transitions (200ms) for visual comfort
- High contrast between states
- Hover tolerance (entire node area)
- Works with keyboard navigation (can be enhanced)

## Performance Optimizations

- `useCallback` for event handlers
- Batch state updates
- CSS transitions (GPU-accelerated)
- No re-layout on hover (only style changes)

## Future Enhancements

- [ ] Keyboard navigation support
- [ ] Click to "lock" hover state
- [ ] Show path from start to hovered node
- [ ] Highlight all paths to endings
- [ ] Multi-level relationship visualization (grandparents, etc.)
- [ ] Configurable hover delay
- [ ] Touch device support (tap-to-highlight)

