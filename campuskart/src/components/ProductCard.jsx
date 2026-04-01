import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Button } from './Button'
import { useAppContext } from '../hooks/useAppContext'

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, addToast } = useAppContext()
  const wishlisted = isInWishlist(product.id)

  return (
    <Motion.article
      whileHover={{ y: -6 }}
      className='flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'
    >
      <div className='relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]'>
        <img
          src={product.image}
          alt={product.title}
          className='h-full w-full object-cover transition duration-700 hover:scale-105'
        />
        <span className='absolute left-2 top-2 max-w-[78%] truncate rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider dark:bg-slate-900/80 sm:left-3 sm:top-3 sm:px-3'>
          {product.tag}
        </span>
        <button
          onClick={() => {
            toggleWishlist(product)
            addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
          }}
          className='absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-base shadow-sm transition hover:scale-105 dark:bg-slate-900/85'
          aria-label='Toggle wishlist'
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>
      <div className='flex flex-1 flex-col space-y-3 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <h3 className='line-clamp-2 min-w-0 flex-1 text-lg font-bold leading-tight text-slate-900 dark:text-slate-100'>
            {product.title}
          </h3>
          <span className='shrink-0 whitespace-nowrap text-lg font-extrabold text-indigo-600 dark:text-indigo-300'>
            ${product.price}
          </span>
        </div>
        <p className='line-clamp-2 text-xs text-slate-500 dark:text-slate-400'>{product.description}</p>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          {product.seller} • {product.distance}
        </p>
        <div className='mt-auto grid grid-cols-1 gap-2 min-[430px]:grid-cols-2'>
          <Button
            className='w-full'
            onClick={() => {
              addToCart(product)
              addToast('Added to cart')
            }}
          >
            Add to Cart
          </Button>
          <Link to={`/product/${product.id}`} className='w-full'>
            <Button variant='secondary' className='w-full'>
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Motion.article>
  )
}
