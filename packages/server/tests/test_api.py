"""
Basic tests for the Fable Tales backend
Run with: pytest test_api.py -v
"""

import json
from datetime import datetime


class TestSceneGeneration:
    """Tests for scene generation endpoint"""
    
    def test_scene_generation_request(self):
        """Test scene generation request model"""
        from models import SceneGenerationRequest
        
        request = SceneGenerationRequest(
            topic="teach my kid not to accept candy from strangers",
            age_group="5-12"
        )
        
        assert request.topic == "teach my kid not to accept candy from strangers"
        assert request.age_group == "5-12"
        print("✅ Scene generation request model test passed")
    
    def test_scene_data_model(self):
        """Test scene data model"""
        from models import SceneData
        
        scene = SceneData(
            scene_id=1,
            title="The Unexpected Offer",
            description="A child is approached by a stranger",
            dialogue="Would you like some candy?",
            learning_point="Be cautious with strangers",
            visual_elements=["child", "stranger", "candy"]
        )
        
        assert scene.scene_id == 1
        assert scene.title == "The Unexpected Offer"
        print("✅ Scene data model test passed")


class TestCharacterModels:
    """Tests for character-related models"""
    
    def test_character_type_enum(self):
        """Test character type enum"""
        from models import CharacterType
        
        assert CharacterType.BOY_YOUNG.value == "boy_young"
        assert CharacterType.GIRL_YOUNG.value == "girl_young"
        assert CharacterType.PARENT_MOM.value == "parent_mom"
        print("✅ Character type enum test passed")
    
    def test_character_selection_model(self):
        """Test character selection model"""
        from models import CharacterSelection
        
        selection = CharacterSelection(
            character_type="boy_young",
            count=1
        )
        
        assert selection.character_type == "boy_young"
        assert selection.count == 1
        print("✅ Character selection model test passed")


class TestJobModels:
    """Tests for job management models"""
    
    def test_job_status_enum(self):
        """Test job status enum"""
        from models import JobStatus
        
        assert JobStatus.PENDING.value == "pending"
        assert JobStatus.PROCESSING.value == "processing"
        assert JobStatus.COMPLETED.value == "completed"
        assert JobStatus.FAILED.value == "failed"
        print("✅ Job status enum test passed")
    
    def test_job_status_response(self):
        """Test job status response model"""
        from models import JobStatusResponse, JobStatus
        
        response = JobStatusResponse(
            job_id="test-id",
            status=JobStatus.PROCESSING,
            step="generating_scenes",
            progress=50
        )
        
        assert response.job_id == "test-id"
        assert response.status == JobStatus.PROCESSING
        assert response.progress == 50
        print("✅ Job status response model test passed")


class TestStorage:
    """Tests for storage layer"""
    
    def test_job_store_create(self):
        """Test job store creation"""
        from storage import JobStore
        from models import JobStatus
        
        store = JobStore()
        job = store.create_job(
            "test-job-1",
            {"topic": "test", "scenes": []}
        )
        
        assert job["job_id"] == "test-job-1"
        assert job["status"] == JobStatus.PENDING
        print("✅ Job store create test passed")
    
    def test_job_store_update(self):
        """Test job store update"""
        from storage import JobStore
        from models import JobStatus
        
        store = JobStore()
        store.create_job("test-job-2", {})
        updated = store.update_job(
            "test-job-2",
            status=JobStatus.PROCESSING,
            progress=50
        )
        
        assert updated["status"] == JobStatus.PROCESSING
        assert updated["progress"] == 50
        print("✅ Job store update test passed")
    
    def test_character_store(self):
        """Test character store"""
        from storage import CharacterStore
        
        store = CharacterStore()
        chars = store.list_characters()
        
        assert len(chars) > 0
        assert "boy_young" in chars
        print("✅ Character store test passed")


class TestMasterPrompts:
    """Tests for master prompts"""
    
    def test_scene_generation_prompt(self):
        """Test scene generation prompt"""
        from master_prompts import (
            SCENE_GENERATION_SYSTEM_PROMPT,
            SCENE_GENERATION_USER_PROMPT_TEMPLATE
        )
        
        assert len(SCENE_GENERATION_SYSTEM_PROMPT) > 0
        assert "{topic}" in SCENE_GENERATION_USER_PROMPT_TEMPLATE
        print("✅ Scene generation prompt test passed")
    
    def test_available_characters(self):
        """Test available characters in master prompts"""
        from master_prompts import AVAILABLE_CHARACTERS
        
        assert len(AVAILABLE_CHARACTERS) > 0
        assert "boy_young" in AVAILABLE_CHARACTERS
        assert AVAILABLE_CHARACTERS["boy_young"]["name"] == "Young Boy"
        print("✅ Available characters test passed")


class TestUtilities:
    """Tests for utility functions"""
    
    def test_validate_topic(self):
        """Test topic validation"""
        from utils import validate_topic
        
        valid, msg = validate_topic("teach my kid not to accept candy from strangers")
        assert valid == True
        
        invalid, msg = validate_topic("short")
        assert invalid == False
        print("✅ Topic validation test passed")
    
    def test_generate_job_id(self):
        """Test job ID generation"""
        from utils import generate_job_id
        
        job_id1 = generate_job_id()
        job_id2 = generate_job_id()
        
        assert len(job_id1) > 0
        assert job_id1 != job_id2
        print("✅ Job ID generation test passed")
    
    def test_flatten_dict(self):
        """Test dictionary flattening"""
        from utils import flatten_dict
        
        nested = {
            "level1": {
                "level2": {
                    "key": "value"
                }
            }
        }
        
        flattened = flatten_dict(nested)
        assert "level1.level2.key" in flattened
        print("✅ Dictionary flattening test passed")


class TestExternalServices:
    """Tests for external service placeholders"""
    
    def test_openai_service_mock(self):
        """Test OpenAI service mock generation"""
        from external_services import OpenAIService
        
        service = OpenAIService()
        scenes = service.generate_scenes(
            topic="test topic",
            system_prompt="test",
            user_prompt="test"
        )
        
        assert len(scenes) == 6
        assert scenes[0]["scene_id"] == 1
        print("✅ OpenAI service mock test passed")
    
    def test_fal_ai_service_placeholder(self):
        """Test FAL.ai service placeholder"""
        from external_services import FALAIService
        
        service = FALAIService()
        url = service.generate_image("test prompt")
        
        assert url is not None
        assert "placeholder-fal.ai" in url
        print("✅ FAL.ai service placeholder test passed")


def run_all_tests():
    """Run all tests"""
    print("\n" + "=" * 70)
    print("Running Fable Tales Backend Tests")
    print("=" * 70)
    
    test_classes = [
        TestSceneGeneration,
        TestCharacterModels,
        TestJobModels,
        TestStorage,
        TestMasterPrompts,
        TestUtilities,
        TestExternalServices
    ]
    
    total_tests = 0
    passed_tests = 0
    
    for test_class in test_classes:
        print(f"\n📋 {test_class.__name__}:")
        test_instance = test_class()
        
        for method_name in dir(test_instance):
            if method_name.startswith("test_"):
                total_tests += 1
                try:
                    method = getattr(test_instance, method_name)
                    method()
                    passed_tests += 1
                except AssertionError as e:
                    print(f"❌ {method_name} failed: {str(e)}")
                except Exception as e:
                    print(f"❌ {method_name} error: {str(e)}")
    
    print("\n" + "=" * 70)
    print(f"Results: {passed_tests}/{total_tests} tests passed")
    print("=" * 70 + "\n")
    
    return passed_tests == total_tests


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
