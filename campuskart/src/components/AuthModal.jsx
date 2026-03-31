import { useState } from 'react'
import { Modal } from './Modal'
import { InputField } from './InputField'
import { Button } from './Button'
import { useAppContext } from '../hooks/useAppContext'

export function AuthModal({ open, onClose }) {
  const { signIn, signUp, addToast } = useAppContext()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
  })

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.email || !form.password) {
      addToast('Email and password are required', 'error')
      return
    }

    if (mode === 'signup') {
      if (!form.name) {
        addToast('Name is required for sign up', 'error')
        return
      }
      signUp(form)
      addToast('Account created successfully')
      onClose()
      return
    }

    signIn(form)
    addToast('Signed in successfully')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === 'signin' ? 'Welcome Back' : 'Create Account'}>
      <div className='mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800'>
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

      <form onSubmit={handleSubmit} className='space-y-4'>
        {mode === 'signup' ? (
          <InputField
            label='Full Name'
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder='Alex Rivers'
          />
        ) : null}

        <InputField
          label='Email'
          type='email'
          value={form.email}
          onChange={(event) => setField('email', event.target.value)}
          placeholder='you@college.edu'
        />

        <InputField
          label='Password'
          type='password'
          value={form.password}
          onChange={(event) => setField('password', event.target.value)}
          placeholder='••••••••'
        />

        {mode === 'signup' ? (
          <InputField
            label='College'
            value={form.college}
            onChange={(event) => setField('college', event.target.value)}
            placeholder='Your university'
          />
        ) : null}

        <Button className='w-full' type='submit'>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Modal>
  )
}
