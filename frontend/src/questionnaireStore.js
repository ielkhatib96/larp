// Keeps the questionnaire answers in the browser until the student registers.
//
// sessionStorage lives only in this browser tab: a refresh keeps it, closing the tab clears it.
// Nothing is sent to the back end (and no account is made) until the final "create account" step.

const KEY = 'larp_answers'

// What the questionnaire looks like before anyone has answered anything.
export const EMPTY_ANSWERS = {
  step: 1, // which screen the student is on
  campus: '',
  travel_ok: true, // "happy to travel" starts switched on
  course: '',
  yearLabel: '', // "Masters" and "PhD" both mean year 5, so we remember the label the student picked
  hasExperience: null, // null = not answered, false = "None", true = "I have some"
  experience_industry: [],
  experience_note: '',
  tag_ids: [],
  alcohol_pref: '',
  goal: '',
  looking_for: '',
  offers: '',
  availability: [],
}

export function loadAnswers() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY))
    return { ...EMPTY_ANSWERS, ...saved }
  } catch {
    return { ...EMPTY_ANSWERS } // nothing saved yet, or it was unreadable
  }
}

export function saveAnswers(answers) {
  sessionStorage.setItem(KEY, JSON.stringify(answers))
}

export function clearAnswers() {
  sessionStorage.removeItem(KEY)
}
