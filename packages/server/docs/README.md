# Documentation

This folder contains project documentation for the Fable Tales backend.

## Files

- `FOLDER_STRUCTURE.md` - Detailed explanation of the new folder structure and organization
- `SUPABASE_MIGRATION.md` - Complete guide for migrating from local JSON storage to Supabase

## Quick Links

### Architecture
See `FOLDER_STRUCTURE.md` for:
- Complete folder structure overview
- Database models and schemas
- Data flow diagrams
- Migration from old structure

### Database Migration
See `SUPABASE_MIGRATION.md` for:
- Step-by-step Supabase setup
- Table creation SQL
- Data export and import procedures
- Image storage migration
- Verification and rollback procedures

## Getting Started

1. **Read** `FOLDER_STRUCTURE.md` to understand the project organization
2. **Review** the API endpoints in `app/api/comic_routes.py`
3. **Check** `app/models/schemas.py` for data models
4. **Setup** using `SUPABASE_MIGRATION.md` when ready for production

## API Documentation

Once the server is running, access interactive API docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Key Concepts

### 5-Step Workflow
1. **Scene Generation** - Generate educational scenes from topic
2. **Scene Refinement** - Refine scenes based on feedback
3. **Character Selection** - Choose characters for the comic
4. **Comic Generation** - Generate comic panels with images
5. **Result Retrieval** - Fetch completed comic

### Data Storage
- **Local JSON Storage** (development): `data/` folder
- **Supabase** (production): Cloud database with Storage for images

### Architecture Layers
```
API Routes (app/api/)
    ↓
Services (app/services/)
    ↓
Data Manager (app/storage/)
    ↓
JSON/Image Storage (local) or Supabase (production)
```
