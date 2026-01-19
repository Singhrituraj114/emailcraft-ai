import { useState } from 'react'

export default function Test() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'I need to schedule a meeting with the team',
          tone: 'professional'
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(`HTTP ${res.status}: ${JSON.stringify(data)}`)
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Test Page</h1>
      <button onClick={testAPI} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#fee', border: '1px solid red' }}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#efe', border: '1px solid green' }}>
          <strong>Success!</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
