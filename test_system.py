"""
Test script to verify EmailCraft AI is working correctly
"""
import requests
import json

# Test backend health
def test_backend_health():
    print("🔍 Testing backend health...")
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend connection error: {e}")
        return False

# Test email generation
def test_email_generation():
    print("\n🔍 Testing email generation...")
    try:
        payload = {
            "context": "I need to follow up on my job application from last week",
            "tone": "professional",
            "recipient_name": "John Smith"
        }
        
        print(f"   Sending request with context: '{payload['context']}'")
        response = requests.post(
            "http://localhost:8000/api/generate-email",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Email generated successfully!")
            print(f"   Subject: {data['subject']}")
            print(f"   Body length: {len(data['body'])} characters")
            print(f"   Tone: {data['tone']}")
            print(f"   Suggestions: {len(data['suggestions'])} tips")
            return True
        else:
            print(f"❌ Email generation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out (this might be normal for first request)")
        return False
    except Exception as e:
        print(f"❌ Email generation error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("   EmailCraft AI - System Test")
    print("=" * 50)
    
    backend_ok = test_backend_health()
    
    if backend_ok:
        email_ok = test_email_generation()
        
        print("\n" + "=" * 50)
        if backend_ok and email_ok:
            print("🎉 All tests passed! System is ready!")
        else:
            print("⚠️  Some tests failed. Check errors above.")
        print("=" * 50)
        
        print("\n📱 Access your application:")
        print("   Frontend: http://localhost:3001")
        print("   Backend:  http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
    else:
        print("\n❌ Backend is not responding. Make sure it's running:")
        print("   cd backend")
        print("   python main.py")
