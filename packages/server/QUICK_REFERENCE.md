# Quick Reference Guide

## Project Structure

```
packages/server/
├── app/                    # Main application (new modular structure)
│   ├── api/               # HTTP routes
│   ├── services/          # Business logic
│   ├── storage/           # Data persistence
│   └── models/            # Data schemas
│
├── data/                  # Local data storage
│   ├── jobs/             # Job progress files
│   ├── comics/           # Comic data files
│   └── images/           # Generated images
│
├── docs/                 # Documentation
│   ├── README.md
│   ├── FOLDER_STRUCTURE.md
│   └── SUPABASE_MIGRATION.md
│
├── tests/                # Tests
│   ├── test_api.py
│   └── README.md
│
└── config files (main.py, requirements.txt, etc.)
```

## Key Files & Their Purpose

| File | Purpose | Location |
|------|---------|----------|
| `main.py` | FastAPI app entry point | Root |
| `comic_routes.py` | API endpoints (12 endpoints) | `app/api/` |
| `comic_service.py` | Business logic (5-step workflow) | `app/services/` |
| `data_manager.py` | Unified storage interface | `app/storage/` |
| `schemas.py` | Pydantic data models (24+) | `app/models/` |
| `external_services.py` | OpenAI & FAL.ai clients | Root |
| `master_prompts.py` | AI system prompts | Root |

## Common Tasks

### Start the Server
```bash
python main.py
```
Access API: http://localhost:8000/docs

### Run Tests
```bash
pytest tests/ -v
```

### Check Data
```bash
# Jobs stored in
ls data/jobs/

# Comics stored in
ls data/comics/

# Images stored in
ls data/images/
```

### Export Data for Supabase
```python
from app.storage.data_manager import DataManager

dm = DataManager("data")
export = dm.export_all_data()
# Now contains Supabase-ready tables
```

### Add New API Endpoint
1. Add route in `app/api/comic_routes.py`
2. Add business logic in `app/services/comic_service.py`
3. Add models in `app/models/schemas.py` if needed
4. Test at http://localhost:8000/docs

### Add New Storage Feature
1. Add method to `DataManager` in `app/storage/data_manager.py`
2. Update `JSONStorage` or `ImageStorage` if needed
3. Update `ComicService` to use new method

## API Endpoints (v1)

```
POST   /api/v1/comics/scenes/generate
GET    /api/v1/comics/{job_id}/scenes
POST   /api/v1/comics/{job_id}/scenes/refine
GET    /api/v1/comics/characters
POST   /api/v1/comics/{job_id}/characters/select
POST   /api/v1/comics/{job_id}/generate
GET    /api/v1/comics/{job_id}/status
GET    /api/v1/comics/{job_id}/result
GET    /api/v1/storage/stats
GET    /api/v1/health
```

## Data Flow

```
Request
  ↓
Route (app/api/comic_routes.py)
  ↓
Service (app/services/comic_service.py)
  ↓
DataManager (app/storage/data_manager.py)
  ↓
JSONStorage/ImageStorage
  ↓
data/ folder (JSON files & images)
  ↓
Response
```

## Configuration

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
OPENAI_API_KEY=your_key
FAL_AI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

## File Organization

| Removed | New Location |
|---------|--------------|
| `routes.py` | `app/api/comic_routes.py` |
| `service.py` | `app/services/comic_service.py` |
| `models.py` | `app/models/schemas.py` |
| `storage.py` | `app/storage/data_manager.py` |

| Added | Purpose |
|-------|---------|
| `docs/` | Documentation folder |
| `tests/` | Test files folder |

## Documentation

- **Architecture**: `docs/FOLDER_STRUCTURE.md`
- **Database Migration**: `docs/SUPABASE_MIGRATION.md`
- **API Examples**: `examples.py`
- **Testing**: `tests/README.md`

## Imports (Remember!)

✅ **New imports** (use these):
```python
from app.api import router
from app.services.comic_service import ComicService
from app.models.schemas import SceneGenerationRequest
from app.storage.data_manager import DataManager
```

❌ **Old imports** (deprecated):
```python
from routes import router
from service import ComicService
from models import SceneGenerationRequest
```

## Quick Checklist

- [ ] Run `python main.py` to start server
- [ ] Open http://localhost:8000/docs
- [ ] Review `docs/` folder for guides
- [ ] Check `examples.py` for API usage
- [ ] Use `pytest tests/` to run tests
- [ ] Use `docs/SUPABASE_MIGRATION.md` for deployment

---

**Project Status**: ✅ Organized and Ready  
**Version**: 2.0.0
