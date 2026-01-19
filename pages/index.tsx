import { useState } from 'react'
import Head from 'next/head'
import { Sparkles, Mail, Loader2, Copy, Check, AlertCircle } from 'lucide-react'

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
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const resetForm = () => {
    setContext('')
    setRecipientName('')
    setAdditionalDetails('')
    setResult(null)
    setError(null)
  }

  return (
    <>
      <Head>
        <title>EmailCraft AI - Professional Email Writing Assistant</title>
        <meta name="description" content="Generate professional emails with AI in seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">EmailCraft AI</h1>
                  <p className="text-sm text-gray-500">Professional Email Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Craft Perfect Emails in Seconds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let AI help you write professional, clear, and effective emails. 
              Just describe what you need, and we'll handle the rest.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="context" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label htmlFor="recipient" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="card">
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
                    <p className="text-gray-600 font-medium">Crafting your perfect email...</p>
                    <p className="text-sm text-gray-500">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-4">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-primary-600" />
                        <h3 className="font-semibold text-gray-900">Generated Email</h3>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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
                        <p className="mt-1 text-gray-900 font-medium">{result.subject}</p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Email Body
                        </label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                          <pre className="text-gray-900 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                            {result.body}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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
                    <div className="card bg-primary-50 border-primary-200">
                      <h4 className="font-semibold text-gray-900 mb-3">💡 Suggestions</h4>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={resetForm}
                    className="btn-secondary w-full"
                  >
                    Generate Another Email
                  </button>
                </div>
              )}

              {!result && !loading && !error && (
                <div className="card bg-gray-50 border-gray-200">
                  <div className="text-center py-12">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-600">
                      Fill in the form and click "Generate Email" to see your AI-crafted message here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI understands context and generates perfectly tailored emails
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Tones</h3>
              <p className="text-gray-600 text-sm">
                Choose from professional, friendly, formal, or casual tones
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm">
                Get professionally crafted emails in seconds, not minutes
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              Built with Pydantic AI, Next.js, and TailwindCSS
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
