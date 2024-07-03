import anthropic
from django.conf import settings

def get_claude_response(prompt):
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            temperature=0,
            system="You are a helpful AI assistant.",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text
    except Exception as e:
        # Handle exceptions (e.g., API errors, network issues)
        return f"An error occurred: {str(e)}"

