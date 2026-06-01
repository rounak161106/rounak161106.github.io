import os
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Fallback to prompt user or guide them to set it
    print("WARNING: GEMINI_API_KEY environment variable is not set. Attempting default Client initialization.")
    client = genai.Client()
else:
    client = genai.Client(api_key=api_key)

# CRITICAL FIX: Explicitly set the model here to bypass the 0-quota model
chat = client.chats.create(model="gemini-2.5-flash")

# First interaction
response1 = chat.send_message("My target deployment folder is d:/Portfolio.")
print("AI:", response1.text)

# Second interaction
response2 = chat.send_message("What path did I tell you my project was in?")
print("AI:", response2.text)
