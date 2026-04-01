import { useMemo, useState } from 'react'
import { Modal } from './Modal'
import { InputField } from './InputField'
import { Button } from './Button'
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

export function EditProfileModal({ open, onClose }) {
  const { user, updateProfile, addToast } = useAppContext()
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

  const saveProfile = (event) => {
    event.preventDefault()
    if (!form.name || !form.email) {
      addToast('Name and email are required', 'error')
      return
    }

    updateProfile(form)
    addToast('Profile updated')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title='Edit Profile'>
      <form onSubmit={saveProfile} className='space-y-4'>
        <InputField
          label='Photo URL'
          value={form.photoUrl}
          onChange={(event) => setField('photoUrl', event.target.value)}
          placeholder='https://...'
        />

        {form.photoUrl ? (
          <img
            src={form.photoUrl}
            alt='Profile preview'
            className='h-24 w-24 rounded-2xl object-cover'
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : null}

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

        <Button className='w-full' type='submit'>
          Save Changes
        </Button>
      </form>
    </Modal>
  )
}
