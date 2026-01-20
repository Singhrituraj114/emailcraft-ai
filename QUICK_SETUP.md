# Quick Setup Guide - Email Sending Feature

## 🚀 5-Minute Setup

### Step 1: Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Search for "App passwords" 
4. Click **App passwords**
5. Select **Mail** and your device
6. Click **Generate**
7. **Copy the 16-character password** (remove spaces)

### Step 2: Configure Environment Variables (1 minute)

#### For Local Development:
Create `.env.local` file in project root:

```env
OPENROUTER_API_KEY=sk-or-v1-your-existing-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SENDER_EMAIL=your-email@gmail.com
```

#### For Vercel (Production):
1. Open Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add these 5 variables:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = `your-email@gmail.com`
   - `SMTP_PASSWORD` = `your-app-password`
   - `SENDER_EMAIL` = `your-email@gmail.com`
4. Click **Save** and **Redeploy**

### Step 3: Test It! (2 minutes)

#### Local Test:
```bash
npm run dev
```

1. Open http://localhost:3000
2. Fill the form (context, tone, etc.)
3. **Enter recipient email** in "Recipient Email" field
4. Click "Generate Email"
5. Review the generated email
6. Click "Send Email" button
7. ✅ See success message!

#### Production Test:
1. Visit your Vercel URL
2. Follow same steps as above
3. Check recipient's inbox (and spam folder)

## 📧 Usage Example

### Before (Generate Only):
```
1. User: "Write a follow-up email for a job application"
2. AI generates email
3. User: Copies and pastes to Gmail manually ❌
```

### After (Generate + Send):
```
1. User: "Write a follow-up email for a job application"
2. AI generates email
3. User: Enters recipient@company.com
4. User: Clicks "Send Email"
5. ✅ Email sent automatically! ✨
```

## 🎯 UI Changes

### New Input Field:
```
┌─────────────────────────────────────┐
│ Recipient Email (For Sending)      │
│ ┌─────────────────────────────────┐ │
│ │ john@example.com                │ │
│ └─────────────────────────────────┘ │
│ Enter email address to enable       │
│ sending feature                     │
└─────────────────────────────────────┘
```

### New Button:
After email generation, you'll see:

```
┌─────────────────────┬─────────────────────┐
│   📧 Send Email    │  Generate Another   │
└─────────────────────┴─────────────────────┘
```

### Success Message:
```
┌─────────────────────────────────────┐
│ ✓ Email Sent Successfully!         │
│ Your email has been sent to         │
│ john@example.com                    │
└─────────────────────────────────────┘
```

## ⚠️ Important Notes

### Gmail Requirements:
- ✅ Must use **App Password** (not regular password)
- ✅ Must enable **2-Step Verification** first
- ✅ Daily limit: ~500 emails for free accounts

### Security:
- ✅ Never commit `.env` or `.env.local` to Git
- ✅ Use environment variables for all credentials
- ✅ Rotate passwords periodically

### Troubleshooting:
| Error | Solution |
|-------|----------|
| "Email credentials not configured" | Add SMTP vars to `.env.local` or Vercel |
| "Authentication failed" | Use App Password, not regular password |
| "Connection timeout" | Check firewall, try port 587 |
| Email not received | Check spam folder first |

## 🔗 More Help?

- **Detailed Setup**: See `EMAIL_SENDING_SETUP.md`
- **Changes Overview**: See `CHANGES_SUMMARY.md`
- **Gmail Help**: https://support.google.com/accounts/answer/185833

## ✅ Verification Checklist

- [ ] App Password created
- [ ] Environment variables added
- [ ] Server running (local or Vercel)
- [ ] Recipient email entered
- [ ] Email generated successfully
- [ ] Send button clicked
- [ ] Success message appears
- [ ] Email received in inbox

## 🎉 You're Done!

Your EmailCraft AI now has full email sending capability. Generate professional emails with AI and send them directly to recipients - all in one place!

---

**Need more help?** Check the detailed guide in `EMAIL_SENDING_SETUP.md`
