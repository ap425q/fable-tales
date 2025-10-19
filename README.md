# 📚 Fable Tales

> An AI-powered interactive storytelling platform for children with branching narratives and custom-generated illustrations

## 🎥 Demo
[@https://www.youtube.com/watch?v=TrGT-S5oms0](https://www.youtube.com/watch?v=TrGT-S5oms0)

---

## 📖 Project Overview

**Fable Tales** is an innovative educational storytelling application that combines AI-powered story generation with interactive reading experiences. The platform enables parents and educators to create personalized, choice-driven stories that teach valuable life lessons, while children enjoy an engaging, immersive reading experience with custom illustrations.

### 🎯 Key Features

#### **Parent/Educator Mode:**
- **AI Story Generation**: Create complete story trees with branching narratives using AI (15-20 scenes)
- **Story Tree Editing**: Full control over story nodes, choices, and narrative paths
- **Character Customization**: Assign preset characters to story roles (protagonist, friend, antagonist, etc.)
- **Background Generation**: AI-generated location backgrounds with multiple versions and regeneration options
- **Scene Composition**: Automatic composite image generation combining characters and backgrounds
- **Story Management**: Complete library system with drafts, completed stories, and sharing capabilities

#### **Child Mode:**
- **Interactive Reading**: Navigate through stories by making choices that affect the outcome
- **Multiple Endings**: Good and bad endings based on choices made, with lesson reinforcement
- **Progress Tracking**: Save and resume reading progress at any time
- **Visual Storytelling**: Every scene comes with custom-generated illustrations

### 🏗️ Architecture

**Frontend (Next.js + React)**
- Located in `packages/web/`
- Built with Next.js 15+ and TypeScript
- Modern UI with Tailwind CSS
- Component-based architecture for story creation and reading flows

**Backend (Python + FastAPI)**
- Located in `packages/server/`
- RESTful API with FastAPI framework
- AI integration for story and image generation (Google Gemini, DALL-E/Stable Diffusion)
- Audio narration support (ElevenLabs integration)
- JSON-based data storage with optional Supabase integration

### 🛠️ Technology Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

**Backend:**
- Python 3.10+
- FastAPI
- Google Gemini API (story generation)
- Image generation APIs (background & scene composition)
- ElevenLabs API (audio narration)

**Storage:**
- JSON file-based storage (development)
- Supabase integration (production-ready)
- Image storage with CDN support

### 📱 User Flows

1. **Story Creation Flow** (Parent Mode)
   ```
   Story Setup → AI Generation → Tree Editing → Character Assignment 
   → Background Setup → Scene Generation → Completion
   ```

2. **Story Reading Flow** (Child Mode)
   ```
   Story Selection → Interactive Reading → Choice Making 
   → Ending (Good/Bad) → Lesson Reinforcement
   ```

3. **Story Management Flow**
   ```
   Story Library → View/Edit/Delete → Share → Reading Analytics
   ```

### 🎨 Core Concepts

- **Story Tree**: Branching narrative structure with nodes (scenes) and edges (choices)
- **Character Roles**: Abstract roles (protagonist, friend, antagonist) assigned to visual characters
- **Locations/Backgrounds**: Reusable location settings across multiple scenes
- **Scene Versions**: Multiple generated versions of backgrounds and scenes for selection
- **Choice Types**: Correct/incorrect choices leading to different narrative paths
- **Ending Types**: Good endings (positive reinforcement) and bad endings (learning opportunities)

---

