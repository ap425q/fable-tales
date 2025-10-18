"""
Migration script to copy locations from 'locations' table to 'backgrounds' table
for existing stories that don't have background entries.
"""

import uuid
from datetime import datetime

from app.storage.supabase_data_manager import SupabaseDataManager


def migrate_locations_to_backgrounds():
    """
    Migrate all locations from the locations table to the backgrounds table
    for stories that don't have background entries yet.
    """
    data_manager = SupabaseDataManager()
    
    try:
        # Get all unique story IDs from locations table
        locations_result = data_manager.supabase.table("locations").select("story_id, id, name, description").execute()
        
        if not locations_result.data:
            print("No locations found to migrate.")
            return
        
        # Group locations by story_id
        locations_by_story = {}
        for loc in locations_result.data:
            story_id = loc["story_id"]
            if story_id not in locations_by_story:
                locations_by_story[story_id] = []
            locations_by_story[story_id].append(loc)
        
        print(f"Found {len(locations_by_story)} stories with locations")
        
        # For each story, check if backgrounds exist
        for story_id, locations in locations_by_story.items():
            print(f"\nProcessing story {story_id}...")
            
            # Check if backgrounds already exist for this story
            backgrounds_result = data_manager.supabase.table("backgrounds").select("id").eq("story_id", story_id).execute()
            
            if backgrounds_result.data:
                print(f"  ✓ Story {story_id} already has {len(backgrounds_result.data)} background(s), skipping")
                continue
            
            # Create backgrounds for each location
            for loc in locations:
                loc_id = loc["id"]
                
                # Get scene numbers for this location
                scene_nums_result = data_manager.supabase.table("location_scene_numbers").select("scene_number").eq("location_id", loc_id).execute()
                scene_numbers = [sn["scene_number"] for sn in scene_nums_result.data]
                
                # Create background entry
                background_data = {
                    "id": loc_id,
                    "story_id": story_id,
                    "location_id": loc_id,
                    "name": loc["name"],
                    "description": loc["description"],
                    "image_url": None,
                    "status": "pending",
                    "selected_version_id": None,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }
                
                data_manager.supabase.table("backgrounds").insert(background_data).execute()
                print(f"  ✓ Created background entry for location {loc_id} ({loc['name']})")
                
                # Create background scene numbers
                for scene_num in scene_numbers:
                    bg_scene_data = {
                        "id": str(uuid.uuid4()),
                        "background_id": loc_id,
                        "scene_number": scene_num,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    data_manager.supabase.table("background_scene_numbers").insert(bg_scene_data).execute()
                
                print(f"    → Added {len(scene_numbers)} scene number(s)")
        
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        raise


if __name__ == "__main__":
    print("Starting migration of locations to backgrounds table...")
    migrate_locations_to_backgrounds()

