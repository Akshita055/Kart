import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
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

export function EditProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile, addToast } = useAppContext()

  const [form, setForm] = useState({
    photoUrl: user?.photoUrl || '',
    name: user?.name || '',
    email: user?.email || '',
    course: user?.course || '',
    specialization: user?.specialization || '',
    year: user?.year || '',
    universityRollNo: user?.universityRollNo || '',
  })

  const specializationOptions = useMemo(
    () => SPECIALISATION_BY_COURSE[form.course] || [],
    [form.course],
  )

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setField('photoUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    if (!form.name || !form.email) {
      addToast('Name and email are required', 'error')
      return
    }
    updateProfile(form)
    addToast('Profile updated successfully')
    navigate('/profile')
  }

  if (!isAuthenticated) {
    return (
      <main className='mx-auto w-full max-w-xl'>
        <section className='glass-panel rounded-[2rem] p-8 text-center'>
          <h1 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Please login first</h1>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>You need to sign in before editing profile details.</p>
          <Link to='/auth' className='mt-5 inline-block'>
            <Button>Go to Login</Button>
          </Link>
        </section>
      </main>
    )
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='mx-auto w-full max-w-3xl'>
      <section className='glass-panel rounded-[2rem] p-5 sm:p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <p className='section-kicker'>Profile Settings</p>
            <h1 className='text-3xl font-black text-slate-900 dark:text-slate-100'>Edit Profile</h1>
          </div>
        </div>

        <form onSubmit={saveProfile} className='space-y-4'>
          <div className='space-y-2'>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Profile Picture
            </span>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
              <div className='h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'>
                {form.photoUrl ? (
                  <img src={form.photoUrl} alt='Profile' className='h-full w-full object-cover' />
                ) : (
                  <div className='grid h-full w-full place-items-center text-3xl text-slate-400'>☺</div>
                )}
              </div>
              <label className='inline-flex cursor-pointer items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'>
                Upload Photo
                <input type='file' accept='image/*' className='hidden' onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>

          <InputField
            label='Name'
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder='Your full name'
          />

          <InputField
            label='Mail ID'
            type='email'
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            placeholder='you@college.edu'
          />

          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='block space-y-2'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Course
              </span>
              <select
                value={form.course}
                onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value, specialization: '' }))}
                className='w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900/70'
              >
                <option value=''>Select course</option>
                {COURSE_OPTIONS.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>

            <label className='block space-y-2'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Specialisation
              </span>
              <select
                value={form.specialization}
                onChange={(event) => setField('specialization', event.target.value)}
                disabled={!form.course}
                className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900/70 ${
                  !form.course ? 'cursor-not-allowed opacity-70' : ''
                }`}
              >
                <option value=''>{form.course ? 'Select specialisation' : 'Select course first'}</option>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <label className='block space-y-2'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Year
              </span>
              <select
                value={form.year}
                onChange={(event) => setField('year', event.target.value)}
                className='w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900/70'
              >
                <option value=''>Select year</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </label>

            <InputField
              label='University Roll No'
              value={form.universityRollNo}
              onChange={(event) => setField('universityRollNo', event.target.value)}
              placeholder='Roll number'
            />
          </div>

          <div className='flex flex-wrap items-center gap-3 pt-2'>
            <Button type='submit'>Save Changes</Button>
            <Link to='/profile'>
              <Button variant='secondary' type='button'>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </section>
    </Motion.main>
  )
}
