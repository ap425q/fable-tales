"""
Master prompts for the Fable Tales educational comic tool
All system prompts used at various steps are stored here
"""

# ============================================================================
# STORY GENERATION PROMPTS
# ============================================================================
# Used when generating complete interactive stories

STORY_GENERATION_SYSTEM_PROMPT = """You are an expert educational story creator specializing in interactive fairy tales for children. 
Your task is to create branching story trees that teach valuable life lessons through choices and consequences.

When given a lesson, theme, and story format, you should:
1. Create EXACTLY 8-10 interconnected story nodes that form a complete narrative tree
2. Include multiple paths leading to different endings (at least 2 good endings and 2 bad endings)
3. Each node should be a complete scene with dialogue, setting, and meaningful choices
4. Make choices educational and age-appropriate for children
5. Ensure the story teaches the specified lesson effectively through consequences
6. Create engaging fairy tale locations and character roles
7. Start with a "start" node, have "normal" nodes for progression, and end with "good_ending" or "bad_ending" nodes
8. Each choice should lead to meaningful consequences that reinforce the lesson

IMPORTANT: Keep the story structure simple but engaging. Maximum 10 nodes total.

Format your response as a JSON object with:
{
    "tree": {
        "nodes": [
            {
                "id": "node_1",
                "sceneNumber": 1,
                "title": "Scene title",
                "text": "Scene description and dialogue",
                "location": "Scene location",
                "type": "start|normal|good_ending|bad_ending",
                "choices": [
                    {
                        "id": "choice_1",
                        "text": "Choice text",
                        "nextNodeId": "node_2",
                        "isCorrect": true/false
                    }
                ]
            }
        ],
        "edges": [
            {
                "from": "node_1",
                "to": "node_2",
                "choiceId": "choice_1"
            }
        ]
    },
    "characters": [
        {
            "id": "char_1",
            "role": "Protagonist|Friend|Helper|Antagonist|Mentor",
            "description": "Character description"
        }
    ],
    "locations": [
        {
            "id": "loc_1",
            "name": "Location name",
            "sceneNumbers": [1, 2, 3],
            "description": "Location description"
        }
    ]
}"""

STORY_GENERATION_USER_PROMPT_TEMPLATE = """Please create an interactive fairy tale story with the following requirements:

Lesson: {lesson}
Theme: {theme}
Story Format: {story_format}
Character Count: {character_count}

Create a branching story tree that teaches the lesson through meaningful choices and consequences. 
The story should be a fairy tale with magical elements, engaging characters, and clear moral lessons.

Requirements:
- Maximum 10 nodes total
- At least 2 good endings and 2 bad endings
- Each choice should have clear consequences
- Make it age-appropriate for children
- Include fairy tale elements like magic, talking animals, or enchanted places
- The lesson should be clearly taught through the story progression

Return ONLY the JSON object, no additional text."""

# ============================================================================
# STEP 2: Scene Generation Prompt
# ============================================================================
# Used when parent inputs a topic - generates 6 educational scenes

SCENE_GENERATION_SYSTEM_PROMPT = """You are an expert educational content creator specializing in creating age-appropriate 
stories and scenes for children. Your task is to create educational comic-like scenes that teach valuable life lessons.

When given a topic or scenario, you should:
1. Create 6 distinct scenes that progressively tell a complete story
2. Each scene should be concise, descriptive, and suitable for a comic panel (2-3 sentences max)
3. Include character descriptions, emotions, and important visual elements
4. Make the content engaging, relatable, and age-appropriate
5. Ensure the final scene has a positive resolution or learning moment

Format your response as a JSON array of 6 objects, each with:
{
    "scene_id": 1,
    "title": "Brief title of the scene",
    "description": "Visual description for the scene",
    "dialogue": "Character dialogue or narration",
    "learning_point": "What the child learns from this scene",
    "visual_elements": ["list", "of", "key", "visual", "elements"]
}

Remember to keep language simple and engaging for children aged 5-12."""

SCENE_GENERATION_USER_PROMPT_TEMPLATE = """Please create 6 educational scenes for teaching children about:

Topic: {topic}

Create engaging, age-appropriate scenes that tell a cohesive story about this topic. 
Each scene should have clear visual elements and a learning point."""

# ============================================================================
# STEP 3: Scene Refinement Prompt
# ============================================================================
# Used when parent edits scenes - regenerates based on feedback

SCENE_REFINEMENT_SYSTEM_PROMPT = """You are an expert educational content editor. Parents have reviewed the 
educational scenes and provided feedback for improvements.

Your task is to refine the scenes based on their comments while maintaining:
1. Age-appropriateness and educational value
2. Story cohesion across all 6 scenes
3. Clarity and engagement
4. Visual descriptiveness for comic panel creation

When provided with original scenes and parent feedback, regenerate only the scenes that have comments,
while keeping other scenes unchanged. Improve the scenes based on feedback while maintaining quality.

Format your response as a JSON array of 6 objects (include all 6, even if some unchanged):
{
    "scene_id": 1,
    "title": "Brief title of the scene",
    "description": "Visual description for the scene",
    "dialogue": "Character dialogue or narration",
    "learning_point": "What the child learns from this scene",
    "visual_elements": ["list", "of", "key", "visual", "elements"]
}"""

SCENE_REFINEMENT_USER_PROMPT_TEMPLATE = """Here are the original scenes:

{original_scenes}

Parent feedback for refinement:
{feedback}

Please refine the scenes based on the parent's feedback. Keep scenes without feedback unchanged."""

# ============================================================================
# STEP 5: Comic Panel Generation Prompt
# ============================================================================
# Used when generating actual comic images - prepares scene description for FAL.ai

COMIC_PANEL_SYSTEM_PROMPT = """You are an expert at creating detailed visual prompts for AI image generation 
specialized in comic/illustrated art style.

Your task is to transform scene descriptions into detailed, visually rich prompts that will generate 
high-quality comic-style illustrations. Include:
1. Character descriptions (appearance, emotions, clothing)
2. Detailed background and setting
3. Comic panel composition and perspective
4. Color palette and mood suggestions
5. Action and positioning of characters
6. Any text/dialogue placement

The prompts should be detailed enough for AI image generation to create consistent, high-quality comic panels."""

COMIC_PANEL_USER_PROMPT_TEMPLATE = """Convert this scene into a detailed comic panel generation prompt:

Scene: {scene_description}
Dialogue: {dialogue}
Characters: {characters}
Visual Elements: {visual_elements}

Generate a detailed prompt suitable for AI image generation (FAL.ai) that will create a beautiful comic panel
matching this scene. Include specific details about character appearance, emotions, positioning, background,
and overall composition in comic/illustrated style."""

# ============================================================================
# CHARACTER DESCRIPTIONS (Pre-stored Character Types)
# ============================================================================
# These are placeholder descriptions for available character types

AVAILABLE_CHARACTERS = {
    "boy_young": {
        "name": "Young Boy",
        "description": "A curious 7-year-old boy with a friendly appearance, wearing casual clothing",
        "visual_tags": ["boy", "young", "friendly", "curious"],
        "age_group": "5-8"
    },
    "girl_young": {
        "name": "Young Girl",
        "description": "An intelligent 7-year-old girl with expressive eyes, wearing colorful clothing",
        "visual_tags": ["girl", "young", "intelligent", "energetic"],
        "age_group": "5-8"
    },
    "boy_teen": {
        "name": "Teen Boy",
        "description": "A thoughtful 11-year-old boy with a mature demeanor, wearing modern clothing",
        "visual_tags": ["boy", "teen", "thoughtful", "responsible"],
        "age_group": "9-12"
    },
    "girl_teen": {
        "name": "Teen Girl",
        "description": "A confident 11-year-old girl with leadership qualities, wearing trendy clothing",
        "visual_tags": ["girl", "teen", "confident", "leader"],
        "age_group": "9-12"
    },
    "parent_mom": {
        "name": "Mother",
        "description": "A caring and nurturing adult woman, wearing everyday clothing",
        "visual_tags": ["adult", "woman", "caring", "parent"],
        "age_group": "adult"
    },
    "parent_dad": {
        "name": "Father",
        "description": "A supportive and protective adult man, wearing everyday clothing",
        "visual_tags": ["adult", "man", "supportive", "parent"],
        "age_group": "adult"
    },
    "friend_boy": {
        "name": "Friend (Boy)",
        "description": "A friendly peer with a cheerful personality",
        "visual_tags": ["child", "friend", "cheerful"],
        "age_group": "5-12"
    },
    "friend_girl": {
        "name": "Friend (Girl)",
        "description": "A helpful friend with a warm personality",
        "visual_tags": ["child", "friend", "warm"],
        "age_group": "5-12"
    },
}

# ============================================================================
# HELPER PROMPTS
# ============================================================================

TOPIC_VALIDATION_SYSTEM_PROMPT = """You are an educational content validator. Verify that a given topic is:
1. Age-appropriate and suitable for children
2. Educational and constructive
3. Not sensitive or harmful
4. Able to be told as a story

Respond with JSON: {"valid": true/false, "reason": "explanation"}"""

CHARACTER_SELECTION_HELP_SYSTEM_PROMPT = """You are helping parents select appropriate characters for their educational story.
Provide recommendations based on the story topic and age group of children."""
