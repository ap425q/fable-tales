#!/usr/bin/env python
"""
Setup script for development environment
Run this script to set up the development environment
"""

import os
import subprocess
import sys
from pathlib import Path


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)


def run_command(cmd, description):
    """Run a shell command and handle errors"""
    print(f"\n📦 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            return True
        else:
            print(f"❌ {description} failed:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def main():
    """Main setup function"""
    print_header("Fable Tales Backend Setup")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    
    print(f"✅ Python version: {sys.version.split()[0]}")
    
    # Check if in correct directory
    if not os.path.exists("requirements.txt"):
        print("❌ Please run this script from the server directory")
        sys.exit(1)
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists("venv"):
        print_header("Creating Virtual Environment")
        run_command(
            "python -m venv venv",
            "Creating virtual environment"
        )
    else:
        print("✅ Virtual environment already exists")
    
    # Determine activation command based on OS
    if sys.platform == "win32":
        activate_cmd = "venv\\Scripts\\activate &&"
    else:
        activate_cmd = "source venv/bin/activate &&"
    
    # Upgrade pip
    print_header("Upgrading pip")
    run_command(
        f"{activate_cmd} python -m pip install --upgrade pip",
        "Upgrading pip"
    )
    
    # Install dependencies
    print_header("Installing Dependencies")
    run_command(
        f"{activate_cmd} pip install -r requirements.txt",
        "Installing Python dependencies"
    )
    
    # Create .env file if it doesn't exist
    if not os.path.exists(".env"):
        print_header("Setting Up Environment Variables")
        if os.path.exists(".env.example"):
            run_command(
                "copy .env.example .env" if sys.platform == "win32" else "cp .env.example .env",
                "Creating .env file"
            )
        print("\n⚠️  Please update .env with your actual API keys:")
        print("   - OPENAI_API_KEY")
        print("   - FAL_AI_API_KEY")
    else:
        print("✅ .env file already exists")
    
    # Create directories if needed
    directories = [
        "logs",
        "temp",
        "data"
    ]
    
    print_header("Creating Directories")
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Directory '{directory}' ready")
    
    # Final instructions
    print_header("Setup Complete!")
    print("\n📝 Next steps:")
    print("1. Update .env file with your API keys")
    print("2. Run the development server:")
    
    if sys.platform == "win32":
        print("   venv\\Scripts\\activate")
        print("   python main.py")
    else:
        print("   source venv/bin/activate")
        print("   python main.py")
    
    print("\n3. Visit http://localhost:8000/docs for API documentation")
    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
