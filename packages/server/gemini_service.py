"""
Gemini AI Service
Handles image generation using Google's Gemini 2.5 Flash Image model
"""

import base64
import os
from io import BytesIO
from typing import Optional

from google import genai
from PIL import Image


class GeminiService:
    """Service for Gemini AI image generation"""
    
    def __init__(self):
        """Initialize Gemini service with API key from environment"""
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key or self.api_key == "placeholder":
            print("⚠️ Warning: GOOGLE_API_KEY not configured")
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)
            self.model = "gemini-2.5-flash-image"
    
    def generate_image(self, prompt: str) -> Optional[str]:
        """
        Generate an image using Gemini
        
        Args:
            prompt: Text prompt for image generation
            
        Returns:
            Base64 encoded image data or None if failed
        """
        if not self.client:
            raise Exception("Gemini API key is not configured. Please set GOOGLE_API_KEY environment variable.")
        
        try:
            print(f"🎨 Generating image with Gemini: {prompt[:100]}...")
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=[prompt],
            )
            
            # Extract image data from response
            for part in response.candidates[0].content.parts:
                if getattr(part, "inline_data", None):
                    # Gemini returns RAW IMAGE BYTES (not base64!)
                    image_bytes = part.inline_data.data
                    
                    print("✅ Image generated successfully with Gemini")
                    print(f"   Image size: {len(image_bytes)} bytes", flush=True)
                    
                    # Return the raw bytes directly
                    return image_bytes
            
            raise Exception("No image data found in Gemini response")
            
        except Exception as e:
            print(f"❌ Error generating image with Gemini: {str(e)}")
            raise Exception(f"Gemini image generation failed: {str(e)}")
    
    def save_base64_image(self, base64_data: str, filepath: str) -> bool:
        """
        Save base64 encoded image to file
        
        Args:
            base64_data: Base64 encoded image data (with or without data URI prefix)
            filepath: Path to save the image
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Remove data URI prefix if present
            if base64_data.startswith('data:'):
                base64_data = base64_data.split(',')[1]
            
            # Decode and save
            image_data = base64.b64decode(base64_data)
            image = Image.open(BytesIO(image_data))
            image.save(filepath)
            
            print(f"✅ Image saved to {filepath}")
            return True
            
        except Exception as e:
            print(f"❌ Error saving image: {str(e)}")
            return False

