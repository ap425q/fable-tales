# New Project Structure - Fable Tales Backend v2.0

## Overview

The backend has been reorganized with a proper folder structure designed for scalability and easy migration to Supabase. All data is now stored in JSON format with organized image storage.

## Folder Structure

```
packages/server/
├── app/                          # Main application package
│   ├── __init__.py
│   ├── api/                      # API routes
│   │   ├── __init__.py
│   │   └── comic_routes.py       # All comic endpoints
│   ├── services/                 # Business logic
│   │   ├── __init__.py
│   │   └── comic_service.py      # Main workflow service
│   ├── storage/                  # Data persistence layer
│   │   ├── __init__.py
│   │   ├── data_manager.py       # Unified data management (Supabase-compatible)
│   │   ├── json_storage.py       # JSON file storage
│   │   └── image_storage.py      # Image management
│   └── models/                   # Data models
│       ├── __init__.py
│       └── schemas.py            # Pydantic schemas (Supabase-aligned)
│
├── data/                         # Data folder (persistent storage)
│   ├── jobs/                     # Job records (JSON)
│   ├── comics/                   # Comic records (JSON)
│   └── images/                   # Image storage
│       ├── panels/               # Comic panel images
│       ├── characters/           # Character images
│       ├── temp/                 # Temporary images
│       └── metadata.json         # Image metadata
│
├── main.py                       # FastAPI application entry point
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── config.py                     # Configuration
├── utils.py                      # Utility functions
├── external_services.py          # OpenAI & FAL.ai clients
├── master_prompts.py             # System prompts
└── README.md                     # Documentation
```

## Key Improvements

### 1. **Organized Package Structure**
```
app/
├── api/          → Routes and endpoints
├── services/     → Business logic
├── storage/      → Data persistence
└── models/       → Data schemas
```

### 2. **Data Storage System**

#### JSON Storage (`data/jobs/`, `data/comics/`)
```
data/
├── jobs/
│   ├── {job_id}.json      # Job progress tracking
│   ├── {job_id}.json
│   └── ...
├── comics/
│   ├── {comic_id}.json    # Complete comic records
│   ├── {comic_id}.json
│   └── ...
└── images/
    ├── panels/            # Generated comic panels
    ├── characters/        # Character images
    ├── temp/             # Temporary images
    └── metadata.json     # Image references
```

### 3. **Unified Data Manager**

The `DataManager` class provides:
- Job creation, retrieval, updates
- Comic saving and retrieval
- Image storage and referencing
- Statistics and cleanup operations
- **Supabase-compatible data export**

### 4. **Supabase-Ready Schema**

All models include Supabase schema information:
```python
class JobSchema(BaseModel):
    id: str
    topic: str
    status: str
    step: str
    progress: int
    data: Dict  # JSONB in Supabase
    
    class Config:
        json_schema_extra = {
            "supabase_table": "jobs",
            "columns": {
                "id": "uuid",
                "topic": "text",
                "status": "text",
                ...
            }
        }
```

### 5. **Image Storage Management**

- Local storage with metadata tracking
- External URL references (FAL.ai)
- Image organization by type (panels, characters)
- Cleanup utilities
- Export functions for migration

## Database Models (Ready for Supabase)

### Tables

1. **jobs** - Job tracking
   - id (uuid, pk)
   - topic, status, step, progress
   - data (jsonb), error
   - created_at, updated_at

2. **comics** - Comic records
   - id (uuid, pk)
   - topic, title, status
   - created_at, updated_at

3. **scenes** - Individual scenes
   - id (uuid, pk)
   - comic_id (fk → comics)
   - scene_id, title, description, dialogue
   - learning_point, visual_elements (array)
   - created_at

4. **panels** - Comic panels
   - id (uuid, pk)
   - comic_id (fk → comics)
   - panel_id, scene_id
   - image_url, image_path, description
   - dialogue, title
   - created_at

5. **images** - Image references
   - id (uuid, pk)
   - url, local_path
   - panel_id (fk → panels)
   - comic_id (fk → comics)
   - created_at, size_bytes

6. **characters** - Character definitions
   - id (uuid, pk / character_type text)
   - name, description
   - visual_tags (array)
   - age_group

## API Endpoints

All endpoints are now under `/api/v1/`:

```
POST   /comics/scenes/generate           # Generate scenes
GET    /comics/{job_id}/scenes           # Get scenes
POST   /comics/{job_id}/scenes/refine    # Refine scenes
GET    /comics/characters                # List characters
POST   /comics/{job_id}/characters/select # Select characters
POST   /comics/{job_id}/generate         # Generate comic
GET    /comics/{job_id}/status           # Check status
GET    /comics/{job_id}/result           # Get result
GET    /storage/stats                    # Storage statistics
GET    /health                           # Health check
```

## Data Flow with JSON Storage

```
Request
  ↓
Route Handler (app/api/comic_routes.py)
  ↓
Service Layer (app/services/comic_service.py)
  ↓
DataManager (app/storage/data_manager.py)
  ├→ JSONStorage (app/storage/json_storage.py)
  │   └→ data/jobs/ or data/comics/
  ├→ ImageStorage (app/storage/image_storage.py)
  │   └→ data/images/
  └→ External APIs (OpenAI, FAL.ai)
  ↓
Response
```

## Usage Examples

### Run the Server
```bash
python main.py
```

### Generate Comic
```bash
curl -X POST http://localhost:8000/api/v1/comics/scenes/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "teaching kids about safety", "age_group": "5-12"}'
```

### Check Storage Stats
```bash
curl http://localhost:8000/api/v1/storage/stats
```

### Export Data for Supabase
```python
from app.storage.data_manager import DataManager

dm = DataManager("data")
export_data = dm.export_comic_data(comic_id)
# Now contains Supabase-compatible tables and schema
```

## Migration to Supabase

The system is designed for seamless migration:

1. **Export data** using `DataManager.export_comic_data()`
2. **Create tables** using the schema in model classes
3. **Insert data** using the exported format
4. **Update API** to use Supabase client instead of JSONStorage
5. **Switch image storage** to Supabase Storage

## Configuration

### Environment Variables (.env)
```env
ENV=development
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000

OPENAI_API_KEY=your_key
FAL_AI_API_KEY=your_key

# Optional - for Supabase
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

## Storage Statistics

Check storage usage:
```bash
curl http://localhost:8000/api/v1/storage/stats
```

Response:
```json
{
  "json_storage": {
    "total_jobs": 5,
    "total_comics": 3,
    "total_size_mb": 12.5
  },
  "image_storage": {
    "total_images": 18,
    "panels_size_mb": 25.3,
    "total_size_mb": 25.3
  },
  "total_storage_mb": 37.8
}
```

## File Organization Benefits

✅ **Scalability** - Easy to add new services and storage backends  
✅ **Maintainability** - Clear separation of concerns  
✅ **Testability** - Each layer independently testable  
✅ **Database Agnostic** - JSONStorage can be replaced with Supabase client  
✅ **Data Portability** - Built-in export functions  
✅ **Image Management** - Organized image storage with metadata  
✅ **Supabase Ready** - Aligned schemas and export functions  

## Next Steps

1. **Test the new structure**: `python main.py`
2. **Verify API endpoints**: http://localhost:8000/docs
3. **Check storage**: http://localhost:8000/api/v1/storage/stats
4. **Export data format**: Use `DataManager.export_all_data()`
5. **Setup Supabase**: Create tables using exported schemas
6. **Migrate to Supabase**: Update storage layer to use Supabase client

## File Mapping

| Old File | New Location |
|----------|--------------|
| routes.py | app/api/comic_routes.py |
| service.py | app/services/comic_service.py |
| models.py | app/models/schemas.py |
| storage.py | app/storage/data_manager.py |
| external_services.py | external_services.py (no change) |
| master_prompts.py | master_prompts.py (no change) |
| main.py | main.py (updated) |

---

**Version**: 2.0.0  
**Structure**: Organized with app package + data folder  
**Ready for**: Supabase migration
