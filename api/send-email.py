from http.server import BaseHTTPRequestHandler
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import traceback

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Extract request data
            recipient_email = data.get('recipient_email')
            subject = data.get('subject', '')
            body = data.get('body', '')
            sender_name = data.get('sender_name', 'EmailCraft AI')
            
            # Validate required fields
            if not recipient_email:
                raise ValueError("Recipient email is required")
            if not subject or not body:
                raise ValueError("Email subject and body are required")
            
            # Get SMTP configuration from environment variables
            smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
            smtp_port = int(os.environ.get("SMTP_PORT", "587"))
            smtp_username = os.environ.get("SMTP_USERNAME")
            smtp_password = os.environ.get("SMTP_PASSWORD")
            sender_email = os.environ.get("SENDER_EMAIL", smtp_username)
            
            if not smtp_username or not smtp_password:
                raise ValueError("Email credentials not configured. Please set SMTP_USERNAME and SMTP_PASSWORD environment variables.")
            
            # Create email message
            message = MIMEMultipart()
            message['From'] = f"{sender_name} <{sender_email}>"
            message['To'] = recipient_email
            message['Subject'] = subject
            
            # Add body to email
            message.attach(MIMEText(body, 'plain'))
            
            # Connect to SMTP server and send email
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()  # Enable TLS encryption
                server.login(smtp_username, smtp_password)
                server.send_message(message)
            
            # Create success response
            response = {
                "success": True,
                "message": f"Email sent successfully to {recipient_email}",
                "recipient": recipient_email,
                "subject": subject
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {
                "success": False,
                "error": str(e),
                "detail": "Failed to send email",
                "traceback": traceback.format_exc()
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
