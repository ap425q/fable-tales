# UI Components Library

A comprehensive library of reusable UI components for the Fable Tales storybook creator application. All components are built with React, TypeScript, and Tailwind CSS, following accessibility best practices.

## 📦 Components

### Button
A flexible button component with multiple variants, sizes, and states.

**Features:**
- Multiple variants: primary, secondary, danger, success
- Three sizes: small, medium, large
- Loading state with spinner
- Icon support (before and after text)
- Disabled state
- Full width option
- Accessibility compliant

**Usage:**
```tsx
import { Button, ButtonVariant, ButtonSize } from '@/components';

<Button variant={ButtonVariant.Primary} size={ButtonSize.Medium} onClick={handleClick}>
  Click Me
</Button>

<Button variant={ButtonVariant.Secondary} icon={<Icon />} loading>
  Loading...
</Button>
```

---

### Card
A flexible card container with optional title, image, and footer.

**Features:**
- Optional title, image, and footer
- Hover effects
- Click interaction support
- Multiple padding sizes
- Selection state
- Responsive grid-friendly

**Usage:**
```tsx
import { Card } from '@/components';

<Card
  title="Story Title"
  image="/cover.png"
  footer={<Button>Read More</Button>}
  hoverable
  onClick={handleClick}
>
  <p>Story description...</p>
</Card>
```

---

### Input
A flexible input component supporting both text inputs and textareas.

**Features:**
- Text input and textarea variants
- Error state with message
- Character counter for textareas
- Label support
- Required field indicator
- Disabled state
- Accessible error announcements

**Usage:**
```tsx
import { Input, InputVariant } from '@/components';

<Input
  label="Title"
  value={title}
  onChange={setTitle}
  required
/>

<Input
  variant={InputVariant.Textarea}
  label="Description"
  value={description}
  onChange={setDescription}
  maxLength={500}
  showCharacterCount
  rows={4}
/>
```

---

### Modal
An accessible modal dialog with backdrop, focus trapping, and keyboard support.

**Features:**
- Multiple sizes: small, medium, large, xlarge
- Focus trap for accessibility
- Escape key to close
- Click outside to close (optional)
- Smooth animations
- Customizable footer

**Usage:**
```tsx
import { Modal, ModalSize, Button, ButtonVariant } from '@/components';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant={ButtonVariant.Secondary} onClick={handleCancel}>Cancel</Button>
      <Button variant={ButtonVariant.Primary} onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure?</p>
</Modal>
```

---

### LoadingSpinner
An animated loading spinner with optional message text.

**Features:**
- Multiple sizes: small, medium, large, xlarge
- Color variants: primary, secondary, white, gray
- Optional loading message
- Centering option
- Accessible status announcements

**Usage:**
```tsx
import { LoadingSpinner, SpinnerSize, SpinnerColor } from '@/components';

<LoadingSpinner size={SpinnerSize.Medium} message="Loading..." />

<LoadingSpinner size={SpinnerSize.Large} color={SpinnerColor.Primary} centered />
```

---

### ProgressBar
A visual progress indicator with optional percentage display.

**Features:**
- Percentage display option
- Multiple color themes: primary, success, warning, danger
- Three sizes: small, medium, large
- Smooth animations
- Label support
- Accessible progress announcements

**Usage:**
```tsx
import { ProgressBar, ProgressBarColor } from '@/components';

<ProgressBar 
  current={7} 
  max={10} 
  showPercentage 
  label="Story Progress" 
/>

<ProgressBar
  current={generatedCount}
  max={totalCount}
  color={ProgressBarColor.Success}
  animated
/>
```

---

### ImageViewer
Displays an image with zoom capability, version history, and regeneration options.

**Features:**
- Image zoom functionality
- Version history with thumbnails
- Regenerate button
- Loading state
- Error handling
- Version selection

**Usage:**
```tsx
import { ImageViewer } from '@/components';

<ImageViewer
  imageUrl={sceneImage}
  alt="Scene 1"
  versions={imageVersions}
  selectedVersionId={currentVersionId}
  onRegenerate={handleRegenerate}
  onSelectVersion={handleSelectVersion}
  showVersionHistory
/>
```

---

### DropZone
A drag-and-drop file upload zone with click-to-select functionality.

**Features:**
- Drag and drop support
- Click to browse files
- File type validation
- File size validation
- Image preview
- Error handling
- Disabled state

**Usage:**
```tsx
import { DropZone } from '@/components';

<DropZone
  onDrop={handleFileUpload}
  acceptedTypes={['image/png', 'image/jpeg']}
  currentImage={imageUrl}
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

---

## 🎨 Styling

All components use Tailwind CSS utility classes and follow a consistent design system:

- **Colors**: Primary (blue), success (green), warning (yellow), danger (red)
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with appropriate font sizes
- **Shadows**: Elevation through box shadows
- **Transitions**: Smooth animations on interactions

## ♿ Accessibility

All components follow WCAG 2.1 Level AA guidelines:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Color contrast compliance
- Semantic HTML

## 📱 Responsive Design

All components are responsive and work seamlessly across:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🔧 Development

### Adding New Components

1. Create component file in `/src/components/`
2. Export from `/src/components/index.ts`
3. Add TypeScript interfaces for props
4. Include JSDoc comments
5. Add usage examples
6. Ensure accessibility compliance

### Testing Components

Components can be tested individually by importing them into pages:

```tsx
import { Button, Card, Input } from '@/components';
```

## 📝 Type Safety

All components are fully typed with TypeScript:

- Prop interfaces exported for reuse
- Strict type checking
- IntelliSense support
- Type inference

## 🎯 Best Practices

1. **Composability**: Components are designed to work together
2. **Flexibility**: Props allow extensive customization
3. **Performance**: Optimized re-renders with React best practices
4. **Consistency**: Unified API patterns across components
5. **Documentation**: Clear examples and prop descriptions

## 🔗 Related Documentation

- [TypeScript Types](/src/types.ts)
- [API Documentation](/README.md)
- [UI/UX Specifications](/packages/web/README.md)

