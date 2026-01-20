import { useState } from 'react'
import Head from 'next/head'
import { Sparkles, Mail, Loader2, Copy, Check, AlertCircle, Send } from 'lucide-react'

interface EmailResponse {
  subject: string
  body: string
  tone: string
  generated_at: string
  suggestions: string[]
}

type ToneType = 'professional' | 'friendly' | 'formal' | 'casual'

export default function Home() {
  const [context, setContext] = useState('')
  const [tone, setTone] = useState<ToneType>('professional')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [mentionAttachments, setMentionAttachments] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [result, setResult] = useState<EmailResponse | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate context
    if (context.trim().length < 10) {
      setError('Please enter at least 10 characters for the email context.')
      return
    }
    
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: context.trim(),
          tone,
          recipient_name: recipientName.trim() || null,
          additional_details: additionalDetails.trim() || null,
          mention_attachments: mentionAttachments,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to generate email')
      }
      
      if (data && data.subject && data.body) {
        setResult(data)
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (err: any) {
      console.error('Error generating email:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      const fullEmail = `Subject: ${result.subject}\n\n${result.body}`
      navigator.clipboard.writeText(fullEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sendEmail = async () => {
    if (!result || !recipientEmail) {
      setError('Please enter a recipient email address')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      setError('Please enter a valid email address')
      return
    }

    setSending(true)
    setError(null)
    setSendSuccess(false)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_email: recipientEmail,
          subject: result.subject,
          body: result.body,
          sender_name: 'EmailCraft AI',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to send email')
      }

      setSendSuccess(true)
      setTimeout(() => setSendSuccess(false), 5000)
    } catch (err: any) {
      console.error('Error sending email:', err)
      setError(err.message || 'Failed to send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setContext('')
    setRecipientName('')
    setRecipientEmail('')
    setAdditionalDetails('')
    setMentionAttachments(false)
    setResumeFile(null)
    setResult(null)
    setError(null)
    setSendSuccess(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, Word document, or text file')
        return
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setResumeFile(file)
      setMentionAttachments(true)
    }
  }

  return (
    <>
      <Head>
        <title>EmailCraft AI - Professional Email Writing Assistant</title>
        <meta name="description" content="Generate professional emails with AI in seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-gradient">
        {/* Header */}
        <header className="bg-gray-800/95 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/50 animate-pulse-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-100">EmailCraft AI</h1>
                  <p className="text-sm text-gray-400">Professional Email Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 animate-slide-in-up">
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              Craft Perfect Emails in Seconds
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Let AI help you write professional, clear, and effective emails. 
              Just describe what you need, and we'll handle the rest.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="card transform transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="context" className="block text-sm font-semibold text-gray-300 mb-2">
                    What do you want to say? *
                  </label>
                  <textarea
                    id="context"
                    rows={4}
                    className="input-field resize-none"
                    placeholder="E.g., I need to follow up on a job application I submitted last week..."
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {context.length}/1000 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Tone
                  </label>
                  <select
                    id="tone"
                    className="input-field"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as ToneType)}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="recipient" className="block text-sm font-semibold text-gray-300 mb-2">
                    Recipient Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    className="input-field"
                    placeholder="E.g., John Smith"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="recipientEmail" className="block text-sm font-semibold text-gray-300 mb-2">
                    Recipient Email (For Sending)
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    className="input-field"
                    placeholder="E.g., john@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter email address to enable sending feature
                  </p>
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-gray-300 mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    id="details"
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Any specific points you want to include..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    maxLength={500}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="attachments"
                    checked={mentionAttachments}
                    onChange={(e) => setMentionAttachments(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="attachments" className="text-sm font-medium text-gray-300">
                    Mention attached documents (e.g., resume, portfolio)
                  </label>
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-semibold text-gray-300 mb-2">
                    Upload Resume/CV (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{resumeFile ? 'Change File' : 'Choose File'}</span>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {resumeFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {resumeFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, Word, or Text file (max 5MB)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || context.length < 10}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Email</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Area */}
            <div className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start space-x-3 animate-slide-in-up shadow-lg shadow-red-900/20">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-400">Error</h3>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="card animate-slide-in-up shadow-2xl shadow-indigo-900/30">
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                    <p className="text-gray-300 font-medium">Crafting your perfect email...</p>
                    <p className="text-sm text-gray-500">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4 animate-slide-in-up">
                  <div className="card shadow-2xl shadow-indigo-900/20 hover:shadow-indigo-900/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-indigo-400" />
                          <h3 className="font-semibold text-gray-100">Generated Email</h3>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-indigo-400 hover:bg-gray-700 rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Subject Line
                        </label>
                        <p className="mt-1 text-gray-100 font-medium">{result.subject}</p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Email Body
                        </label>
                        <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700 shadow-inner">
                          <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {result.body}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-xs text-gray-500">
                          Tone: <span className="font-medium capitalize">{result.tone}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Generated: {new Date(result.generated_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="card bg-indigo-900/20 border-indigo-800 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30">
                      <h4 className="font-semibold text-gray-100 mb-3">💡 Suggestions</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <span className="text-indigo-400 mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sendSuccess && (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-start space-x-3 animate-slide-in-up shadow-lg shadow-green-900/20">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-400">Email Sent Successfully!</h3>
                        <p className="text-sm text-green-300 mt-1">
                          Your email has been sent to {recipientEmail}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={sendEmail}
                      disabled={sending || !recipientEmail}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                      title={!recipientEmail ? 'Please enter recipient email address' : ''}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetForm}
                      className="btn-secondary flex-1"
                    >
                      Generate Another Email
                    </button>
                  </div>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="card bg-gray-800/50 border-gray-700">
                  <div className="text-center py-12">
                    <Mail className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-400">
                      Fill in the form and click "Generate Email" to see your AI-crafted message here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-indigo-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-800 shadow-lg shadow-indigo-900/30 animate-float">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">
                Advanced AI understands context and generates perfectly tailored emails
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-800">
                <Mail className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">Multiple Tones</h3>
              <p className="text-gray-400 text-sm">
                Choose from professional, friendly, formal, or casual tones
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-800">
                <Check className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">Instant Results</h3>
              <p className="text-gray-400 text-sm">
                Get professionally crafted emails in seconds, not minutes
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-400 text-sm">
              Built with Pydantic AI, Next.js, and TailwindCSS
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
