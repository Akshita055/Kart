import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'
import { useAppContext } from '../hooks/useAppContext'

export function AddProductPage() {
  const { addToast } = useAppContext()
  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
  })
  const [preview, setPreview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(
    () => ({
      title: submitted && !form.title ? 'Title is required' : '',
      category: submitted && !form.category ? 'Category is required' : '',
      price: submitted && !form.price ? 'Price is required' : '',
      description: submitted && form.description.length < 20 ? 'Add at least 20 characters' : '',
    }),
    [form, submitted],
  )

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const onSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const hasError = Object.values(errors).some(Boolean)
    if (hasError) {
      addToast('Please fix form errors', 'error')
      return
    }
    addToast('Listing posted successfully')
    setForm({ title: '', category: '', price: '', description: '' })
    setPreview('')
    setSubmitted(false)
  }

  const onImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='grid gap-10 lg:grid-cols-12'>
      <section className='space-y-6 lg:col-span-5'>
        <p className='section-kicker'>Sell Faster</p>
        <h1 className='text-5xl font-black leading-tight text-slate-900 dark:text-slate-100'>
          Turn unused items into tuition funds.
        </h1>
        <p className='max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300'>
          Join students curating the campus economy. Listings go live for verified college peers.
        </p>

        <article className='glass-panel rounded-3xl p-6'>
          <h3 className='text-lg font-black text-slate-900 dark:text-slate-100'>Listing Tips</h3>
          <ul className='mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300'>
            <li>Use bright images for faster responses.</li>
            <li>Mention flaws and accessories clearly.</li>
            <li>Choose a fair campus-friendly price.</li>
          </ul>
        </article>
      </section>

      <section className='lg:col-span-7'>
        <form onSubmit={onSubmit} className='glass-panel space-y-6 rounded-[2rem] p-6 md:p-8'>
          <div className='flex items-end justify-between'>
            <div>
              <p className='section-kicker'>New Listing</p>
              <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Create New Listing</h2>
            </div>
            <span className='rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'>
              Verified Campus Seller
            </span>
          </div>

          <label className='block cursor-pointer space-y-2'>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Product Gallery
            </span>
            <div className='grid place-items-center rounded-3xl border-2 border-dashed border-slate-300 bg-linear-to-br from-slate-50/90 to-cyan-50/60 p-8 dark:border-slate-700 dark:from-slate-800/70 dark:to-slate-900/60'>
              {preview ? (
                <img src={preview} alt='preview' className='h-44 w-full rounded-2xl object-cover' />
              ) : (
                <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
                  Drag image or click to upload
                </p>
              )}
            </div>
            <input type='file' className='hidden' onChange={onImageUpload} />
          </label>

          <div className='grid gap-5 md:grid-cols-2'>
            <InputField
              label='Item Title'
              placeholder='e.g. Organic Chemistry Textbook'
              value={form.title}
              onChange={(event) => onChange('title', event.target.value)}
              error={errors.title}
            />

            <label className='block space-y-2'>
              <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                Category
              </span>
              <select
                value={form.category}
                onChange={(event) => onChange('category', event.target.value)}
                className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none dark:bg-slate-900/70 ${
                  errors.category ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-indigo-500'
                }`}
              >
                <option value=''>Select Category</option>
                <option value='books'>Textbooks</option>
                <option value='electronics'>Electronics</option>
                <option value='furniture'>Dorm Decor</option>
                <option value='notes'>Notes</option>
              </select>
              {errors.category ? <span className='text-xs text-rose-500'>{errors.category}</span> : null}
            </label>
          </div>

          <InputField
            label='Price'
            type='number'
            placeholder='0.00'
            value={form.price}
            onChange={(event) => onChange('price', event.target.value)}
            error={errors.price}
          />

          <label className='block space-y-2'>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Detailed Description
            </span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none dark:bg-slate-900/70 ${
                errors.description ? 'ring-1 ring-rose-400' : 'focus:ring-1 focus:ring-indigo-500'
              }`}
            />
            {errors.description ? <span className='text-xs text-rose-500'>{errors.description}</span> : null}
          </label>

          <div className='flex flex-wrap items-center gap-3'>
            <Button type='submit'>Post Item</Button>
            <Button type='button' variant='secondary' onClick={() => addToast('Draft saved')}>
              Save as Draft
            </Button>
          </div>
        </form>
      </section>
    </Motion.main>
  )
}
