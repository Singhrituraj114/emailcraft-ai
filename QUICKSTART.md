# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Get Your API Key (Free)

1. Visit [openrouter.ai](https://openrouter.ai/)
2. Sign up (it's free!)
3. Go to Settings → API Keys
4. Create a new API key
5. Copy it (you'll need it in step 3)

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Create and activate Python virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment

```bash
# Backend configuration
cd backend
copy .env.example .env
# Edit .env and add: OPENROUTER_API_KEY=your_key_here

# Frontend configuration
cd ..
copy .env.example .env.local
# Keep default: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Test It Out!

1. Open http://localhost:3000
2. Enter: "I need to schedule a meeting with my team"
3. Click "Generate Email"
4. Watch the magic happen! ✨

## 🎯 What to Test

- [ ] Generate professional email
- [ ] Try different tones (friendly, formal, casual)
- [ ] Add recipient name
- [ ] Copy generated email
- [ ] Generate multiple emails

## 🆘 Need Help?

**Backend won't start?**
- Check Python version: `python --version` (need 3.9+)
- Make sure virtual environment is activated
- Verify API key in `.env`

**Frontend won't start?**
- Check Node version: `node --version` (need 18+)
- Try: `rm -rf node_modules && npm install`

**API errors?**
- Make sure backend is running on port 8000
- Check API key is valid
- Look at terminal logs for details

## 📚 Next Steps

1. ✅ Test locally
2. 📝 Read full [README.md](README.md)
3. 🚀 Deploy to Vercel ([DEPLOYMENT.md](DEPLOYMENT.md))
4. 🎥 Record your Loom video ([VIDEO_SCRIPT.md](VIDEO_SCRIPT.md))
5. 🎓 Submit your project!

---

**Questions?** Check the full README.md for detailed documentation.
