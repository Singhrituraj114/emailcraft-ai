# Email Sending Setup Guide

This guide will help you configure the email sending feature in EmailCraft AI.

## Overview

EmailCraft AI now supports two features:
1. **Generate Emails**: AI-powered email generation (already configured)
2. **Send Emails**: Send generated emails directly to recipients via SMTP

## Configuration Steps

### 1. Choose Your Email Provider

You can use any SMTP email provider. Common options:
- Gmail (recommended for testing)
- Outlook/Microsoft 365
- Yahoo Mail
- Custom SMTP server

### 2. Gmail Setup (Recommended)

If using Gmail, you need to create an **App Password**:

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Under "2-Step Verification", scroll down to **App passwords**
5. Click **App passwords**
6. Select **Mail** and your device
7. Click **Generate**
8. Copy the 16-character password (remove spaces)

### 3. Set Environment Variables

#### For Local Development:
Create a `.env.local` file in the project root:

```env
# Email Generation (OpenRouter API)
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Email Sending (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SENDER_EMAIL=your-email@gmail.com
```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = your Gmail address
   - `SMTP_PASSWORD` = your App Password
   - `SENDER_EMAIL` = your Gmail address
   - `OPENROUTER_API_KEY` = your existing API key

4. **Redeploy** your application for changes to take effect

### 4. Other Email Providers

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
SENDER_EMAIL=your-email@outlook.com
```

#### Yahoo Mail:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@yahoo.com
```

Note: Yahoo also requires App Passwords: https://help.yahoo.com/kb/generate-app-password-sln15241.html

#### Custom SMTP:
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SENDER_EMAIL=your-email@yourdomain.com
```

## Testing the Feature

### Local Testing:
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Fill in the form:
   - Enter email context
   - **Important**: Fill in "Recipient Email" field
   - Click "Generate Email"

4. After email is generated:
   - Review the content
   - Click "Send Email" button
   - Check for success message

### Vercel Testing:
1. Deploy to Vercel with environment variables configured
2. Visit your live URL
3. Test the send feature
4. Verify email arrives in recipient's inbox

## Troubleshooting

### Error: "Email credentials not configured"
- **Solution**: Ensure `SMTP_USERNAME` and `SMTP_PASSWORD` are set in environment variables
- For Vercel: Check Settings → Environment Variables
- For local: Check `.env.local` file exists

### Error: "Authentication failed"
- **Gmail**: Make sure you're using an App Password, not your regular password
- **2FA**: Ensure 2-Step Verification is enabled for Gmail
- **Wrong credentials**: Double-check username and password

### Error: "Connection timeout"
- **Firewall**: Check if port 587 is blocked by firewall
- **SMTP Host**: Verify the SMTP host is correct for your provider
- **Network**: Try from a different network

### Email not received
- **Check spam folder**: Generated emails might be flagged as spam initially
- **Sender reputation**: New sender addresses may have delivery issues
- **Email format**: Ensure recipient email is valid
- **Daily limits**: Gmail has sending limits (500/day for free accounts)

### Gmail-Specific Issues

**"Less secure app access"** (old method - deprecated):
- Gmail no longer supports this
- **Must use App Passwords** instead

**Rate limiting**:
- Free Gmail accounts: ~500 emails/day
- Google Workspace: Higher limits
- Add delays between sends if sending multiple emails

## Security Best Practices

1. **Never commit** `.env` or `.env.local` files to Git
2. **Use App Passwords**, not your main account password
3. **Rotate credentials** periodically
4. **Monitor usage** in your email provider's dashboard
5. **Use environment variables** for all sensitive data

## Features & Limitations

### Current Features:
- ✅ Send plain text emails
- ✅ Custom subject lines
- ✅ Configurable sender name
- ✅ Error handling and user feedback
- ✅ Support for multiple SMTP providers

### Future Enhancements:
- 📧 HTML email formatting
- 📎 Attachment support
- 📊 Email tracking
- 📝 Email templates
- 🔄 Bulk sending
- 📧 CC/BCC support

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test with a different email provider
4. Check your email provider's SMTP documentation
5. Review the API logs in Vercel dashboard

## Additional Resources

- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Outlook SMTP Settings](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353)
- [Yahoo App Passwords](https://help.yahoo.com/kb/generate-app-password-sln15241.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
