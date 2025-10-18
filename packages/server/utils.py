"""
Utility functions and helpers
"""

import json
import hashlib
from typing import List, Dict, Any
from datetime import datetime
import uuid


def generate_job_id() -> str:
    """Generate a unique job ID"""
    return str(uuid.uuid4())


def generate_hash(content: str) -> str:
    """Generate a hash for content"""
    return hashlib.md5(content.encode()).hexdigest()


def validate_topic(topic: str) -> tuple[bool, str]:
    """
    Validate that a topic is appropriate
    
    Returns:
        Tuple of (is_valid, message)
    """
    if not topic or len(topic) < 10:
        return False, "Topic must be at least 10 characters"
    
    if len(topic) > 500:
        return False, "Topic must be less than 500 characters"
    
    # Basic content validation (can be enhanced)
    forbidden_words = ["violence", "harm", "inappropriate"]
    topic_lower = topic.lower()
    
    for word in forbidden_words:
        if word in topic_lower:
            return False, f"Topic contains inappropriate content: {word}"
    
    return True, "Valid topic"


def format_timestamp(dt: datetime = None) -> str:
    """Format datetime to ISO string"""
    if dt is None:
        dt = datetime.now()
    return dt.isoformat()


def parse_json_safe(json_str: str, default: Any = None) -> Any:
    """Safely parse JSON string"""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else {}


def flatten_dict(d: Dict[str, Any], parent_key: str = '', sep: str = '.') -> Dict[str, Any]:
    """Flatten nested dictionary"""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """Split list into chunks"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]


def format_prompt(template: str, **kwargs) -> str:
    """Format a prompt template with variables"""
    return template.format(**kwargs)


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe file system usage"""
    import re
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    # Remove leading/trailing dots
    filename = filename.strip('.')
    return filename


def calculate_progress(current_step: int, total_steps: int) -> int:
    """Calculate progress percentage"""
    if total_steps == 0:
        return 0
    return int((current_step / total_steps) * 100)


def format_error_response(error: Exception) -> Dict[str, Any]:
    """Format exception as error response"""
    return {
        "error": type(error).__name__,
        "detail": str(error),
        "timestamp": format_timestamp()
    }


class Logger:
    """Simple logging utility"""
    
    @staticmethod
    def info(message: str, **kwargs):
        """Log info message"""
        timestamp = format_timestamp()
        print(f"[{timestamp}] INFO: {message}")
        if kwargs:
            print(f"       {json.dumps(kwargs, indent=2)}")
    
    @staticmethod
    def error(message: str, **kwargs):
        """Log error message"""
        timestamp = format_timestamp()
        print(f"[{timestamp}] ERROR: {message}")
        if kwargs:
            print(f"        {json.dumps(kwargs, indent=2)}")
    
    @staticmethod
    def warning(message: str, **kwargs):
        """Log warning message"""
        timestamp = format_timestamp()
        print(f"[{timestamp}] WARNING: {message}")
        if kwargs:
            print(f"          {json.dumps(kwargs, indent=2)}")
    
    @staticmethod
    def debug(message: str, **kwargs):
        """Log debug message"""
        timestamp = format_timestamp()
        print(f"[{timestamp}] DEBUG: {message}")
        if kwargs:
            print(f"       {json.dumps(kwargs, indent=2)}")
