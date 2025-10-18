# Tests Directory

This folder contains test files for the Fable Tales backend API.

## Files

- `test_api.py` - API integration tests for all endpoints

## Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run a specific test file
pytest tests/test_api.py

# Run with coverage
pytest --cov=app tests/
```

## Test Coverage

- [ ] Scene generation endpoint
- [ ] Scene refinement endpoint
- [ ] Character selection endpoint
- [ ] Comic generation endpoint
- [ ] Job status tracking
- [ ] Result retrieval
- [ ] Error handling
- [ ] Storage operations
- [ ] Image handling

## Adding New Tests

1. Create test functions with `test_` prefix
2. Use `async def` for async endpoints
3. Use pytest fixtures for setup/teardown
4. Mock external services (OpenAI, FAL.ai)

Example:
```python
@pytest.mark.asyncio
async def test_generate_scenes():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/comics/scenes/generate",
            json={"topic": "safety", "age_group": "5-12"}
        )
        assert response.status_code == 200
```
