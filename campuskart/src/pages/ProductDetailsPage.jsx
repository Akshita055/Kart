import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useAppContext } from '../hooks/useAppContext'
import { productApi } from '../lib/api'

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    addToast,
    addToCart,
    toggleWishlist,
    isInWishlist,
    rateSeller,
    getSellerRating,
    sendOffer,
    ensureChatRoom,
    user,
  } = useAppContext()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [sellerStats, setSellerStats] = useState({ averageRating: 0, totalRatings: 0 })
  const [reviewText, setReviewText] = useState('')
  const [stars, setStars] = useState(5)
  const [offerPrice, setOfferPrice] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const { data } = await productApi.details(id)
        setProduct(data)
        if (data?.userId?._id) {
          const rating = await getSellerRating(data.userId._id)
          setSellerStats(rating)
        }
      } catch {
        addToast('Could not load product', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [addToast, getSellerRating, id])

  const wishlisted = useMemo(() => (product ? isInWishlist(product._id) : false), [isInWishlist, product])
  const gallery = useMemo(() => {
    if (!product) return []
    return product.images?.length ? product.images : [product.image]
  }, [product])
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    setActiveImage(gallery[0] || '')
  }, [gallery])

  if (loading || !product) {
    return (
      <main className='glass-panel rounded-3xl p-6 text-sm text-slate-500 dark:text-slate-300'>
        Loading product details...
      </main>
    )
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
      <div className='grid gap-8 lg:grid-cols-12'>
        <section className='space-y-4 lg:col-span-7'>
          <div className='glass-panel group overflow-hidden rounded-4xl'>
            <img
              src={activeImage}
              alt={product.title}
              className='aspect-4/3 w-full object-cover transition duration-700 group-hover:scale-105'
            />
          </div>
          <div className='grid grid-cols-4 gap-3'>
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
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
            <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300'>{product.description}</p>
          </article>
        </section>

        <section className='space-y-6 lg:col-span-5'>
          <article className='glass-panel rounded-4xl p-6'>
            <div className='mb-2 flex gap-2'>
              <span className='rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'>
                {product.category}
              </span>
              <span className='rounded-full bg-cyan-100 px-3 py-1 text-[10px] font-bold uppercase text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300'>
                {product.listingKind}
              </span>
            </div>
            <h1 className='text-3xl font-black leading-tight text-slate-900 dark:text-slate-100'>{product.title}</h1>
            <div className='mt-4 flex items-end gap-3'>
              <p className='text-5xl font-black text-indigo-600 dark:text-indigo-300'>${product.price}</p>
            </div>
            <p className='mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              {product.distanceKm ? `${product.distanceKm} km away` : 'Campus Area'}
            </p>

            <div className='mt-6 space-y-3'>
              <Button
                className='w-full text-base'
                onClick={async () => {
                  const room = await ensureChatRoom(product._id)
                  setOpenModal(false)
                  navigate('/chat', { state: { roomId: room._id } })
                }}
              >
                Chat with Seller
              </Button>
              <Button
                variant='secondary'
                className='w-full text-base'
                onClick={() => {
                  addToCart(product)
                  addToast('Added to cart')
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant='ghost'
                className='w-full text-base'
                onClick={() => {
                  toggleWishlist(product)
                  addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
                }}
              >
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </article>

          <article className='glass-panel rounded-3xl p-6'>
            <h3 className='text-lg font-black text-slate-900 dark:text-slate-100'>Seller Information</h3>
            <div className='mt-4 flex items-center gap-3'>
              <div className='grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-sm font-black text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'>
                {(product.userId?.name || 'S').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className='font-bold text-slate-900 dark:text-slate-100'>{product.userId?.name || 'Seller'}</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {product.userId?.isVerified ? 'Verified Student' : 'Unverified'}
                </p>
              </div>
            </div>
            <div className='mt-5 grid grid-cols-2 gap-3'>
              <div className='rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-800/70'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Avg. Rating
                </p>
                <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>
                  {sellerStats.averageRating} / 5
                </p>
              </div>
              <div className='rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-800/70'>
                <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Total Reviews
                </p>
                <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>{sellerStats.totalRatings}</p>
              </div>
            </div>
          </article>

          {user?.id !== product.userId?._id ? (
            <article className='glass-panel space-y-3 rounded-3xl p-6'>
              <h3 className='text-lg font-black text-slate-900 dark:text-slate-100'>Rate Seller</h3>
              <div className='flex flex-wrap gap-2'>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setStars(value)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                      stars === value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {value} ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows={3}
                className='w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-500 dark:bg-slate-900/70 dark:ring-slate-700'
                placeholder='Write a short review'
              />
              <Button
                onClick={async () => {
                  await rateSeller(product._id, stars, reviewText)
                  addToast('Thanks for your rating')
                  const rating = await getSellerRating(product.userId._id)
                  setSellerStats(rating)
                }}
              >
                Submit Rating
              </Button>
            </article>
          ) : null}

          {user?.id !== product.userId?._id ? (
            <article className='glass-panel space-y-3 rounded-3xl p-6'>
              <h3 className='text-lg font-black text-slate-900 dark:text-slate-100'>Send Offer</h3>
              <input
                type='number'
                value={offerPrice}
                onChange={(event) => setOfferPrice(event.target.value)}
                className='w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none ring-1 ring-slate-200 focus:ring-indigo-500 dark:bg-slate-900/70 dark:ring-slate-700'
                placeholder='Your offer amount'
              />
              <Button
                onClick={async () => {
                  await sendOffer({ productId: product._id, offeredPrice: Number(offerPrice) })
                  addToast('Offer sent to seller')
                  setOfferPrice('')
                }}
              >
                Send Offer
              </Button>
            </article>
          ) : null}
        </section>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title='Start Conversation'>
        <p className='text-sm text-slate-600 dark:text-slate-300'>
          Open chat with this seller in real time.
        </p>
      </Modal>
    </Motion.main>
  )
}
