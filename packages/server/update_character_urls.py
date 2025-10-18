"""
Script to update preset character image URLs in Supabase database
Run this after updating the preset_characters.json file
"""

from app.storage.supabase_data_manager import SupabaseDataManager

def main():
    print("Updating preset character image URLs in Supabase...")
    
    # Initialize the data manager
    data_manager = SupabaseDataManager()
    
    # Populate/update the preset characters in the database
    success = data_manager.populate_preset_characters()
    
    if success:
        print("✅ Successfully updated character image URLs in Supabase!")
        print("The new Supabase URLs are now in the database.")
    else:
        print("❌ Failed to update character URLs. Check the error messages above.")

if __name__ == "__main__":
    main()

