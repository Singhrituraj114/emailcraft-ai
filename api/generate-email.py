from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime
import asyncio
import traceback

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            from pydantic_ai import Agent
            
            # Set environment variables
            api_key = os.environ.get("OPENROUTER_API_KEY", "")
            if not api_key:
                raise ValueError("OPENROUTER_API_KEY environment variable is not set in Vercel")
            
            if not api_key.startswith("sk-or-v1-"):
                raise ValueError("Invalid OPENROUTER_API_KEY format. Please get a new key from https://openrouter.ai/settings/keys")
            
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract request data
            context = data.get('context', '')
            tone = data.get('tone', 'professional')
            recipient_name = data.get('recipient_name')
            additional_details = data.get('additional_details')
            
            # Create agent with OpenRouter using direct API call
            system_prompt = """You are an expert email writing assistant. Your task is to craft professional, 
clear, and effective emails based on the user's context and requirements.

Guidelines:
- Always maintain the requested tone
- Keep emails concise but complete
- Use proper email etiquette
- Include appropriate greetings and closings
- Be culturally sensitive and professional
- Avoid jargon unless specifically requested

Format your response as a complete email with greeting, body, and closing."""
            
            # Use httpx to call OpenRouter directly with proper headers
            import httpx
            
            # Build prompt
            recipient = f"to {recipient_name}" if recipient_name else ""
            additional = f"\n\nAdditional details: {additional_details}" if additional_details else ""
            
            prompt = f"""Write a {tone} email {recipient} with the following context:

Context: {context}{additional}

Tone: {tone}

Write a complete, ready-to-send professional email."""
            
            # Make direct API call to OpenRouter
            async def generate_email():
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "HTTP-Referer": "https://emailcraft-ai.vercel.app",
                            "X-Title": "EmailCraft AI",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "qwen/qwen3-next-80b-a3b-instruct:free",
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": prompt}
                            ]
                        }
                    )
                    response.raise_for_status()
                    return response.json()
            
            # Run async function
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(generate_email())
            loop.close()
            
            # Extract email text from response
            email_text = result['choices'][0]['message']['content']
            
            # Extract subject
            lines = email_text.strip().split('\n')
            subject_line = f"Re: {context[:50]}..."
            
            for i, line in enumerate(lines):
                if line.lower().startswith('subject:'):
                    subject_line = line.split(':', 1)[1].strip()
                    email_text = '\n'.join(lines[:i] + lines[i+1:])
                    break
            
            # Create response
            response = {
                "subject": subject_line,
                "body": email_text.strip(),
                "tone": tone,
                "generated_at": datetime.utcnow().isoformat(),
                "suggestions": [
                    "Review the email for tone and clarity",
                    "Personalize with specific details if needed",
                    "Proofread before sending"
                ]
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            import traceback
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {
                "error": str(e),
                "detail": "Error generating email",
                "traceback": traceback.format_exc(),
                "env_check": "OPENROUTER_API_KEY" in os.environ
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
