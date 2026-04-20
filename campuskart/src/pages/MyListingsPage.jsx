import { useEffect, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAppContext } from '../hooks/useAppContext'

export function MyListingsPage() {
  const { myListings, updateListing, deleteListing, addToast, fetchProducts } = useAppContext()
  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState({ title: '', price: '', description: '' })

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const startEdit = (item) => {
    setEditingId(item._id)
    setEditForm({
      title: item.title || '',
      price: item.price || '',
      description: item.description || '',
    })
  }

  const saveEdit = async () => {
    try {
      await updateListing(editingId, editForm)
      setEditingId('')
      addToast('Listing updated')
    } catch {
      addToast('Failed to update listing', 'error')
    }
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='flex items-end justify-between'>
        <div>
          <p className='section-kicker'>Seller Dashboard</p>
          <h1 className='text-3xl font-black text-slate-900 dark:text-slate-100'>My Listings</h1>
        </div>
        <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>{myListings.length} items</p>
      </div>

      {myListings.length === 0 ? (
        <section className='glass-panel rounded-4xl p-10 text-center'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>No listings yet</h2>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>Create your first listing to start selling.</p>
        </section>
      ) : (
        <section className='space-y-4'>
          {myListings.map((item) => {
            const isEditing = editingId === item._id
            return (
              <article key={item._id} className='glass-panel rounded-3xl p-4 sm:p-5'>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.title}
                    className='h-24 w-full rounded-2xl object-cover sm:w-32'
                  />

                  <div className='min-w-0 flex-1'>
                    {isEditing ? (
                      <div className='space-y-3'>
                        <input
                          value={editForm.title}
                          onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                          className='w-full rounded-xl bg-white/70 px-3 py-2 text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-500 dark:bg-slate-900/70 dark:ring-slate-700'
                        />
                        <input
                          type='number'
                          value={editForm.price}
                          onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                          className='w-full rounded-xl bg-white/70 px-3 py-2 text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-500 dark:bg-slate-900/70 dark:ring-slate-700'
                        />
                        <textarea
                          rows={3}
                          value={editForm.description}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, description: event.target.value }))
                          }
                          className='w-full rounded-xl bg-white/70 px-3 py-2 text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-500 dark:bg-slate-900/70 dark:ring-slate-700'
                        />
                      </div>
                    ) : (
                      <>
                        <div className='flex flex-wrap items-start justify-between gap-2'>
                          <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>{item.title}</h3>
                          <p className='text-lg font-extrabold text-indigo-600 dark:text-indigo-300'>${item.price}</p>
                        </div>
                        <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                          {item.category} • {item.status}
                        </p>
                        <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>{item.description}</p>
                      </>
                    )}

                    <div className='mt-4 flex flex-wrap items-center gap-2'>
                      {isEditing ? (
                        <>
                          <Button onClick={saveEdit}>Save</Button>
                          <Button variant='secondary' onClick={() => setEditingId('')}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant='secondary' onClick={() => startEdit(item)}>
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            onClick={async () => {
                              await deleteListing(item._id)
                              addToast('Listing deleted')
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </Motion.main>
  )
}
