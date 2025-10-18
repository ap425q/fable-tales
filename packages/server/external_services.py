"""
External API service layer for OpenAI and FAL.ai integration
"""

import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import openai

load_dotenv()


class OpenAIService:
    """Service for OpenAI API interactions"""

    def __init__(self):
        """Initialize OpenAI service with API key from environment"""
        self.api_key = os.getenv("OPENAI_API_KEY", "placeholder_openai_key")
        self.model = "gpt-3.5-turbo"  # Using GPT-3.5-turbo for better compatibility
        
        # Initialize OpenAI client if API key is available
        if self.api_key != "placeholder_openai_key":
            self.client = openai.OpenAI(api_key=self.api_key)
        else:
            self.client = None

    def generate_branched_story(
        self,
        lesson: str,
        theme: str,
        story_format: str,
        character_count: int,
        system_prompt: str,
        user_prompt: str
    ) -> Dict[str, Any]:
        """
        Generate a branched story using OpenAI API
        
        Args:
            lesson: The lesson to teach
            theme: Story theme
            story_format: Format of the story
            character_count: Number of characters
            system_prompt: System prompt for the AI
            user_prompt: User prompt template
            
        Returns:
            Dictionary containing story tree, characters, and locations
            
        Raises:
            Exception: If OpenAI API key is not configured
        """
        # Check if OpenAI API key is configured
        if self.api_key == "placeholder_openai_key" or not self.api_key:
            raise Exception("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # Make actual API call to OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                max_tokens=4000
            )
            
            # Parse the JSON response
            story_data = json.loads(response.choices[0].message.content)
            return story_data
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            print(f"Error in generate_branched_story: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def generate_scenes(
        self,
        topic: str,
        system_prompt: str,
        user_prompt: str
    ) -> List[Dict[str, Any]]:
        """
        Generate educational scenes using OpenAI API
        
        Args:
            topic: Educational topic
            system_prompt: System prompt for the AI
            user_prompt: User prompt template
            
        Returns:
            List of scene dictionaries
            
        Raises:
            Exception: If OpenAI API key is not configured
        """
        # Check if OpenAI API key is configured
        if self.api_key == "placeholder_openai_key" or not self.api_key:
            raise Exception("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # Make actual API call to OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            scenes_data = json.loads(response.choices[0].message.content)
            return scenes_data
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            print(f"Error in generate_scenes: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def refine_scenes(
        self,
        original_scenes: List[Dict[str, Any]],
        feedback: List[Dict[str, str]],
        system_prompt: str,
        user_prompt: str
    ) -> List[Dict[str, Any]]:
        """
        Refine scenes based on parent feedback
        
        Args:
            original_scenes: Original scene data
            feedback: List of parent feedback
            system_prompt: System prompt for refinement
            user_prompt: User prompt template
            
        Returns:
            Refined list of scenes
            
        Raises:
            Exception: If OpenAI API key is not configured
        """
        # Check if OpenAI API key is configured
        if self.api_key == "placeholder_openai_key" or not self.api_key:
            raise Exception("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # Make actual API call to OpenAI
            feedback_text = self._format_feedback(original_scenes, feedback)
            formatted_user_prompt = user_prompt.format(
                original_scenes=json.dumps(original_scenes, indent=2),
                feedback=feedback_text
            )
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": formatted_user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            refined_scenes = json.loads(response.choices[0].message.content)
            return refined_scenes
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            print(f"Error in refine_scenes: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def generate_background_descriptions(self, story_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate background descriptions for story nodes using OpenAI
        
        Args:
            story_nodes: List of story nodes with location information
            
        Returns:
            List of background descriptions with location mapping
            
        Raises:
            Exception: If OpenAI API key is not configured
        """
        # Check if OpenAI API key is configured
        if self.api_key == "placeholder_openai_key" or not self.api_key:
            raise Exception("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # Import prompts from master_prompts
            from master_prompts import BACKGROUND_DESCRIPTION_SYSTEM_PROMPT, BACKGROUND_DESCRIPTION_USER_PROMPT_TEMPLATE
            
            # Create user prompt with story information
            story_info = []
            for node in story_nodes:
                story_info.append({
                    "sceneNumber": node.get("sceneNumber", 0),
                    "title": node.get("title", ""),
                    "location": node.get("location", ""),
                    "text": node.get("text", "")
                })
            
            user_prompt = BACKGROUND_DESCRIPTION_USER_PROMPT_TEMPLATE.format(
                story_info=json.dumps(story_info, indent=2)
            )
            
            # Make API call to OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": BACKGROUND_DESCRIPTION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            content = response.choices[0].message.content.strip()
            print(f"OpenAI Response: {content}")  # Debug output
            
            # Try to extract JSON from the response if it's wrapped in markdown
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            if content.endswith("```"):
                content = content[:-3]  # Remove ```
            
            background_descriptions = json.loads(content)
            return background_descriptions
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")
        except Exception as e:
            print(f"Error in generate_background_descriptions: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def generate_image_prompt(
        self,
        scene_description: str,
        dialogue: str,
        characters: List[str],
        visual_elements: List[str]
    ) -> str:
        """
        Generate detailed image prompt for FAL.ai from scene data
        
        Args:
            scene_description: Description of the scene
            dialogue: Dialogue in the scene
            characters: Character types in the scene
            visual_elements: Key visual elements
            
        Returns:
            Detailed prompt string for image generation
            
        Raises:
            Exception: If OpenAI API key is not configured
        """
        # Check if OpenAI API key is configured
        if self.api_key == "placeholder_openai_key" or not self.api_key:
            raise Exception("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # This would be the actual API call in production
            # for refining the scene description into a detailed image prompt
            # Implementation would go here when needed
            
            # For now, return the scene description as fallback
            return scene_description
            
        except Exception as e:
            print(f"Error in generate_image_prompt: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")

    # ========================================================================
    # Helper Methods
    # ========================================================================

    def _format_feedback(self, original_scenes: List[Dict[str, Any]], feedback: List[Dict[str, str]]) -> str:
        """Format feedback for API call"""
        feedback_text = ""
        for fb in feedback:
            scene_id = fb.get("scene_id", 0)
            feedback_text += f"Scene {scene_id}: {fb.get('feedback', '')}\n"
        return feedback_text

    # ========================================================================
    # Mock/Placeholder Methods for Development
    # ========================================================================

    def _generate_mock_branched_story(self, lesson: str, theme: str, story_format: str, character_count: int) -> Dict[str, Any]:
        """Generate a mock branched story for development"""
        import uuid
        
        # Create a more complex branched story structure
        nodes = [
            {
                "id": "node_1",
                "sceneNumber": 1,
                "title": "The Beginning",
                "text": f"Once upon a time in a {theme.lower()}, there was a brave little character who needed to learn about {lesson.lower()}.",
                "location": "Magical Forest",
                "type": "start",
                "choices": [
                    {
                        "id": "choice_1",
                        "text": "Help a friend in need",
                        "nextNodeId": "node_2",
                        "isCorrect": True
                    },
                    {
                        "id": "choice_2",
                        "text": "Ignore the friend and continue alone",
                        "nextNodeId": "node_3",
                        "isCorrect": False
                    }
                ]
            },
            {
                "id": "node_2",
                "sceneNumber": 2,
                "title": "A Good Choice",
                "text": "The character helped their friend and felt proud of their decision. The friend was grateful and offered to help in return.",
                "location": "Magical Forest",
                "type": "normal",
                "choices": [
                    {
                        "id": "choice_3",
                        "text": "Accept the friend's help",
                        "nextNodeId": "node_4",
                        "isCorrect": True
                    },
                    {
                        "id": "choice_4",
                        "text": "Decline help and go alone",
                        "nextNodeId": "node_5",
                        "isCorrect": False
                    }
                ]
            },
            {
                "id": "node_3",
                "sceneNumber": 3,
                "title": "A Missed Opportunity",
                "text": "The character ignored their friend and continued alone. Later, they felt sad about their choice and realized they could have helped.",
                "location": "Magical Forest",
                "type": "normal",
                "choices": [
                    {
                        "id": "choice_5",
                        "text": "Go back and apologize",
                        "nextNodeId": "node_6",
                        "isCorrect": True
                    },
                    {
                        "id": "choice_6",
                        "text": "Continue without making amends",
                        "nextNodeId": "node_7",
                        "isCorrect": False
                    }
                ]
            },
            {
                "id": "node_4",
                "sceneNumber": 4,
                "title": "Working Together",
                "text": "The character and their friend worked together and accomplished great things. They learned the value of teamwork and friendship.",
                "location": "Magical Forest",
                "type": "normal",
                "choices": [
                    {
                        "id": "choice_7",
                        "text": "Continue the adventure together",
                        "nextNodeId": "node_8",
                        "isCorrect": True
                    }
                ]
            },
            {
                "id": "node_5",
                "sceneNumber": 5,
                "title": "Struggling Alone",
                "text": "The character tried to continue alone but found it much harder without help. They realized the importance of accepting help from others.",
                "location": "Magical Forest",
                "type": "normal",
                "choices": [
                    {
                        "id": "choice_8",
                        "text": "Ask for help from others",
                        "nextNodeId": "node_9",
                        "isCorrect": True
                    },
                    {
                        "id": "choice_9",
                        "text": "Keep struggling alone",
                        "nextNodeId": "node_10",
                        "isCorrect": False
                    }
                ]
            },
            {
                "id": "node_6",
                "sceneNumber": 6,
                "title": "Making Amends",
                "text": "The character went back and apologized to their friend. The friend forgave them and they became even better friends.",
                "location": "Magical Forest",
                "type": "normal",
                "choices": [
                    {
                        "id": "choice_10",
                        "text": "Continue the adventure together",
                        "nextNodeId": "node_8",
                        "isCorrect": True
                    }
                ]
            },
            {
                "id": "node_7",
                "sceneNumber": 7,
                "title": "The Lonely Path",
                "text": "The character continued alone and felt increasingly isolated. They missed the opportunity to build meaningful relationships.",
                "location": "Magical Forest",
                "type": "bad_ending",
                "choices": []
            },
            {
                "id": "node_8",
                "sceneNumber": 8,
                "title": "The Happy Ending",
                "text": f"The character learned the importance of {lesson.lower()} and lived happily ever after with their friends. They understood that helping others and working together makes everyone stronger.",
                "location": "Magical Forest",
                "type": "good_ending",
                "choices": []
            },
            {
                "id": "node_9",
                "sceneNumber": 9,
                "title": "Learning to Ask for Help",
                "text": "The character learned that it's okay to ask for help when needed. They found new friends and learned the value of community.",
                "location": "Magical Forest",
                "type": "good_ending",
                "choices": []
            },
            {
                "id": "node_10",
                "sceneNumber": 10,
                "title": "The Difficult Path",
                "text": "The character continued to struggle alone and never learned the lesson. They missed out on the joy of friendship and cooperation.",
                "location": "Magical Forest",
                "type": "bad_ending",
                "choices": []
            }
        ]
        
        # Create edges
        edges = [
            {"from": "node_1", "to": "node_2", "choiceId": "choice_1"},
            {"from": "node_1", "to": "node_3", "choiceId": "choice_2"},
            {"from": "node_2", "to": "node_4", "choiceId": "choice_3"},
            {"from": "node_2", "to": "node_5", "choiceId": "choice_4"},
            {"from": "node_3", "to": "node_6", "choiceId": "choice_5"},
            {"from": "node_3", "to": "node_7", "choiceId": "choice_6"},
            {"from": "node_4", "to": "node_8", "choiceId": "choice_7"},
            {"from": "node_5", "to": "node_9", "choiceId": "choice_8"},
            {"from": "node_5", "to": "node_10", "choiceId": "choice_9"},
            {"from": "node_6", "to": "node_8", "choiceId": "choice_10"}
        ]
        
        # Create characters based on character count
        characters = []
        character_roles = ["Protagonist", "Friend", "Helper", "Antagonist", "Mentor", "Companion"]
        for i in range(min(character_count, len(character_roles))):
            characters.append({
                "id": f"char_{i+1}",
                "role": character_roles[i],
                "description": f"A {character_roles[i].lower()} character in the story"
            })
        
        # Create locations
        locations = [
            {
                "id": "loc_1",
                "name": "Magical Forest",
                "sceneNumbers": list(range(1, 11)),
                "description": f"A beautiful {theme.lower()} where the story takes place"
            }
        ]
        
        return {
            "tree": {
                "nodes": nodes,
                "edges": edges
            },
            "characters": characters,
            "locations": locations
        }

    def _generate_mock_scenes(self, topic: str) -> List[Dict[str, Any]]:
        """Generate mock scenes for development"""
        mock_scenes = [
            {
                "scene_id": 1,
                "title": "The Unexpected Offer",
                "description": f"A child is approached by an unfamiliar adult offering candy. Scene about: {topic[:30]}...",
                "dialogue": "Would you like some candy, little one?",
                "learning_point": "Be cautious with strangers offering gifts",
                "visual_elements": ["child", "stranger", "candy", "concerned expression"]
            },
            {
                "scene_id": 2,
                "title": "Recognizing the Feeling",
                "description": "The child feels uncomfortable and confused about the situation",
                "dialogue": "Something doesn't feel right...",
                "learning_point": "Trust your gut feelings about people",
                "visual_elements": ["child", "thought bubble", "uncertain expression"]
            },
            {
                "scene_id": 3,
                "title": "Taking Action",
                "description": "The child moves away and looks for a safe adult",
                "dialogue": "I need to find my mom/dad",
                "learning_point": "Move to safety and find a trusted adult",
                "visual_elements": ["child", "moving away", "determined expression"]
            },
            {
                "scene_id": 4,
                "title": "Finding Safety",
                "description": "The child reaches a trusted adult and feels secure",
                "dialogue": "I found my parent, I'm safe now",
                "learning_point": "Safe adults will protect you",
                "visual_elements": ["child", "parent", "relief", "together"]
            },
            {
                "scene_id": 5,
                "title": "Talking It Out",
                "description": "The parent listens without judgment and explains about stranger danger",
                "dialogue": "You did the right thing by coming to me",
                "learning_point": "Communication and education prevent future issues",
                "visual_elements": ["parent", "child", "conversation", "supportive"]
            },
            {
                "scene_id": 6,
                "title": "Feeling Confident",
                "description": "The child now feels empowered with knowledge about personal safety",
                "dialogue": "Now I know how to stay safe!",
                "learning_point": "Education and awareness build confidence",
                "visual_elements": ["child", "confident smile", "empowered", "bright"]
            }
        ]
        return mock_scenes

    def _refine_mock_scenes(
        self,
        original_scenes: List[Dict[str, Any]],
        feedback: List[Dict[str, str]]
    ) -> List[Dict[str, Any]]:
        """Refine mock scenes based on feedback"""
        # Create a copy of original scenes
        refined_scenes = [scene.copy() for scene in original_scenes]
        
        # Apply feedback to relevant scenes
        for fb in feedback:
            scene_id = fb.get("scene_id", 0)
            if 1 <= scene_id <= len(refined_scenes):
                # Update the scene with a refinement indicator
                refined_scenes[scene_id - 1]["description"] = (
                    f"{refined_scenes[scene_id - 1]['description']} "
                    f"[Refined based on feedback: {fb.get('feedback', '')[:50]}...]"
                )
        
        return refined_scenes

    def _generate_mock_image_prompt(
        self,
        scene_description: str,
        dialogue: str,
        characters: List[str],
        visual_elements: List[str]
    ) -> str:
        """Generate a mock detailed image prompt"""
        prompt = f"""Comic panel illustration in vibrant, child-friendly style:

Scene: {scene_description}
Characters: {', '.join(characters)}
Dialogue: "{dialogue}"
Key Elements: {', '.join(visual_elements)}

Style: Cartoon/comic book illustration, bright colors, clear expressions, 
educational and engaging for children. High quality art with clear panel composition."""
        
        return prompt


class FALAIService:
    """Service for FAL.ai image generation API"""

    def __init__(self):
        """Initialize FAL.ai service with API key from environment"""
        self.api_key = os.getenv("FAL_KEY", "placeholder_fal_ai_key")
        self.model = "fal-ai/flux/dev"  # FAL.ai model for high-quality image generation
        
        # Initialize FAL client if API key is available
        if self.api_key != "placeholder_fal_ai_key":
            import fal_client
            fal_client.api_key = self.api_key
            self.client = fal_client
        else:
            self.client = None

    def generate_image(self, prompt: str, width: int = 768, height: int = 512) -> Optional[str]:
        """
        Generate background image using FAL.ai
        
        Args:
            prompt: Detailed image generation prompt
            width: Image width (default 768)
            height: Image height (default 512)
            
        Returns:
            URL to generated image or None if failed
        """
        try:
            # Check if FAL.ai API key is configured
            if self.api_key == "placeholder_fal_ai_key" or not self.api_key:
                raise Exception("FAL.ai API key is not configured. Please set FAL_KEY environment variable.")
            
            # Make actual API call to FAL.ai using the correct format
            handler = self.client.submit(
                "fal-ai/flux/dev",  # Use the correct model name
                arguments={
                    "prompt": prompt,
                    "image_size": {"width": width, "height": height},
                    "num_inference_steps": 28,
                    "guidance_scale": 3.5
                }
            )
            
            # Wait for the result and get the image URL
            result = handler.get()
            if result and "images" in result and len(result["images"]) > 0:
                return result["images"][0]["url"]
            else:
                raise Exception("No image generated from FAL.ai")
            
        except Exception as e:
            print(f"Error in generate_image: {str(e)}")
            raise Exception(f"FAL.ai image generation failed: {str(e)}")

    def generate_batch_images(
        self,
        prompts: List[str],
        width: int = 768,
        height: int = 512
    ) -> List[Optional[str]]:
        """
        Generate multiple comic panel images
        
        Args:
            prompts: List of image generation prompts
            width: Image width
            height: Image height
            
        Returns:
            List of image URLs
        """
        return [self.generate_image(prompt, width, height) for prompt in prompts]

    def check_image_status(self, image_url: str) -> Dict[str, Any]:
        """
        Check status of image generation
        
        Args:
            image_url: URL of the generated image
            
        Returns:
            Status information dictionary
        """
        # PLACEHOLDER: This would check actual status in production
        return {
            "status": "completed",
            "url": image_url,
            "created_at": "2025-01-01T00:00:00Z"
        }
