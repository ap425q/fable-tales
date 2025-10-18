# Supabase Migration Guide

This guide explains how to migrate from local JSON storage to Supabase.

## Step 1: Export Data from Local Storage

```python
from app.storage.data_manager import DataManager

# Initialize data manager
dm = DataManager("data")

# Export all data in Supabase format
migration_data = dm.export_all_data()

# This includes:
# - jobs_data: List of all jobs (ready for jobs table)
# - comics_data: List of all comics (ready for comics table)
# - scenes_data: List of all scenes (ready for scenes table)
# - panels_data: List of all panels (ready for panels table)
# - images_data: List of all images (ready for images table)
```

## Step 2: Create Supabase Tables

Login to Supabase and create these tables with the provided schemas:

### 1. Jobs Table
```sql
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generating',
  step TEXT NOT NULL DEFAULT 'scene_generation',
  progress INTEGER NOT NULL DEFAULT 0,
  data JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
```

### 2. Comics Table
```sql
CREATE TABLE IF NOT EXISTS comics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_comics_status ON comics(status);
CREATE INDEX idx_comics_created_at ON comics(created_at);
```

### 3. Scenes Table
```sql
CREATE TABLE IF NOT EXISTS scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES comics(id) ON DELETE CASCADE,
  scene_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  dialogue TEXT,
  learning_point TEXT,
  visual_elements TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(comic_id, scene_id)
);

CREATE INDEX idx_scenes_comic_id ON scenes(comic_id);
```

### 4. Panels Table
```sql
CREATE TABLE IF NOT EXISTS panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES comics(id) ON DELETE CASCADE,
  panel_id INTEGER NOT NULL,
  scene_id INTEGER NOT NULL,
  image_url TEXT,
  image_path TEXT,
  description TEXT,
  dialogue TEXT,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(comic_id, panel_id)
);

CREATE INDEX idx_panels_comic_id ON panels(comic_id);
CREATE INDEX idx_panels_scene_id ON panels(scene_id);
```

### 5. Images Table
```sql
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  local_path TEXT,
  panel_id uuid REFERENCES panels(id) ON DELETE SET NULL,
  comic_id uuid REFERENCES comics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  size_bytes BIGINT DEFAULT 0
);

CREATE INDEX idx_images_comic_id ON images(comic_id);
CREATE INDEX idx_images_panel_id ON images(panel_id);
```

### 6. Characters Table
```sql
CREATE TABLE IF NOT EXISTS characters (
  character_type TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  visual_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  age_group TEXT
);
```

## Step 3: Migrate Data

### Option A: Using CSV Import (Recommended for Initial Migration)

1. Export data as CSV using the export functions
2. In Supabase dashboard, go to each table
3. Click "Insert" → "New row" or use "Import data"
4. Upload the CSV file

### Option B: Using Supabase Python Client

```bash
pip install supabase
```

```python
from supabase import create_client, Client
from app.storage.data_manager import DataManager
import json

# Initialize
url = "your_supabase_url"
key = "your_supabase_key"
supabase: Client = create_client(url, key)

dm = DataManager("data")
migration_data = dm.export_all_data()

# Migrate jobs
for job in migration_data["jobs_data"]:
    supabase.table("jobs").insert(job).execute()

# Migrate comics
for comic in migration_data["comics_data"]:
    supabase.table("comics").insert(comic).execute()

# Migrate scenes
for scene in migration_data["scenes_data"]:
    supabase.table("scenes").insert(scene).execute()

# Migrate panels
for panel in migration_data["panels_data"]:
    supabase.table("panels").insert(panel).execute()

# Migrate images
for image in migration_data["images_data"]:
    supabase.table("images").insert(image).execute()

print("Migration complete!")
```

### Option C: Using Supabase Dashboard SQL

Copy-paste the export data JSON and run individual INSERT statements (for small datasets).

## Step 4: Update Storage Layer

Replace `JSONStorage` with Supabase client in `data_manager.py`:

```python
from supabase import create_client, Client

class DataManager:
    def __init__(self, data_dir: str, supabase_url: str = None, supabase_key: str = None):
        if supabase_url and supabase_key:
            self.supabase: Client = create_client(supabase_url, supabase_key)
            self.use_supabase = True
        else:
            self.json_storage = JSONStorage(data_dir)
            self.use_supabase = False
        
        self.image_storage = ImageStorage(data_dir)
    
    async def create_job(self, job_data: Dict) -> str:
        if self.use_supabase:
            result = self.supabase.table("jobs").insert(job_data).execute()
            return result.data[0]["id"]
        else:
            return self.json_storage.create_job(job_data)
```

## Step 5: Handle Image Storage

### Option A: Keep Local Images (Hybrid)
Images stay in `data/images/`, metadata stored in Supabase

### Option B: Migrate to Supabase Storage
```bash
# Install client
pip install supabase
```

```python
from supabase import create_client

def migrate_images_to_supabase(local_image_dir, supabase_url, supabase_key):
    supabase = create_client(supabase_url, supabase_key)
    
    for image_file in os.listdir(local_image_dir):
        with open(os.path.join(local_image_dir, image_file), 'rb') as f:
            # Upload to Supabase Storage
            response = supabase.storage.from_('comics').upload(
                f'images/{image_file}',
                f.read()
            )
            
            # Update image record with new URL
            new_url = supabase.storage.from_('comics').get_public_url(f'images/{image_file}')
            supabase.table("images").update({"url": new_url}).match(
                {"local_path": image_file}
            ).execute()
```

## Step 6: Update Environment Variables

Add to `.env`:
```env
# Supabase Configuration
USE_SUPABASE=true
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 7: Update main.py

```python
import os
from app.storage.data_manager import DataManager

# Initialize with Supabase if configured
if os.getenv("USE_SUPABASE") == "true":
    data_manager = DataManager(
        data_dir="data",
        supabase_url=os.getenv("SUPABASE_URL"),
        supabase_key=os.getenv("SUPABASE_ANON_KEY")
    )
else:
    data_manager = DataManager(data_dir="data")

# Pass to ComicService
app.state.comic_service = ComicService(data_manager)
```

## Verification Checklist

- [ ] All 6 tables created in Supabase
- [ ] Data migrated successfully
- [ ] Row counts match between local export and Supabase
- [ ] Foreign key relationships working
- [ ] Indexes created for performance
- [ ] API tests passing with Supabase backend
- [ ] Images properly referenced or migrated
- [ ] Backups taken before migration

## Rollback Plan

If migration fails:

1. Delete data from Supabase tables (or drop and recreate)
2. Revert `USE_SUPABASE` environment variable to `false`
3. Restart server to use local JSON storage
4. Fix issues and retry migration

## Performance Considerations

### Indexes
All recommended indexes are included in the SQL above for:
- Status filtering (`idx_jobs_status`)
- Date range queries (`idx_jobs_created_at`, `idx_comics_created_at`)
- Foreign key lookups (`idx_scenes_comic_id`, `idx_panels_comic_id`)

### Query Optimization
```sql
-- Get comic with all scenes and panels
SELECT 
  c.*,
  json_agg(json_build_object(
    'id', s.id,
    'title', s.title,
    'panels', (
      SELECT json_agg(json_build_object(
        'id', p.id,
        'image_url', p.image_url,
        'description', p.description
      ))
      FROM panels p
      WHERE p.scene_id = s.scene_id AND p.comic_id = c.id
    )
  )) as scenes
FROM comics c
LEFT JOIN scenes s ON s.comic_id = c.id
GROUP BY c.id
```

## Monitoring

Track migration health:
```sql
-- Check data integrity
SELECT 
  (SELECT COUNT(*) FROM jobs) as jobs_count,
  (SELECT COUNT(*) FROM comics) as comics_count,
  (SELECT COUNT(*) FROM scenes) as scenes_count,
  (SELECT COUNT(*) FROM panels) as panels_count,
  (SELECT COUNT(*) FROM images) as images_count;
```

## Troubleshooting

### Foreign Key Constraint Errors
Ensure parent records exist before inserting child records:
1. Insert jobs first
2. Then comics
3. Then scenes
4. Then panels
5. Finally images

### Missing Images
Run this to find orphaned image references:
```sql
SELECT * FROM images 
WHERE panel_id NOT IN (SELECT id FROM panels)
  AND comic_id NOT IN (SELECT id FROM comics);
```

### Timeout Issues
For large datasets, batch insert in chunks of 100:
```python
def batch_insert(table_name, data, batch_size=100):
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        supabase.table(table_name).insert(batch).execute()
```

---

**Migration Version**: 1.0  
**Status**: Ready for Production  
**Estimated Time**: 30-60 minutes depending on data volume
