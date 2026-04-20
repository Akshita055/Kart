import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAppContext } from '../hooks/useAppContext'

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveWishlistToCart, addToast } = useAppContext()

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='flex items-end justify-between'>
        <div>
          <p className='section-kicker'>Saved Items</p>
          <h1 className='text-3xl font-black text-slate-900 dark:text-slate-100'>Wishlist</h1>
        </div>
        <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>{wishlistItems.length} items</p>
      </div>

      {wishlistItems.length === 0 ? (
        <section className='glass-panel rounded-[2rem] p-10 text-center'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>No wishlist items yet</h2>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>Save items to compare and buy later.</p>
          <Link to='/' className='mt-5 inline-block'>
            <Button>Explore Products</Button>
          </Link>
        </section>
      ) : (
        <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
          {wishlistItems.map((item) => (
            <article key={item._id} className='glass-panel flex h-full flex-col rounded-3xl p-4'>
              <img src={item.images?.[0] || item.image} alt={item.title} className='aspect-[4/3] w-full rounded-2xl object-cover' />
              <div className='mt-3 flex-1 space-y-2'>
                <div className='flex items-start justify-between gap-2'>
                  <h3 className='line-clamp-2 text-lg font-bold text-slate-900 dark:text-slate-100'>{item.title}</h3>
                  <span className='text-lg font-extrabold text-indigo-600 dark:text-indigo-300'>${item.price}</span>
                </div>
                <p className='line-clamp-2 text-sm text-slate-500 dark:text-slate-400'>{item.description}</p>
              </div>

              <div className='mt-4 grid gap-2 min-[430px]:grid-cols-2'>
                <Button
                  className='w-full'
                  onClick={() => {
                    moveWishlistToCart(item)
                    addToast('Moved to cart')
                  }}
                >
                  Move to Cart
                </Button>
                <Button variant='secondary' className='w-full' onClick={() => removeFromWishlist(item._id)}>
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </Motion.main>
  )
}
