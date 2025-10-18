"""
Supabase Configuration
Configuration file for Supabase database connection
"""

import os
from typing import Optional


class SupabaseConfig:
    """Configuration for Supabase connection"""
    
    def __init__(self):
        self.url: Optional[str] = os.getenv("SUPABASE_URL")
        self.anon_key: Optional[str] = os.getenv("SUPABASE_ANON_KEY")
        
        if not self.url or not self.anon_key:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set. "
                "Please set these in your environment or .env file."
            )
    
    def validate(self) -> bool:
        """Validate that all required configuration is present"""
        return bool(self.url and self.anon_key)
    
    def get_connection_info(self) -> dict:
        """Get connection information for debugging"""
        return {
            "url": self.url,
            "anon_key_set": bool(self.anon_key),
            "anon_key_length": len(self.anon_key) if self.anon_key else 0
        }


# Example of how to set up environment variables:
"""
To set up Supabase, you need to:

1. Create a Supabase project at https://supabase.com/
2. Get your project URL and anon key from the project settings
3. Set the environment variables:

export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"

Or create a .env file in the project root with:
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

4. Run the SQL schema from supabase_schema.sql in your Supabase SQL editor
"""
