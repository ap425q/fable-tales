"""
Comic Service
Main business logic for comic creation workflow
"""

import uuid
from typing import Dict, List, Any, Optional

from app.storage.data_manager import DataManager
from app.models.schemas import JobStatus
from external_services import OpenAIService, FALAIService
from master_prompts import (
    SCENE_GENERATION_SYSTEM_PROMPT,
    SCENE_GENERATION_USER_PROMPT_TEMPLATE,
    SCENE_REFINEMENT_SYSTEM_PROMPT,
    SCENE_REFINEMENT_USER_PROMPT_TEMPLATE,
    COMIC_PANEL_SYSTEM_PROMPT,
    COMIC_PANEL_USER_PROMPT_TEMPLATE,
)


class ComicService:
    """
    Main service for comic creation workflow
    Orchestrates between storage, external APIs, and business logic
    """
    
    def __init__(self, data_path: str = "data"):
        """Initialize comic service"""
        self.data_manager = DataManager(data_path)
        self.openai_service = OpenAIService()
        self.fal_ai_service = FALAIService()
    
    # ========================================================================
    # STEP 1: Scene Generation
    # ========================================================================
    
    def start_scene_generation(self, topic: str, age_group: str = "5-12") -> Dict[str, Any]:
        """Start the scene generation workflow"""
        job_id = str(uuid.uuid4())
        
        # Create job record
        self.data_manager.create_job(job_id, topic, age_group)
        
        try:
            # Update status
            self.data_manager.update_job_status(
                job_id,
                status="processing",
                step="generating_scenes",
                progress=10
            )
            
            # Generate scenes
            user_prompt = SCENE_GENERATION_USER_PROMPT_TEMPLATE.format(topic=topic)
            scenes = self.openai_service.generate_scenes(
                topic=topic,
                system_prompt=SCENE_GENERATION_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )
            
            # Store scenes in job data
            self.data_manager.update_job_status(
                job_id,
                status="requires_action",
                step="scene_review",
                progress=50,
                data_update={"scenes": scenes}
            )
            
            return {
                "job_id": job_id,
                "status": "requires_action",
                "step": "scene_review",
                "message": "Scenes generated successfully. Please review.",
                "scenes": scenes
            }
            
        except Exception as e:
            self.data_manager.update_job_status(
                job_id,
                status="failed",
                step="error",
                data_update={"error": str(e)}
            )
            return {
                "job_id": job_id,
                "status": "failed",
                "error": str(e)
            }
    
    # ========================================================================
    # STEP 2: Scene Refinement
    # ========================================================================
    
    def refine_scenes(self, job_id: str, feedback_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Refine scenes based on parent feedback"""
        job = self.data_manager.get_job(job_id)
        if not job:
            return {"job_id": job_id, "status": "failed", "error": "Job not found"}
        
        try:
            self.data_manager.update_job_status(
                job_id,
                status="processing",
                step="refining_scenes",
                progress=30
            )
            
            # If no feedback, proceed
            if not feedback_list or all(not f.get("feedback") for f in feedback_list):
                self.data_manager.update_job_status(
                    job_id,
                    status="requires_action",
                    step="character_selection",
                    progress=60
                )
                return {
                    "job_id": job_id,
                    "status": "requires_action",
                    "step": "character_selection",
                    "message": "Proceeding to character selection."
                }
            
            # Refine scenes
            original_scenes = job["data"].get("scenes", [])
            user_prompt = SCENE_REFINEMENT_USER_PROMPT_TEMPLATE.format(
                original_scenes=str(original_scenes),
                feedback=str(feedback_list)
            )
            
            refined_scenes = self.openai_service.refine_scenes(
                original_scenes=original_scenes,
                feedback=feedback_list,
                system_prompt=SCENE_REFINEMENT_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )
            
            self.data_manager.update_job_status(
                job_id,
                status="requires_action",
                step="character_selection",
                progress=60,
                data_update={"scenes": refined_scenes}
            )
            
            return {
                "job_id": job_id,
                "status": "requires_action",
                "step": "character_selection",
                "message": "Scenes refined successfully."
            }
            
        except Exception as e:
            self.data_manager.update_job_status(
                job_id,
                status="failed",
                step="error"
            )
            return {"job_id": job_id, "status": "failed", "error": str(e)}
    
    # ========================================================================
    # STEP 3: Character Selection
    # ========================================================================
    
    def select_characters(self, job_id: str, characters: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select characters for the comic"""
        job = self.data_manager.get_job(job_id)
        if not job:
            return {"job_id": job_id, "status": "failed", "error": "Job not found"}
        
        try:
            self.data_manager.update_job_status(
                job_id,
                status="requires_action",
                step="comic_generation",
                progress=70,
                data_update={"characters": characters}
            )
            
            return {
                "job_id": job_id,
                "status": "requires_action",
                "step": "comic_generation",
                "message": "Characters selected. Ready to generate."
            }
            
        except Exception as e:
            return {"job_id": job_id, "status": "failed", "error": str(e)}
    
    # ========================================================================
    # STEP 4: Comic Panel Generation
    # ========================================================================
    
    def generate_comic_panels(self, job_id: str) -> Dict[str, Any]:
        """Generate comic panels using FAL.ai"""
        job = self.data_manager.get_job(job_id)
        if not job:
            return {"job_id": job_id, "status": "failed", "error": "Job not found"}
        
        try:
            self.data_manager.update_job_status(
                job_id,
                status="processing",
                step="generating_images",
                progress=75
            )
            
            scenes = job["data"].get("scenes", [])
            characters = job["data"].get("characters", [])
            topic = job["data"].get("topic", "")
            
            # Generate image prompts
            image_prompts = []
            for scene in scenes:
                prompt = self.openai_service.generate_image_prompt(
                    scene_description=scene.get("description", ""),
                    dialogue=scene.get("dialogue", ""),
                    characters=[c.get("name", "") for c in characters],
                    visual_elements=scene.get("visual_elements", [])
                )
                image_prompts.append(prompt)
            
            # Generate images
            image_urls = self.fal_ai_service.generate_batch_images(image_prompts)
            
            # Create comic panels
            comic_panels = []
            for idx, (scene, url) in enumerate(zip(scenes, image_urls)):
                panel = {
                    "panel_id": idx + 1,
                    "scene_id": scene.get("scene_id", idx + 1),
                    "image_url": url or "https://placeholder-image.png",
                    "description": scene.get("description", ""),
                    "dialogue": scene.get("dialogue", ""),
                    "title": scene.get("title", "")
                }
                comic_panels.append(panel)
                
                # Store image reference
                self.data_manager.store_panel_image_url(
                    image_url=url or "https://placeholder-image.png",
                    comic_id=job_id,
                    panel_id=idx + 1
                )
            
            # Save complete comic
            comic_id = str(uuid.uuid4())
            self.data_manager.save_comic(
                comic_id=comic_id,
                topic=topic,
                title=f"{topic.title()} - Educational Comic",
                scenes=scenes,
                panels=comic_panels,
                characters=characters
            )
            
            # Update job
            self.data_manager.update_job_status(
                job_id,
                status="completed",
                step="completed",
                progress=100,
                data_update={
                    "comic_id": comic_id,
                    "comic_panels": comic_panels
                }
            )
            
            return {
                "job_id": job_id,
                "status": "completed",
                "step": "completed",
                "message": "Comic generated successfully!",
                "comic_panels": comic_panels,
                "comic_id": comic_id
            }
            
        except Exception as e:
            self.data_manager.update_job_status(
                job_id,
                status="failed",
                step="error"
            )
            return {"job_id": job_id, "status": "failed", "error": str(e)}
    
    # ========================================================================
    # Status & Retrieval
    # ========================================================================
    
    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """Get job status"""
        job = self.data_manager.get_job(job_id)
        if not job:
            return {"job_id": job_id, "status": "failed", "error": "Job not found"}
        
        return {
            "job_id": job["id"],
            "status": job["status"],
            "step": job["step"],
            "progress": job["progress"],
            "data": job["data"]
        }
    
    def get_comic_result(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get completed comic"""
        job = self.data_manager.get_job(job_id)
        if not job or job["status"] != "completed":
            return None
        
        comic_id = job["data"].get("comic_id")
        return self.data_manager.get_comic(comic_id) if comic_id else None
