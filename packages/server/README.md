# Frame Fable Server

FastAPI server for the Frame Fable fairy tale generation application.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**:
   ```bash
   # Required for story generation
   export OPENAI_API_KEY="your_openai_api_key"
   
   # Required for background image generation
   export FAL_KEY="your_fal_ai_api_key"
   ```

3. **Run the Server**:
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access API Documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
server/
├── app/                    # Application code
│   ├── api/               # API routes
│   ├── models/            # Data models and schemas
│   ├── services/          # Business logic
│   └── storage/           # Data storage layer
├── data/                  # Local data storage
├── tests/                 # Test files
├── external_services.py   # OpenAI and FAL.ai integration
├── master_prompts.py      # AI prompts
├── main.py               # FastAPI application
└── requirements.txt      # Python dependencies
```

## 🤖 AI Integration

- **OpenAI**: Story generation and background descriptions
- **FAL.ai**: High-quality background image generation

## 📚 API Documentation

Complete API documentation is available in the main project README.md file.
