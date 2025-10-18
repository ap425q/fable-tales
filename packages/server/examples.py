"""
Example usage and curl commands for Fable Tales API
"""

# ============================================================================
# CURL EXAMPLES FOR API ENDPOINTS
# ============================================================================

CURL_EXAMPLES = {
    "1_health_check": """
# Health Check
curl http://localhost:8000/api/v1/health
""",

    "2_generate_scenes": """
# Step 1: Generate Educational Scenes
curl -X POST http://localhost:8000/api/v1/comics/scenes/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "teach my kid not to accept candy from strangers",
    "age_group": "5-12"
  }'

# Response will include job_id - save this for subsequent requests
""",

    "3_get_scenes": """
# Step 2: Get Generated Scenes for Review
# Replace {job_id} with the ID from previous response
curl http://localhost:8000/api/v1/comics/{job_id}/scenes
""",

    "4_refine_scenes": """
# Step 3: Provide Feedback and Refine Scenes (Optional)
curl -X POST http://localhost:8000/api/v1/comics/{job_id}/scenes/refine \\
  -H "Content-Type: application/json" \\
  -d '{
    "feedback_list": [
      {
        "scene_id": 1,
        "feedback": "Make the stranger look more suspicious and menacing"
      },
      {
        "scene_id": 2,
        "feedback": "Show more emotion - the child should look scared"
      },
      {
        "scene_id": 3,
        "feedback": "Add more detail to show the child walking away confidently"
      }
    ]
  }'

# If no feedback needed, skip this step
""",

    "5_list_characters": """
# Step 4: View Available Characters
curl http://localhost:8000/api/v1/comics/characters

# Or filter by age group
curl http://localhost:8000/api/v1/comics/characters?age_group=5-8
""",

    "6_select_characters": """
# Step 5: Select Characters for Comic
curl -X POST http://localhost:8000/api/v1/comics/{job_id}/characters/select \\
  -H "Content-Type: application/json" \\
  -d '{
    "characters": [
      {
        "character_type": "boy_young",
        "count": 1
      },
      {
        "character_type": "parent_mom",
        "count": 1
      }
    ]
  }'
""",

    "7_generate_comic": """
# Step 6: Generate Comic Panels with Images
curl -X POST http://localhost:8000/api/v1/comics/{job_id}/generate \\
  -H "Content-Type: application/json"

# This will generate images for all 6 scenes
""",

    "8_get_status": """
# Check Job Status Anytime
curl http://localhost:8000/api/v1/comics/{job_id}/status
""",

    "9_get_result": """
# Step 7: Get Final Comic Result
# Only works after generate_comic completes
curl http://localhost:8000/api/v1/comics/{job_id}/result
"""
}


# ============================================================================
# PYTHON REQUESTS EXAMPLES
# ============================================================================

PYTHON_EXAMPLES = """
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Step 1: Generate Scenes
print("Generating scenes...")
response = requests.post(
    f"{BASE_URL}/comics/scenes/generate",
    json={
        "topic": "teach my kid not to accept candy from strangers",
        "age_group": "5-12"
    }
)
result = response.json()
job_id = result["job_id"]
print(f"Job ID: {job_id}")

# Step 2: Get Generated Scenes
print("\\nGetting generated scenes...")
response = requests.get(f"{BASE_URL}/comics/{job_id}/scenes")
scenes = response.json()["scenes"]
for scene in scenes:
    print(f"Scene {scene['scene_id']}: {scene['title']}")

# Step 3: Refine Scenes (Optional)
print("\\nRefining scenes based on feedback...")
response = requests.post(
    f"{BASE_URL}/comics/{job_id}/scenes/refine",
    json={
        "feedback_list": [
            {
                "scene_id": 1,
                "feedback": "Make the stranger look more suspicious"
            }
        ]
    }
)
print(f"Status: {response.json()['status']}")

# Step 4: List Available Characters
print("\\nAvailable characters:")
response = requests.get(f"{BASE_URL}/comics/characters")
for char_id, char_data in response.json()["characters"].items():
    print(f"  - {char_data['name']} ({char_id})")

# Step 5: Select Characters
print("\\nSelecting characters...")
response = requests.post(
    f"{BASE_URL}/comics/{job_id}/characters/select",
    json={
        "characters": [
            {"character_type": "boy_young", "count": 1},
            {"character_type": "parent_mom", "count": 1}
        ]
    }
)
print(f"Status: {response.json()['status']}")

# Step 6: Generate Comic Panels
print("\\nGenerating comic panels...")
response = requests.post(f"{BASE_URL}/comics/{job_id}/generate")
print(f"Status: {response.json()['status']}")

# Step 7: Get Final Result
print("\\nGetting final comic...")
response = requests.get(f"{BASE_URL}/comics/{job_id}/result")
comic = response.json()
print(f"Comic Title: {comic['title']}")
print(f"Number of Panels: {len(comic['panels'])}")
for panel in comic['panels']:
    print(f"  Panel {panel['panel_id']}: {panel['title']}")
    print(f"    Image: {panel['image_url']}")
"""


# ============================================================================
# JAVASCRIPT/FETCH EXAMPLES
# ============================================================================

JAVASCRIPT_EXAMPLES = """
const BASE_URL = "http://localhost:8000/api/v1";

// Step 1: Generate Scenes
async function generateScenes() {
    const response = await fetch(`${BASE_URL}/comics/scenes/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topic: "teach my kid not to accept candy from strangers",
            age_group: "5-12"
        })
    });
    return response.json();
}

// Step 2: Get Generated Scenes
async function getScenes(jobId) {
    const response = await fetch(`${BASE_URL}/comics/${jobId}/scenes`);
    return response.json();
}

// Step 3: Refine Scenes
async function refineScenes(jobId, feedbackList) {
    const response = await fetch(`${BASE_URL}/comics/${jobId}/scenes/refine`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            feedback_list: feedbackList
        })
    });
    return response.json();
}

// Step 4: List Characters
async function listCharacters() {
    const response = await fetch(`${BASE_URL}/comics/characters`);
    return response.json();
}

// Step 5: Select Characters
async function selectCharacters(jobId, characters) {
    const response = await fetch(`${BASE_URL}/comics/${jobId}/characters/select`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            characters: characters
        })
    });
    return response.json();
}

// Step 6: Generate Comic
async function generateComic(jobId) {
    const response = await fetch(`${BASE_URL}/comics/${jobId}/generate`, {
        method: "POST"
    });
    return response.json();
}

// Step 7: Get Result
async function getComicResult(jobId) {
    const response = await fetch(`${BASE_URL}/comics/${jobId}/result`);
    return response.json();
}

// Complete workflow
async function createComic() {
    try {
        // Generate scenes
        console.log("Generating scenes...");
        let result = await generateScenes();
        const jobId = result.job_id;
        
        // Get scenes
        console.log("Getting scenes...");
        result = await getScenes(jobId);
        console.log("Scenes:", result.scenes);
        
        // Select characters
        console.log("Selecting characters...");
        result = await selectCharacters(jobId, [
            { character_type: "boy_young", count: 1 },
            { character_type: "parent_mom", count: 1 }
        ]);
        
        // Generate comic
        console.log("Generating comic...");
        result = await generateComic(jobId);
        
        // Get result
        console.log("Getting final result...");
        result = await getComicResult(jobId);
        console.log("Comic created:", result);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the workflow
createComic();
"""


# ============================================================================
# WORKFLOW DOCUMENTATION
# ============================================================================

WORKFLOW_STEPS = """
FABLE TALES COMIC CREATION WORKFLOW
====================================

Step 1: Scene Generation
------------------------
- Parent submits a topic (e.g., "teach my kid not to accept candy from strangers")
- OpenAI generates 6 educational scenes
- Each scene includes: title, description, dialogue, learning point, visual elements

Endpoint: POST /api/v1/comics/scenes/generate
Status: Requires Action → Review Scenes

Step 2: Scene Review & Refinement
---------------------------------
- Parent reviews generated scenes
- Parent can provide feedback on specific scenes that need changes
- OpenAI regenerates only the scenes with feedback
- Parent can iterate multiple times until satisfied
- Once satisfied, proceed to next step

Endpoint: POST /api/v1/comics/{job_id}/scenes/refine
Status: Requires Action → Character Selection

Step 3: Character Selection
---------------------------
- Parent browses available character types
- Characters include: young boy, young girl, teen boy, teen girl, mom, dad, friends
- Parent selects up to 4 characters for the comic
- Selected characters will appear in all panels

Endpoint: POST /api/v1/comics/{job_id}/characters/select
Status: Requires Action → Comic Generation

Step 4: Comic Panel Generation
------------------------------
- System converts scene descriptions into detailed image prompts
- For each scene, creates a prompt including:
  - Scene description
  - Character details
  - Dialogue
  - Visual elements
  - Composition preferences
- FAL.ai generates high-quality comic panel images
- Returns 6 complete comic panels

Endpoint: POST /api/v1/comics/{job_id}/generate
Status: Completed

Step 5: Retrieve Final Comic
----------------------------
- Parent receives complete comic with:
  - All 6 panels with images
  - Scene descriptions and dialogue
  - Character information
  - Metadata (creation date, title, etc.)
- Comic ready for viewing, downloading, or sharing

Endpoint: GET /api/v1/comics/{job_id}/result
Status: Completed

WORKFLOW STATE MACHINE
======================

PENDING
   ↓
PROCESSING (Generating Scenes)
   ↓
REQUIRES_ACTION (Scene Review)
   ↓
PROCESSING (Refining if needed)
   ↓
REQUIRES_ACTION (Character Selection)
   ↓
PROCESSING (Generating Images)
   ↓
COMPLETED ✓

Alternative flow if error:
Any state → FAILED

STATUS CHECKS
=============
- Check job status anytime: GET /api/v1/comics/{job_id}/status
- Get current step, progress (0-100), and any error messages
- Use this to build real-time progress indicators in frontend
"""


# ============================================================================
# COMMON TOPICS FOR TESTING
# ============================================================================

SAMPLE_TOPICS = [
    "teach my kid not to accept candy from strangers",
    "importance of sharing with friends",
    "how to handle bullying at school",
    "teaching children about traffic safety",
    "importance of brushing teeth and dental hygiene",
    "teaching kids to be kind to animals",
    "how to make new friends",
    "importance of washing hands and staying clean",
    "handling emotions like anger and frustration",
    "courage - doing things that scare you",
    "honesty - telling the truth even when it's hard",
    "respect - listening and respecting others",
]


if __name__ == "__main__":
    print("=" * 70)
    print("FABLE TALES API EXAMPLES")
    print("=" * 70)
    
    print("\n" + "=" * 70)
    print("CURL COMMANDS")
    print("=" * 70)
    
    for name, curl_cmd in CURL_EXAMPLES.items():
        print(f"\n{name.upper()}")
        print("-" * 70)
        print(curl_cmd)
    
    print("\n" + "=" * 70)
    print("PYTHON REQUESTS EXAMPLE")
    print("=" * 70)
    print(PYTHON_EXAMPLES)
    
    print("\n" + "=" * 70)
    print("JAVASCRIPT/FETCH EXAMPLE")
    print("=" * 70)
    print(JAVASCRIPT_EXAMPLES)
    
    print("\n" + "=" * 70)
    print("WORKFLOW")
    print("=" * 70)
    print(WORKFLOW_STEPS)
    
    print("\n" + "=" * 70)
    print("SAMPLE TOPICS FOR TESTING")
    print("=" * 70)
    for i, topic in enumerate(SAMPLE_TOPICS, 1):
        print(f"{i}. {topic}")
