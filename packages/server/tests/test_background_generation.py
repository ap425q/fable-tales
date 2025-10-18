#!/usr/bin/env python3
"""
Test script for background generation functionality
"""

import requests
import json
import time
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000/api/v1"

def test_background_generation():
    """Test the complete background generation workflow"""
    print("🧪 Testing Background Generation Workflow")
    print("=" * 50)
    
    # Use the fixed story ID
    story_id = "8ad1ea9c-ec34-4109-b05b-006c22afe822"
    print(f"\n1️⃣ Using fixed story ID: {story_id}")
    
    # Step 2: Get story details to see the nodes
    print("\n2️⃣ Getting story details...")
    story_details_response = requests.get(f"{BASE_URL}/stories/{story_id}")
    
    if story_details_response.status_code == 200:
        story_details = story_details_response.json()
        if story_details["success"]:
            nodes = story_details["data"]["tree"]["nodes"]
            print(f"   ✅ Story has {len(nodes)} nodes")
            print("   📍 Locations in story:")
            locations = set()
            for node in nodes:
                locations.add(node["location"])
            for location in locations:
                print(f"      - {location}")
        else:
            print(f"   ❌ Failed to get story details: {story_details.get('error', {}).get('message', 'Unknown error')}")
            return
    else:
        print(f"   ❌ HTTP Error: {story_details_response.status_code}")
        return
    
    # Step 3: Get backgrounds list first
    print("\n3️⃣ Getting backgrounds list...")
    bg_list_response = requests.get(f"{BASE_URL}/stories/{story_id}/backgrounds")
    
    if bg_list_response.status_code == 200:
        bg_list_data = bg_list_response.json()
        if bg_list_data["success"]:
            backgrounds = bg_list_data["data"]["backgrounds"]
            print(f"   ✅ Retrieved {len(backgrounds)} backgrounds")
            for bg in backgrounds:
                print(f"      📍 {bg['name']} (Scenes: {bg['sceneNumbers']})")
        else:
            print(f"   ❌ Failed to get backgrounds: {bg_list_data.get('error', {}).get('message', 'Unknown error')}")
    else:
        print(f"   ❌ HTTP Error: {bg_list_response.status_code}")
    
    # Step 4: Generate backgrounds using the proper API
    print("\n4️⃣ Generating backgrounds...")
    # First, we need to create background descriptions from the story nodes
    # This should be done by calling the generate_all_backgrounds endpoint with proper background data
    background_data = []
    for location in locations:
        background_data.append({
            "backgroundId": str(uuid.uuid4()),
            "description": f"A magical fairy tale {location.lower()} with enchanting details"
        })
    
    bg_response = requests.post(
        f"{BASE_URL}/stories/{story_id}/backgrounds/generate-all",
        json={"backgrounds": background_data}
    )
    
    if bg_response.status_code == 200:
        bg_data = bg_response.json()
        if bg_data["success"]:
            backgrounds = bg_data["data"]["backgrounds"]
            print(f"   ✅ Generated {len(backgrounds)} backgrounds")
            for bg in backgrounds:
                status = "✅" if bg["status"] == "completed" else "❌"
                print(f"      {status} {bg['name']}: {bg['status']}")
                if bg.get("imageUrl"):
                    print(f"         🖼️  Image: {bg['imageUrl']}")
        else:
            print(f"   ❌ Background generation failed: {bg_data.get('error', {}).get('message', 'Unknown error')}")
            return
    else:
        print(f"   ❌ HTTP Error: {bg_response.status_code}")
        return
    
    # Step 5: Get updated backgrounds list
    print("\n5️⃣ Getting updated backgrounds list...")
    bg_list_response = requests.get(f"{BASE_URL}/stories/{story_id}/backgrounds")
    
    if bg_list_response.status_code == 200:
        bg_list_data = bg_list_response.json()
        if bg_list_data["success"]:
            backgrounds = bg_list_data["data"]["backgrounds"]
            print(f"   ✅ Retrieved {len(backgrounds)} backgrounds")
            for bg in backgrounds:
                print(f"      📍 {bg['name']} (Scenes: {bg['sceneNumbers']})")
                print(f"         Status: {bg['status']}")
                if bg.get("imageUrl"):
                    print(f"         🖼️  Image: {bg['imageUrl']}")
        else:
            print(f"   ❌ Failed to get backgrounds: {bg_list_data.get('error', {}).get('message', 'Unknown error')}")
    else:
        print(f"   ❌ HTTP Error: {bg_list_response.status_code}")
    
    # Step 6: Test individual background regeneration (if we have backgrounds)
    if bg_response.status_code == 200 and bg_data["success"] and bg_data["data"]["backgrounds"]:
        print("\n6️⃣ Testing individual background regeneration...")
        first_bg = bg_data["data"]["backgrounds"][0]
        bg_id = first_bg["id"]
        
        regenerate_response = requests.post(
            f"{BASE_URL}/stories/{story_id}/backgrounds/{bg_id}/regenerate",
            json={"description": "A more magical and enchanted version of " + first_bg["name"]}
        )
        
        if regenerate_response.status_code == 200:
            regen_data = regenerate_response.json()
            if regen_data["success"]:
                print(f"   ✅ Background regenerated successfully")
                print(f"      🆕 New version: {regen_data['data']['versionId']}")
                print(f"      🖼️  New image: {regen_data['data']['imageUrl']}")
            else:
                print(f"   ❌ Regeneration failed: {regen_data.get('error', {}).get('message', 'Unknown error')}")
        else:
            print(f"   ❌ HTTP Error: {regenerate_response.status_code}")
    
    print("\n🎉 Background generation test completed!")

def check_api_keys():
    """Check if required API keys are configured"""
    print("🔑 Checking API Keys Configuration")
    print("=" * 40)
    
    openai_key = os.getenv("OPENAI_API_KEY")
    fal_key = os.getenv("FAL_KEY")
    
    print(f"OpenAI API Key: {'✅ Configured' if openai_key and openai_key != 'placeholder_openai_key' else '❌ Not configured'}")
    print(f"FAL.ai API Key: {'✅ Configured' if fal_key and fal_key != 'placeholder_fal_ai_key' else '❌ Not configured'}")
    
    if not openai_key or openai_key == 'placeholder_openai_key':
        print("\n⚠️  OpenAI API key is required for background description generation")
        return False
    
    if not fal_key or fal_key == 'placeholder_fal_ai_key':
        print("\n⚠️  FAL.ai API key is not configured - will test with error handling")
        return True  # Allow testing to show error handling
    
    return True

if __name__ == "__main__":
    print("🚀 Frame Fable - Background Generation Test")
    print("=" * 50)
    
    # Check API keys first
    if not check_api_keys():
        print("\n❌ Cannot proceed without proper API key configuration")
        exit(1)
    
    # Test the workflow
    test_background_generation()
