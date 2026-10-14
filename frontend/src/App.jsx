import { Route, Routes } from 'react-router-dom'
import ComingSoon from './pages/ComingSoon.jsx'
import Landing from './pages/Landing.jsx'
import Questionnaire from './pages/Questionnaire.jsx'

// The list of pages. Each <Route> says: "when the address is this, show that page".
// Login is a placeholder until Step 9 replaces it.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route
        path="/login"
        element={
          <ComingSoon
            title="Log in"
            step="Step 9"
            text="Logging in for existing members is coming soon."
          />
        }
      />
      {/* Anything else goes back to a friendly page instead of a blank screen. */}
      <Route path="*" element={<ComingSoon title="Page not found" step="" text="That page doesn't exist." />} />
    </Routes>
  )
}

export default App
