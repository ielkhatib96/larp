import { useEffect, useState } from 'react'

// Step 0 hello page: shows the product name and whether the back end is running.
// The real screens (landing page, questionnaire and so on) replace this from Step 7 onwards.
function App() {
  // "checking..." until the back end answers, then "ok" or "offline".
  const [backendStatus, setBackendStatus] = useState('checking...')

  // Runs once when the page loads: ask the back end if it is alive.
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus('offline'))
  }, [])

  const isOk = backendStatus === 'ok'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 p-6">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">LARP</h1>
      <p className="text-slate-600">From "I don't know anyone" to "I'm meeting my group on Thursday".</p>
      <span
        className={`rounded-full px-4 py-1 text-sm font-medium ${
          isOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        backend: {backendStatus}
      </span>
    </main>
  )
}

export default App
