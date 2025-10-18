#!/usr/bin/env python3
"""
Test script for the story generation endpoint
Demonstrates the functionality of the /stories/generate API
"""

import requests
import json
import time

def test_story_generation():
    """Test the story generation endpoint with different inputs"""
    
    base_url = "http://localhost:8000/api/v1"
    
    # Test cases with different lessons and themes
    test_cases = [
        {
            "lesson": "sharing is caring",
            "theme": "magical forest",
            "storyFormat": "fairy tale",
            "characterCount": 4
        },
        {
            "lesson": "honesty is the best policy",
            "theme": "enchanted castle",
            "storyFormat": "fairy tale",
            "characterCount": 3
        },
        {
            "lesson": "kindness to others",
            "theme": "underwater kingdom",
            "storyFormat": "fairy tale",
            "characterCount": 5
        }
    ]
    
    print("🧚‍♀️ Testing Fairy Tale Story Generation API 🧚‍♀️")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📖 Test Case {i}: {test_case['lesson']}")
        print(f"   Theme: {test_case['theme']}")
        print(f"   Characters: {test_case['characterCount']}")
        
        try:
            # Make the API request
            response = requests.post(
                f"{base_url}/stories/generate",
                json=test_case,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data["success"]:
                    story_data = data["data"]
                    story_id = story_data["storyId"]
                    nodes = story_data["tree"]["nodes"]
                    edges = story_data["tree"]["edges"]
                    characters = story_data["characters"]
                    locations = story_data["locations"]
                    
                    print(f"   ✅ Success! Story ID: {story_id}")
                    print(f"   📊 Stats:")
                    print(f"      - Nodes: {len(nodes)}")
                    print(f"      - Edges: {len(edges)}")
                    print(f"      - Characters: {len(characters)}")
                    print(f"      - Locations: {len(locations)}")
                    
                    # Count different node types
                    node_types = {}
                    for node in nodes:
                        node_type = node["type"]
                        node_types[node_type] = node_types.get(node_type, 0) + 1
                    
                    print(f"   🎭 Node Types: {node_types}")
                    
                    # Show first few nodes
                    print(f"   📝 First 3 scenes:")
                    for node in nodes[:3]:
                        print(f"      {node['sceneNumber']}. {node['title']} ({node['type']})")
                        if node['choices']:
                            print(f"         Choices: {len(node['choices'])}")
                    
                else:
                    error_msg = data.get('error', {}).get('message', 'Unknown error')
                    if 'OpenAI API key is not configured' in error_msg:
                        print(f"   ⚠️  Expected: {error_msg}")
                    else:
                        print(f"   ❌ Failed: {error_msg}")
            else:
                print(f"   ❌ HTTP Error: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Connection Error: Make sure the server is running on localhost:8000")
            break
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        # Small delay between requests
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("🎉 Test completed!")

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n🏥 Testing Health Endpoint...")
    
    try:
        response = requests.get("http://localhost:8000/api/v1/health")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health Check: {data['status']}")
            print(f"   📋 Service: {data['service']}")
            print(f"   🔢 Version: {data['version']}")
        else:
            print(f"   ❌ Health Check Failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health Check Error: {str(e)}")

if __name__ == "__main__":
    test_health_endpoint()
    test_story_generation()
