# Email Sending Feature - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (Next.js Frontend)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │  Email Context   │    │  Recipient Email │                 │
│  │  Tone Selector   │    │  john@email.com  │                 │
│  │  Recipient Name  │    └──────────────────┘                 │
│  └──────────────────┘                                          │
│           │                       │                            │
│           ▼                       │                            │
│  ┌──────────────────┐             │                            │
│  │ Generate Email   │             │                            │
│  │     Button       │             │                            │
│  └──────────────────┘             │                            │
│           │                       │                            │
│           ▼                       ▼                            │
│  ┌─────────────────────────────────────┐                      │
│  │    Generated Email Display          │                      │
│  │  ┌─────────────────────────────┐    │                      │
│  │  │ Subject: Follow-up on...    │    │                      │
│  │  │                             │    │                      │
│  │  │ Body: Dear John,            │    │                      │
│  │  │ I wanted to follow up...    │    │                      │
│  │  └─────────────────────────────┘    │                      │
│  └─────────────────────────────────────┘                      │
│           │                       │                            │
│           ▼                       ▼                            │
│  ┌──────────────────┐    ┌──────────────────┐                │
│  │   Copy Email     │    │   Send Email     │  ← NEW!        │
│  └──────────────────┘    └──────────────────┘                │
│                                  │                             │
└──────────────────────────────────┼─────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER                          │
│                  (Vercel Serverless Functions)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐    ┌─────────────────────────┐   │
│  │  /api/generate-email    │    │  /api/send-email        │   │
│  │  (Existing)             │    │  (NEW)                  │   │
│  ├─────────────────────────┤    ├─────────────────────────┤   │
│  │ • Receives context      │    │ • Receives email data   │   │
│  │ • Calls OpenRouter AI   │    │ • Validates recipient   │   │
│  │ • Returns subject/body  │    │ • Connects to SMTP      │   │
│  └─────────────────────────┘    │ • Sends email           │   │
│           │                      │ • Returns status        │   │
│           │                      └──────────┬──────────────┘   │
│           ▼                                 │                   │
│  ┌─────────────────────────┐               │                   │
│  │    OpenRouter API       │               │                   │
│  │   (AI Generation)       │               │                   │
│  │  Llama 3.1 8B Model     │               │                   │
│  └─────────────────────────┘               │                   │
│                                             ▼                   │
└─────────────────────────────────────────────┼───────────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────────┐
                                   │    SMTP Server          │
                                   │  (Gmail/Outlook/etc)    │
                                   ├─────────────────────────┤
                                   │ • Authenticates sender  │
                                   │ • Delivers email        │
                                   │ • Returns success       │
                                   └──────────┬──────────────┘
                                              │
                                              ▼
                                   ┌─────────────────────────┐
                                   │   Recipient's Inbox     │
                                   │   john@email.com        │
                                   └─────────────────────────┘
```

## Feature Flow Diagram

### Complete User Journey

```
START
  │
  ├─► User enters email context (what to say)
  │
  ├─► User selects tone (professional/friendly/formal/casual)
  │
  ├─► User enters recipient name (optional)
  │
  ├─► User enters recipient email address ◄─── NEW!
  │
  ├─► User clicks "Generate Email"
  │
  ▼
┌─────────────────────────────────────┐
│    AI Email Generation Process      │
│                                     │
│  1. POST /api/generate-email        │
│  2. OpenRouter AI processes request │
│  3. AI generates professional email │
│  4. Return subject + body + tips    │
└─────────────────────────────────────┘
  │
  ├─► Email displayed on screen
  │
  ├─► User reviews the generated email
  │
  ├─► User decides:
  │   ├─► Option A: Copy to clipboard (existing)
  │   └─► Option B: Send directly ◄─── NEW!
  │
  ▼
┌─────────────────────────────────────┐
│    Email Sending Process (NEW)      │
│                                     │
│  1. Validate recipient email        │
│  2. POST /api/send-email            │
│  3. Backend connects to SMTP        │
│  4. Authenticate with credentials   │
│  5. Send email via TLS              │
│  6. Return success/failure          │
└─────────────────────────────────────┘
  │
  ├─► Success message displayed
  │
  ├─► Email delivered to recipient
  │
  ▼
DONE ✓
```

## Data Flow

### Request Flow (Generate)
```
User Input
    │
    ├─ context: "Follow up on job application"
    ├─ tone: "professional"
    ├─ recipient_name: "John"
    └─ additional_details: "Applied last week"
    │
    ▼
Frontend (index.tsx)
    │
    └─ POST /api/generate-email
       {
         context: "...",
         tone: "professional",
         recipient_name: "John",
         ...
       }
    │
    ▼
Backend (generate-email.py)
    │
    └─ POST https://openrouter.ai/api/v1/chat/completions
       {
         model: "nvidia/nemotron-3-nano-30b-a3b:free",
         messages: [...]
       }
    │
    ▼
OpenRouter AI
    │
    └─ Returns generated email
    │
    ▼
Backend Response
    │
    └─ {
         subject: "Follow-up on Application",
         body: "Dear John, ...",
         tone: "professional",
         generated_at: "2026-01-20T...",
         suggestions: [...]
       }
    │
    ▼
Frontend Display
```

### Request Flow (Send) - NEW!
```
Generated Email + Recipient Email
    │
    ├─ recipient_email: "john@company.com"
    ├─ subject: "Follow-up on Application"
    ├─ body: "Dear John, ..."
    └─ sender_name: "EmailCraft AI"
    │
    ▼
Frontend (index.tsx)
    │
    └─ POST /api/send-email
       {
         recipient_email: "john@company.com",
         subject: "Follow-up on Application",
         body: "Dear John, ...",
         sender_name: "EmailCraft AI"
       }
    │
    ▼
Backend (send-email.py)
    │
    ├─ Validate recipient email
    ├─ Get SMTP credentials from env vars
    ├─ Create MIME message
    │
    └─ Connect to SMTP server
       ├─ Host: smtp.gmail.com
       ├─ Port: 587
       ├─ Username: your-email@gmail.com
       └─ Password: app-password
    │
    ▼
SMTP Server (Gmail)
    │
    ├─ Authenticate sender
    ├─ Validate recipient
    └─ Deliver email
    │
    ▼
Backend Response
    │
    └─ {
         success: true,
         message: "Email sent successfully",
         recipient: "john@company.com"
       }
    │
    ▼
Frontend Display
    │
    └─ ✓ Success notification
```

## Environment Variables Flow

```
Configuration Sources
    │
    ├─► Local: .env.local (development)
    └─► Production: Vercel Environment Variables
        │
        ├─ OPENROUTER_API_KEY ──► For AI generation
        │
        └─ SMTP Configuration ──► For email sending (NEW)
           ├─ SMTP_HOST
           ├─ SMTP_PORT
           ├─ SMTP_USERNAME
           ├─ SMTP_PASSWORD
           └─ SENDER_EMAIL
        │
        ▼
    Backend APIs read variables
        │
        ├─ generate-email.py uses OPENROUTER_API_KEY
        └─ send-email.py uses SMTP_* variables
        │
        ▼
    Features work correctly
```

## Error Handling Flow

```
Send Email Request
    │
    ├─► Validate recipient email format
    │   ├─ Invalid? → Show error message
    │   └─ Valid? → Continue
    │
    ├─► Check SMTP credentials exist
    │   ├─ Missing? → "Email credentials not configured"
    │   └─ Exist? → Continue
    │
    ├─► Connect to SMTP server
    │   ├─ Connection fails? → "Connection timeout"
    │   └─ Connected? → Continue
    │
    ├─► Authenticate with credentials
    │   ├─ Auth fails? → "Authentication failed"
    │   └─ Authenticated? → Continue
    │
    ├─► Send email
    │   ├─ Fails? → Show error details
    │   └─ Success? → Show success message
    │
    ▼
Done
```

## Security Architecture

```
Security Layers
    │
    ├─► Environment Variables
    │   ├─ Never committed to Git
    │   ├─ Stored securely in Vercel
    │   └─ Not exposed to frontend
    │
    ├─► SMTP Security
    │   ├─ TLS encryption (port 587)
    │   ├─ App Passwords (not main password)
    │   └─ Secure credential storage
    │
    ├─► Input Validation
    │   ├─ Email format validation
    │   ├─ Character limits
    │   └─ Required field checks
    │
    ├─► Error Messages
    │   ├─ No credential exposure
    │   ├─ Generic error messages
    │   └─ Detailed logs server-side only
    │
    └─► Rate Limiting (Email Provider)
        ├─ Gmail: ~500 emails/day
        ├─ Built-in spam protection
        └─ Sender reputation tracking
```

## File Structure

```
PotPie/
│
├── api/
│   ├── generate-email.py    (Existing - AI generation)
│   ├── send-email.py         (NEW - Email sending)
│   └── health.py             (Health check)
│
├── pages/
│   ├── index.tsx             (Modified - Added send UI)
│   ├── _app.tsx
│   └── _document.tsx
│
├── Documentation/
│   ├── EMAIL_SENDING_SETUP.md   (NEW - Detailed setup)
│   ├── QUICK_SETUP.md            (NEW - Quick guide)
│   ├── CHANGES_SUMMARY.md        (NEW - Changes overview)
│   └── FEATURE_ARCHITECTURE.md   (NEW - This file)
│
├── Configuration/
│   ├── .env.example              (Modified - Added SMTP vars)
│   ├── .env.local                (User creates - Local dev)
│   └── Vercel Env Vars           (User sets - Production)
│
└── package.json
    requirements.txt
    README.md                     (Modified - Updated features)
```

## Technology Stack

```
┌─────────────────────────────────────┐
│         Frontend Layer              │
│  • Next.js 14                       │
│  • TypeScript                       │
│  • TailwindCSS                      │
│  • Lucide React (icons)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        API/Backend Layer            │
│  • Python 3.9+                      │
│  • Vercel Serverless Functions      │
│  • Pydantic AI (generation)         │
│  • smtplib (sending) ◄─── NEW!     │
└──────────────┬──────────────────────┘
               │
               ├─────────────┬─────────────┐
               ▼             ▼             ▼
        ┌───────────┐ ┌───────────┐ ┌──────────┐
        │ OpenRouter│ │SMTP Server│ │  Email   │
        │    AI     │ │  (Gmail)  │ │ Recipient│
        └───────────┘ └───────────┘ └──────────┘
```

## Performance Metrics

```
Operation                Time        Notes
──────────────────────────────────────────────────────
Email Generation         2-5s        Via OpenRouter AI
Email Sending            1-3s        Via SMTP (new)
Total (Generate + Send)  3-8s        End-to-end
──────────────────────────────────────────────────────
```

## Comparison: Before vs After

### Before (Generation Only)
```
User Journey:
1. Enter context → 2. Generate → 3. Copy → 4. Open Gmail → 5. Paste → 6. Send
Time: ~2 minutes
Steps: 6
```

### After (Generation + Sending)
```
User Journey:
1. Enter context + email → 2. Generate → 3. Click Send
Time: ~10 seconds
Steps: 3
Improvement: 12x faster! ⚡
```

---

This architecture document provides a complete visual overview of the email sending feature implementation.
