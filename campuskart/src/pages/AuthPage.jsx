import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'
import { useAppContext } from '../hooks/useAppContext'

const COURSE_OPTIONS = ['B.Tech', 'BCA', 'BBA', 'B.Com', 'BA', 'B.Sc', 'M.Tech', 'MCA', 'MBA']

const SPECIALISATION_BY_COURSE = {
  'B.Tech': ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'],
  BCA: ['Software Development', 'Data Analytics', 'Cloud Computing'],
  BBA: ['Marketing', 'Finance', 'HR', 'Business Analytics'],
  'B.Com': ['Accounting', 'Taxation', 'Banking'],
  BA: ['English', 'Economics', 'Psychology', 'Political Science'],
  'B.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'],
  'M.Tech': ['AI & ML', 'VLSI', 'Data Science'],
  MCA: ['Full Stack Development', 'Data Science', 'Cyber Security'],
  MBA: ['Marketing', 'Finance', 'Operations', 'HR'],
}

const YEAR_OPTIONS = ['1', '2', '3', '4', '5']

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, addToast } = useAppContext()
  const [mode, setMode] = useState('signin')
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    course: '',
    specialization: '',
    year: '',
    universityRollNo: '',
    email: '',
  })

  const specializationOptions = useMemo(
    () => SPECIALISATION_BY_COURSE[signUpForm.course] || [],
    [signUpForm.course],
  )

  const signUpErrors = useMemo(() => {
    if (mode !== 'signup') return {}
    return {
      name: signUpForm.name ? '' : 'Name is required',
      course: signUpForm.course ? '' : 'Course is required',
      specialization: signUpForm.specialization ? '' : 'Specialisation is required',
      year: signUpForm.year ? '' : 'Year is required',
      universityRollNo: signUpForm.universityRollNo ? '' : 'University roll no is required',
      email: signUpForm.email ? '' : 'Mail ID is required',
    }
  }, [mode, signUpForm])

  const hasSignUpError = Object.values(signUpErrors).some(Boolean)

  const handleSignIn = (event) => {
    event.preventDefault()
    if (!signInForm.email || !signInForm.password) {
      addToast('Enter email and password', 'error')
      return
    }
    signIn(signInForm)
    addToast('Welcome back!')
    navigate('/')
  }

  const handleSignUp = (event) => {
    event.preventDefault()
    if (hasSignUpError) {
      addToast('Please fill all signup fields', 'error')
      return
    }
    signUp(signUpForm)
    addToast('Account created successfully')
    navigate('/')
  }

  const handleGoogleSignUp = () => {
    signUp({
      name: 'Google Student',
      course: 'B.Tech',
      specialization: 'Computer Science',
      year: '3',
      universityRollNo: 'GK2026-001',
      email: 'google.student@campus.edu',
    })
    addToast('Signed up with Google')
    navigate('/')
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='mx-auto w-full max-w-2xl'>
      <section className='glass-panel rounded-[2rem] p-5 sm:p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <p className='section-kicker'>Access CampusKart</p>
            <h1 className='text-3xl font-black text-slate-900 dark:text-slate-100'>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
          </div>
        </div>

        <div className='mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800'>
          <button
            onClick={() => setMode('signin')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === 'signin'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className='space-y-4'>
            <InputField
              label='Mail ID'
              type='email'
              value={signInForm.email}
              onChange={(event) => setSignInForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder='you@college.edu'
            />
            <InputField
              label='Password'
              type='password'
              value={signInForm.password}
              onChange={(event) => setSignInForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder='••••••••'
            />
            <Button className='w-full' type='submit'>
              Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className='space-y-4'>
            <InputField
              label='Name'
              value={signUpForm.name}
              onChange={(event) => setSignUpForm((prev) => ({ ...prev, name: event.target.value }))}
              error={signUpErrors.name}
              placeholder='Your full name'
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='block space-y-2'>
                <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Course
                </span>
                <select
                  value={signUpForm.course}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      course: event.target.value,
                      specialization: '',
                    }))
                  }
                  className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none dark:bg-slate-900/70 ${
                    signUpErrors.course ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-indigo-500'
                  }`}
                >
                  <option value=''>Select course</option>
                  {COURSE_OPTIONS.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {signUpErrors.course ? <span className='text-xs text-rose-500'>{signUpErrors.course}</span> : null}
              </label>

              <label className='block space-y-2'>
                <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Specialisation
                </span>
                <select
                  value={signUpForm.specialization}
                  onChange={(event) =>
                    setSignUpForm((prev) => ({
                      ...prev,
                      specialization: event.target.value,
                    }))
                  }
                  disabled={!signUpForm.course}
                  className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none dark:bg-slate-900/70 ${
                    signUpErrors.specialization ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-indigo-500'
                  } ${!signUpForm.course ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <option value=''>{signUpForm.course ? 'Select specialisation' : 'Select course first'}</option>
                  {specializationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {signUpErrors.specialization ? (
                  <span className='text-xs text-rose-500'>{signUpErrors.specialization}</span>
                ) : null}
              </label>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='block space-y-2'>
                <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Year
                </span>
                <select
                  value={signUpForm.year}
                  onChange={(event) => setSignUpForm((prev) => ({ ...prev, year: event.target.value }))}
                  className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none dark:bg-slate-900/70 ${
                    signUpErrors.year ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-indigo-500'
                  }`}
                >
                  <option value=''>Select year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
                {signUpErrors.year ? <span className='text-xs text-rose-500'>{signUpErrors.year}</span> : null}
              </label>
              <InputField
                label='University Roll No'
                value={signUpForm.universityRollNo}
                onChange={(event) => setSignUpForm((prev) => ({ ...prev, universityRollNo: event.target.value }))}
                error={signUpErrors.universityRollNo}
                placeholder='Roll number'
              />
            </div>
            <InputField
              label='Mail ID'
              type='email'
              value={signUpForm.email}
              onChange={(event) => setSignUpForm((prev) => ({ ...prev, email: event.target.value }))}
              error={signUpErrors.email}
              placeholder='you@college.edu'
            />

            <Button className='w-full' type='submit'>
              Create Account
            </Button>

            <button
              type='button'
              onClick={handleGoogleSignUp}
              className='flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            >
              <span className='text-base'>G</span>
              Sign up with Google
            </button>
          </form>
        )}
      </section>
    </Motion.main>
  )
}
