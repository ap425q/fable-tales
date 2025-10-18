# Quick Start Guide - Story Setup Feature

## Getting Started

### 1. Install Dependencies

```bash
cd packages/web
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the `packages/web` directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Navigate to Story Setup

1. Open browser to `http://localhost:3000`
2. Click on the "Parent Mode" card
3. You'll be taken to the story setup page at `/story-setup`

## Using the Story Setup Page

### Creating Your First Story

1. **Enter a Lesson** (Required)
   - Type the moral or lesson you want to teach
   - Minimum 5 characters
   - Example: "Honesty is always the best policy"

2. **Add a Theme** (Optional)
   - Describe the setting or world
   - Example: "Magical forest with talking animals"

3. **Choose a Story Format** (Optional)
   - Describe the narrative style
   - Example: "Aesop's fable style with clear moral"

4. **Click "Generate Story"**
   - The form will validate your input
   - A loading screen will appear
   - You'll be redirected to the story tree editor on success

### Using Example Prompts

Click any of the four example cards to quickly populate the form:

- **Honesty Story**: Magical forest, Aesop's fable style
- **Sharing Story**: Space adventure, Sci-fi style
- **Courage Story**: Medieval kingdom, Hero's journey
- **Friendship Story**: School setting, Realistic style

## API Endpoints

The story setup page calls:

```
POST /api/v1/stories/generate
```

**Request Body:**
```json
{
  "lesson": "string",
  "theme": "string",
  "storyFormat": "string",
  "characterCount": 4
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "storyId": "string",
    "tree": { ... },
    "characters": [ ... ],
    "locations": [ ... ]
  }
}
```

## Troubleshooting

### Server Won't Start

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Failed

1. Check that backend server is running on port 3001
2. Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Check CORS settings on backend

### Form Validation Issues

- Ensure lesson field has at least 5 characters
- Check that character limits aren't exceeded
- Look for error messages below each input field

### Loading State Stuck

1. Open browser DevTools (F12)
2. Check Network tab for failed requests
3. Check Console for JavaScript errors
4. Verify backend API is responding

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files:
- React components: Instant hot reload
- API routes: Server restart required
- Configuration files: Server restart required

### Viewing Component Library

Visit `/components-demo` to see all available components with examples.

### File Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── story-setup/
│   │   └── page.tsx          # Story setup form
│   └── story-tree/
│       └── [storyId]/
│           └── page.tsx      # Tree editor
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Toast.tsx
│   └── ...
├── lib/
│   └── api.ts                # API client
├── constants.ts              # Configuration
└── types.ts                  # TypeScript types
```

## Next Steps

After creating a story on the setup page:

1. **Story Tree Editor** (`/story-tree/{storyId}`)
   - Edit nodes and scenes
   - Modify choices and branches
   - Adjust story flow

2. **Character Assignment** (Coming soon)
   - Assign preset characters to roles
   - Customize character appearances

3. **Background Setup** (Coming soon)
   - Generate background images
   - Customize location settings

4. **Scene Generation** (Coming soon)
   - Generate composite scene images
   - Review and regenerate scenes

5. **Story Completion** (Coming soon)
   - Finalize and publish story
   - Generate share link

## Resources

- [Full Documentation](./STORY_SETUP.md)
- [Component Library](../src/components/README.md)
- [API Reference](../../../README.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the full documentation
3. Open an issue in the repository

Happy story creating! 📚✨

