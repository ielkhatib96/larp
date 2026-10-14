import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { ProgressBar } from '../components/questionnaire/parts.jsx'
import {
  StepCampus,
  StepEvents,
  StepExperience,
  StepFree,
  StepHelp,
  StepInterests,
  StepStudy,
} from '../components/questionnaire/steps.jsx'
import TopBar from '../components/TopBar.jsx'
import { YEARS } from '../questionnaireOptions.js'
import { clearAnswers, loadAnswers, saveAnswers } from '../questionnaireStore.js'

const TOTAL_STEPS = 7
const FINISH = TOTAL_STEPS + 1 // the "create your account" screen after the last question

// Can the student move on from this screen? Only the required questions block them.
function canContinue(step, a) {
  if (step === 1) return a.campus !== ''
  if (step === 2) return a.course !== '' && a.yearLabel !== ''
  if (step === 4) return a.tag_ids.length >= 1
  if (step === 5) return a.alcohol_pref !== '' && a.goal !== ''
  return true // steps 3, 6 and 7 can be skipped
}

// Turns the saved answers into the shape /api/register expects (see RegisterIn in the back end).
function buildRegistration(a, account) {
  const year = YEARS.find((y) => y.label === a.yearLabel)?.value
  return {
    ...account, // name, ucl_email, password
    campus: a.campus,
    travel_ok: a.travel_ok,
    course: a.course,
    year,
    experience_industry: a.experience_industry,
    experience_note: a.experience_note.trim() || null,
    tag_ids: a.tag_ids,
    alcohol_pref: a.alcohol_pref,
    goal: a.goal,
    looking_for: a.looking_for ? [a.looking_for] : [],
    offers: a.offers ? [a.offers] : [],
    availability: a.availability,
  }
}

// The questionnaire: one screen at a time, answers kept in sessionStorage until the student registers.
function Questionnaire() {
  const [answers, setAnswers] = useState(loadAnswers)
  const [categories, setCategories] = useState(null) // the interest tags from /api/tags
  const [tagsError, setTagsError] = useState('')

  const step = answers.step

  // Change some answers and save them straight away (so a refresh loses nothing).
  function set(changes) {
    const next = { ...answers, ...changes }
    setAnswers(next)
    saveAnswers(next)
  }

  // Fetch the interest tags once.
  useEffect(() => {
    api
      .get('/tags')
      .then(setCategories)
      .catch(() => setTagsError("Couldn't load the interests. Is the back end running?"))
  }, [])

  const screens = {
    1: <StepCampus a={answers} set={set} />,
    2: <StepStudy a={answers} set={set} />,
    3: <StepExperience a={answers} set={set} />,
    4: <StepInterests a={answers} set={set} categories={categories} tagsError={tagsError} />,
    5: <StepEvents a={answers} set={set} />,
    6: <StepHelp a={answers} set={set} />,
    7: <StepFree a={answers} set={set} />,
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto w-full max-w-xl px-5 pb-16">
        {step === FINISH ? (
          <Finish answers={answers} onBack={() => set({ step: TOTAL_STEPS })} />
        ) : (
          <>
            <ProgressBar step={step} total={TOTAL_STEPS} />
            <div className="mt-8">{screens[step]}</div>

            <div className="mt-10 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => set({ step: step - 1 })}
                  className="min-h-14 rounded-full border-2 border-ink/15 px-7 text-lg font-semibold transition hover:bg-brand-pale dark:border-white/25 dark:hover:bg-white/10"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                disabled={!canContinue(step, answers)}
                onClick={() => set({ step: step + 1 })}
                className="min-h-14 flex-1 rounded-full bg-brand px-7 text-lg font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-brand-mid"
              >
                {step === TOTAL_STEPS ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// TEMPORARY last screen. Step 9 replaces it with the real registration and pairing choice.
// It exists so we can prove the saved answers really reach POST /api/register.
function Finish({ answers, onBack }) {
  const [form, setForm] = useState({ name: '', ucl_email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await api.post('/register', buildRegistration(answers, form))
      localStorage.setItem('token', result.token) // api.js sends this on later requests
      clearAnswers() // the answers now live in the database, so forget the browser copy
      setDone(true)
    } catch (err) {
      setError(err.message) // answers stay saved so the student can fix the email and retry
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-3xl border border-brand-pale bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
        <h1 className="font-display text-4xl font-normal">You're in!</h1>
        <p className="mt-3 text-lg text-muted dark:text-white/75">
          Your account is created. Pairing and your group come next (Step 9).
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-semibold text-white dark:bg-white dark:text-ink"
        >
          Back to the start
        </Link>
      </div>
    )
  }

  const inputClass = 'min-h-14 w-full rounded-2xl border-2 border-ink/15 bg-white px-4 text-lg text-ink dark:border-white/25'
  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <h1 className="font-display text-4xl font-normal">Last step: create your account</h1>
      <p className="rounded-2xl bg-brand-pale p-3 text-sm text-ink">
        Temporary form for Step 8. The full registration screen arrives in Step 9.
      </p>
      <label className="block">
        <span className="mb-1.5 block font-medium">Name</span>
        <input required className={inputClass} value={form.name} onChange={change('name')} autoComplete="name" />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-medium">UCL email</span>
        <input required type="email" className={inputClass} value={form.ucl_email} onChange={change('ucl_email')} autoComplete="email" placeholder="you@ucl.ac.uk" />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-medium">Password (8 characters or more)</span>
        <input required type="password" minLength={8} maxLength={72} className={inputClass} value={form.password} onChange={change('password')} autoComplete="new-password" />
      </label>
      {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="min-h-14 rounded-full border-2 border-ink/15 px-7 text-lg font-semibold dark:border-white/25">
          Back
        </button>
        <button type="submit" disabled={busy} className="min-h-14 flex-1 rounded-full bg-brand px-7 text-lg font-semibold text-white disabled:opacity-40">
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </div>
    </form>
  )
}

export default Questionnaire
