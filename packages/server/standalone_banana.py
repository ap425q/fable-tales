from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import dotenv
import base64

client = genai.Client(api_key=dotenv.get_key('.env', 'GOOGLE_API_KEY'))


prompt = (
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
)

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.candidates[0].content.parts:
    if getattr(part, "text", None):
        print(part.text)
    elif getattr(part, "inline_data", None):
        # Decode the base64 image data
        image_data = base64.b64decode(part.inline_data.data)
        image = Image.open(BytesIO(image_data))
        image.save("generated_image.png")
        print("✅ Image saved as generated_image.png")
