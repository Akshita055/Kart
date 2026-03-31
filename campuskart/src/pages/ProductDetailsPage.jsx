import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { products } from '../utils/data'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useAppContext } from '../hooks/useAppContext'

export function ProductDetailsPage() {
  const { id } = useParams()
  const { addToast } = useAppContext()
  const product = useMemo(() => products.find((item) => item.id === id) || products[0], [id])
  const [activeImage, setActiveImage] = useState(product.image)
  const [openModal, setOpenModal] = useState(false)

  const gallery = [
    product.image,
    'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  ]

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
      <div className='grid gap-8 lg:grid-cols-12'>
        <section className='space-y-4 lg:col-span-7'>
          <div className='glass-panel group overflow-hidden rounded-[2rem]'>
            <img
              src={activeImage}
              alt={product.title}
              className='aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105'
            />
          </div>
          <div className='grid grid-cols-4 gap-3'>
            {gallery.map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(image)}
                className={`overflow-hidden rounded-2xl border-2 ${
                  activeImage === image ? 'border-indigo-500' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`preview-${index}`} className='aspect-square w-full object-cover' />
              </button>
            ))}
          </div>
          <article className='glass-panel rounded-3xl p-6'>
            <h3 className='text-xl font-black text-slate-900 dark:text-slate-100'>Detailed Description</h3>
            <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300'>
              Selling my 2023 device in pristine condition. Includes original accessories and box. Prefer a
              safe campus meetup. Open to reasonable offers from verified students.
            </p>
          </article>
        </section>

        <section className='space-y-6 lg:col-span-5'>
          <article className='glass-panel rounded-[2rem] p-6'>
            <div className='mb-2 flex gap-2'>
              <span className='rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'>
                {product.tag}
              </span>
              <span className='rounded-full bg-cyan-100 px-3 py-1 text-[10px] font-bold uppercase text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300'>
                {product.category}
              </span>
            </div>
            <h1 className='text-3xl font-black leading-tight text-slate-900 dark:text-slate-100'>{product.title}</h1>
            <div className='mt-4 flex items-end gap-3'>
              <p className='text-5xl font-black text-indigo-600 dark:text-indigo-300'>${product.price}</p>
              <p className='text-sm text-slate-400 line-through'>${product.originalPrice}</p>
            </div>
            <p className='mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Listed 2 hours ago • North Campus
            </p>

            <div className='mt-6 space-y-3'>
              <Button className='w-full text-base' onClick={() => setOpenModal(true)}>
                Chat with Seller
              </Button>
              <Button variant='secondary' className='w-full text-base' onClick={() => addToast('Added to cart')}>
                Buy Now
              </Button>
            </div>
          </article>

          <article className='glass-panel rounded-3xl p-6'>
            <h3 className='text-lg font-black text-slate-900 dark:text-slate-100'>Seller Information</h3>
            <div className='mt-4 flex items-center gap-3'>
              <img
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
                alt='seller'
                className='h-14 w-14 rounded-2xl object-cover'
              />
              <div>
                <p className='font-bold text-slate-900 dark:text-slate-100'>Alex Rivers</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>Verified Student</p>
              </div>
            </div>
            <div className='mt-5 grid grid-cols-2 gap-3'>
              <div className='rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-800/70'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Response Time
                </p>
                <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>~15 mins</p>
              </div>
              <div className='rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-800/70'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Deals
                </p>
                <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>42 completed</p>
              </div>
            </div>
          </article>
        </section>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title='Start Conversation'>
        <p className='text-sm text-slate-600 dark:text-slate-300'>
          Hi Alex, is this item still available? I can meet at the library this afternoon.
        </p>
      </Modal>
    </Motion.main>
  )
}
