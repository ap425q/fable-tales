"""
External API service layer for OpenAI and FAL.ai integration
"""

import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class OpenAIService:
    """Service for OpenAI API interactions"""

    def __init__(self):
        """Initialize OpenAI service with API key from environment"""
        self.api_key = os.getenv("OPENAI_API_KEY", "placeholder_openai_key")
        self.model = "gpt-4"  # Using GPT-4 for better scene generation

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
        """
        try:
            # PLACEHOLDER: This would call actual OpenAI API in production
            # For now, returning mock data
            
            if self.api_key == "placeholder_openai_key":
                # Return mock response for development
                return self._generate_mock_scenes(topic)
            
            # This would be the actual API call in production:
            # response = openai.ChatCompletion.create(
            #     model=self.model,
            #     messages=[
            #         {"role": "system", "content": system_prompt},
            #         {"role": "user", "content": user_prompt}
            #     ],
            #     temperature=0.7,
            #     max_tokens=2000
            # )
            # return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error in generate_scenes: {str(e)}")
            return []

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
        """
        try:
            # PLACEHOLDER: This would call actual OpenAI API in production
            if self.api_key == "placeholder_openai_key":
                return self._refine_mock_scenes(original_scenes, feedback)
            
            # This would be the actual API call in production:
            # feedback_text = self._format_feedback(original_scenes, feedback)
            # response = openai.ChatCompletion.create(
            #     model=self.model,
            #     messages=[
            #         {"role": "system", "content": system_prompt},
            #         {"role": "user", "content": user_prompt.format(...)}
            #     ],
            #     temperature=0.7,
            #     max_tokens=2000
            # )
            # return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error in refine_scenes: {str(e)}")
            return original_scenes

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
        """
        try:
            # PLACEHOLDER: This would call actual OpenAI API in production
            if self.api_key == "placeholder_openai_key":
                return self._generate_mock_image_prompt(
                    scene_description, dialogue, characters, visual_elements
                )
            
            # This would be the actual API call in production
            # for refining the scene description into a detailed image prompt
            
        except Exception as e:
            print(f"Error in generate_image_prompt: {str(e)}")
            return scene_description

    # ========================================================================
    # Mock/Placeholder Methods for Development
    # ========================================================================

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
        self.api_key = os.getenv("FAL_AI_API_KEY", "placeholder_fal_ai_key")
        self.model = "flux-pro"  # FAL.ai model for high-quality image generation

    def generate_image(self, prompt: str, width: int = 768, height: int = 512) -> Optional[str]:
        """
        Generate comic panel image using FAL.ai
        
        Args:
            prompt: Detailed image generation prompt
            width: Image width (default 768)
            height: Image height (default 512)
            
        Returns:
            URL to generated image or None if failed
        """
        try:
            # PLACEHOLDER: This would call actual FAL.ai API in production
            if self.api_key == "placeholder_fal_ai_key":
                # Return mock URL for development
                import hashlib
                prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
                return f"https://placeholder-fal.ai/image/{prompt_hash}.png"
            
            # This would be the actual API call in production:
            # import fal_client
            # result = fal_client.submit(
            #     "fal-ai/flux-pro",
            #     arguments={
            #         "prompt": prompt,
            #         "image_size": {"width": width, "height": height}
            #     }
            # )
            # return result.get("image").get("url")
            
        except Exception as e:
            print(f"Error in generate_image: {str(e)}")
            return None

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
