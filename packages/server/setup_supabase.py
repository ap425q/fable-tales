#!/usr/bin/env python3
"""
Supabase Setup Script
Helps set up the Supabase database for the Fable Tales Story API
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('.env')


def check_environment():
    """Check if required environment variables are set"""
    print("🔍 Checking environment variables...")
    
    required_vars = ["SUPABASE_URL", "SUPABASE_ANON_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these environment variables in your .env file:")
        print("SUPABASE_URL=https://your-project-ref.supabase.co")
        print("SUPABASE_ANON_KEY=your-anon-key-here")
        return False
    
    print("✅ All required environment variables are set")
    return True


def test_supabase_connection():
    """Test connection to Supabase"""
    print("\n🔗 Testing Supabase connection...")
    
    try:
        from app.storage.supabase_data_manager import SupabaseDataManager
        
        # Try to create a data manager instance
        data_manager = SupabaseDataManager()
        print("✅ Successfully connected to Supabase")
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {str(e)}")
        return False


def check_database_schema():
    """Check if database schema is properly set up"""
    print("\n📋 Checking database schema...")
    
    try:
        from app.storage.supabase_data_manager import SupabaseDataManager
        
        data_manager = SupabaseDataManager()
        
        # Try to query a table to see if schema exists
        result = data_manager.supabase.table("preset_characters").select("id").limit(1).execute()
        
        if result.data is not None:
            print("✅ Database schema appears to be set up correctly")
            return True
        else:
            print("❌ Database schema not found. Please run the SQL schema from supabase_schema.sql")
            return False
            
    except Exception as e:
        print(f"❌ Error checking database schema: {str(e)}")
        print("Please make sure you've run the SQL schema from supabase_schema.sql in your Supabase SQL editor")
        return False


def show_setup_instructions():
    """Show setup instructions"""
    print("\n📖 Supabase Setup Instructions:")
    print("=" * 50)
    print("1. Create a Supabase project at https://supabase.com/")
    print("2. Go to your project dashboard")
    print("3. Navigate to Settings > API")
    print("4. Copy your Project URL and anon public key")
    print("5. Set environment variables in your .env file:")
    print("   SUPABASE_URL=https://your-project-ref.supabase.co")
    print("   SUPABASE_ANON_KEY=your-anon-key-here")
    print("6. Go to SQL Editor in your Supabase dashboard")
    print("7. Copy and paste the contents of supabase_schema.sql")
    print("8. Run the SQL to create all tables and initial data")
    print("9. Run this script again to verify the setup")


def main():
    """Main setup function"""
    print("🚀 Fable Tales - Supabase Setup")
    print("=" * 40)
    
    # Check environment
    if not check_environment():
        show_setup_instructions()
        sys.exit(1)
    
    # Test connection
    if not test_supabase_connection():
        show_setup_instructions()
        sys.exit(1)
    
    # Check schema
    if not check_database_schema():
        show_setup_instructions()
        sys.exit(1)
    
    print("\n🎉 Supabase setup is complete!")
    print("You can now run the Fable Tales Story API with Supabase as the database.")
    print("\nTo start the server:")
    print("python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload")


if __name__ == "__main__":
    main()
