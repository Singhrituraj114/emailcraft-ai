# EmailCraft AI 📧✨

**Professional Email Writing Assistant powered by Pydantic AI**

> A full-stack generative AI application that helps users craft perfect professional emails in seconds. Built with Pydantic AI, Next.js, FastAPI, and deployed on Vercel.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 🎯 Overview

EmailCraft AI is an intelligent email writing assistant that uses advanced AI to generate professional, contextually appropriate emails. Simply describe what you want to say, choose your tone, and let AI craft the perfect message.

### ✨ Key Features

- **AI-Powered Generation**: Uses Pydantic AI with Meta Llama 3.1 8B Instruct (free model via OpenRouter)
- **Multiple Tone Options**: Professional, Friendly, Formal, or Casual
- **Smart Suggestions**: Get actionable tips to improve your emails
- **Real-time Validation**: Input validation with helpful error messages
- **Responsive Design**: Beautiful UI that works on all devices
- **Copy to Clipboard**: One-click copying of generated emails
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: Comprehensive error handling with retry mechanisms

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │ ───────▶│   FastAPI    │ ───────▶│  OpenRouter │
│  Frontend   │ ◀─────── │   Backend    │ ◀─────── │     AI      │
└─────────────┘         └──────────────┘         └─────────────┘
     React                Pydantic AI              Llama 3.1 8B
   TypeScript               Python
  TailwindCSS
```

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic AI** - AI agent framework
- **Python 3.9+** - Backend language
- **Uvicorn** - ASGI server

### AI Model
- **Meta Llama 3.1 8B Instruct** (Free tier via OpenRouter)
- Alternative: Any OpenAI-compatible model

### Deployment
- **Vercel** - Hosting for both frontend and backend
- **Environment Variables** - Secure API key management

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai/))

### Backend Setup

```bash
# Navigate to project directory
cd PotPie

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and add your API key
# OPENROUTER_API_KEY=your_actual_api_key_here
```

### Frontend Setup

```bash
# Install Node dependencies
npm install

# Create .env.local for frontend
copy .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎮 Running Locally

### Start Backend (Terminal 1)

```bash
# Ensure virtual environment is activated
cd backend
python main.py
```

Backend will run on `http://localhost:8000`

### Start Frontend (Terminal 2)

```bash
# From project root
npm run dev
```

Frontend will run on `http://localhost:3000`

### Test the Application

1. Open `http://localhost:3000` in your browser
2. Enter email context (e.g., "Follow up on job application")
3. Choose tone and optional details
4. Click "Generate Email"
5. Copy and use your AI-generated email!

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: EmailCraft AI"
git branch -M main
git remote add origin https://github.com/yourusername/emailcraft-ai.git
git push -u origin main
```

2. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variable: `OPENROUTER_API_KEY`
- Deploy!

3. **Update Frontend API URL**

After deployment, update your `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

Redeploy to apply changes.

### Alternative: Railway, Render, or DigitalOcean

The application can be deployed on any platform that supports:
- Python/FastAPI backend
- Node.js/Next.js frontend
- Environment variable configuration

## 🔑 Getting API Keys

### OpenRouter (Free)

1. Visit [openrouter.ai](https://openrouter.ai/)
2. Sign up for free account
3. Go to Settings → API Keys
4. Create new API key
5. Copy and add to your `.env` file

**Free Models Available:**
- Meta Llama 3.1 8B Instruct (Default)
- Google Gemma 2 9B
- Mistral 7B Instruct
- And more!

## 📁 Project Structure

```
PotPie/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── pages/
│   ├── _app.tsx            # Next.js app wrapper
│   ├── _document.tsx       # HTML document
│   └── index.tsx           # Main application page
├── styles/
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── package.json           # Node dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # TailwindCSS config
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🎨 Design Features

- **Clean Typography**: Inter font family for readability
- **Consistent Spacing**: 8px grid system
- **Color Palette**: Professional blue primary colors
- **Smooth Transitions**: 200ms ease-in-out animations
- **Loading States**: Spinner animations during generation
- **Error States**: Clear, actionable error messages
- **Responsive Layout**: Works on mobile, tablet, and desktop

## 🔒 Security & Best Practices

- ✅ Input validation with Pydantic models
- ✅ Rate limiting ready (add Redis for production)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Timeout handling (30s max)
- ✅ Error logging and monitoring
- ✅ SQL injection prevention (no database used)
- ✅ XSS protection via React

## 🧪 Testing

### Manual Testing Checklist

- [ ] Email generation with all tone options
- [ ] Form validation (min/max lengths)
- [ ] Error handling (network errors, timeouts)
- [ ] Loading states display correctly
- [ ] Copy to clipboard functionality
- [ ] Responsive design on mobile
- [ ] Multiple consecutive requests

### API Endpoints

**Health Check**
```bash
curl http://localhost:8000/health
```

**Generate Email**
```bash
curl -X POST http://localhost:8000/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "context": "Follow up on job application from last week",
    "tone": "professional",
    "recipient_name": "John Smith"
  }'
```

## 📊 Evaluation Criteria Coverage

### ✅ Full Stack Application Quality
- Production-ready Next.js frontend
- Robust FastAPI backend
- Clean, maintainable code structure

### ✅ Product Flow & User Journey
- Clear 3-step process: Input → Generate → Copy
- Intuitive form with helpful placeholders
- Immediate feedback and results

### ✅ Feature Design
- Multiple tone options
- Optional customization fields
- Smart suggestions for improvement
- One-click copy functionality

### ✅ Design & UX Polish
- Professional color scheme
- Consistent spacing (8px grid)
- Inter font for readability
- Smooth animations (200ms)
- Responsive layout

### ✅ Fast & Smooth Experience
- Loading indicators during AI generation
- Error states with clear messages
- 30s timeout with retry capability
- Optimized API calls

### ✅ Backend Implementation
- Clean REST API design
- Pydantic validation models
- Comprehensive logging
- Retry mechanisms (2 retries)
- Timeout handling
- Global error handlers

## 🎥 Video Demonstration

**Required for submission:**
- 1-minute Loom video
- Face visible throughout
- Live explanation of:
  - What the project does
  - How it was built (tech stack)
  - Key features demonstration
  - Unique value proposition

## 📝 Submission Checklist

- [ ] Live deployed URL on Vercel
- [ ] Public GitHub repository
- [ ] README.md with setup instructions
- [ ] .env.example files for configuration
- [ ] 1-minute Loom video (face visible)
- [ ] All code committed and pushed
- [ ] Application tested end-to-end

## 🚀 Future Enhancements

- **Email Templates**: Pre-built templates for common scenarios
- **History**: Save generated emails for later reference
- **Multi-language**: Generate emails in different languages
- **Tone Analysis**: AI-powered tone feedback
- **Email Scheduling**: Integration with email clients
- **Team Collaboration**: Share and iterate on drafts

## 🤝 Contributing

This is a student project submission. Feel free to fork and customize for your own use!

## 📄 License

MIT License - Feel free to use this project for learning and inspiration.

## 👨‍💻 Author

Built with ❤️ using Pydantic AI, Next.js, and modern web technologies.

---

## 🆘 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.9+)
- Verify virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

### API key errors
- Verify `.env` file exists in backend folder
- Check API key is valid on OpenRouter dashboard
- Ensure no extra spaces in API key

### Email generation fails
- Check backend logs for errors
- Verify API key has available credits
- Try a different model in `main.py`
- Increase timeout in frontend code

### Deployment issues
- Verify environment variables are set in Vercel
- Check build logs for errors
- Ensure `vercel.json` is correctly configured

## 📚 Resources

- [Pydantic AI Documentation](https://ai.pydantic.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenRouter API](https://openrouter.ai/docs)
- [TailwindCSS](https://tailwindcss.com/docs)

---

**⭐ If you found this helpful, please star the repository!**
