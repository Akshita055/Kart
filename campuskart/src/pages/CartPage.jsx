import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { Button } from '../components/Button'
import { useAppContext } from '../hooks/useAppContext'

export function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    increaseCartItem,
    decreaseCartItem,
    removeFromCart,
    checkout,
    addToast,
  } = useAppContext()

  const handleCheckout = () => {
    if (!cartItems.length) {
      addToast('Your cart is empty', 'error')
      return
    }
    checkout()
    addToast('Checkout created. Payment gateway can be integrated next.')
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
      <div className='flex items-end justify-between'>
        <div>
          <p className='section-kicker'>Your Orders</p>
          <h1 className='text-3xl font-black text-slate-900 dark:text-slate-100'>Cart</h1>
        </div>
        <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>{cartItems.length} items</p>
      </div>

      {cartItems.length === 0 ? (
        <section className='glass-panel rounded-[2rem] p-10 text-center'>
          <h2 className='text-xl font-bold text-slate-900 dark:text-slate-100'>Your cart is empty</h2>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>Add items from the marketplace to continue.</p>
          <Link to='/' className='mt-5 inline-block'>
            <Button>Browse Products</Button>
          </Link>
        </section>
      ) : (
        <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
          <section className='space-y-4'>
            {cartItems.map((item) => (
              <article key={item._id} className='glass-panel rounded-3xl p-4 sm:p-5'>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <img src={item.image} alt={item.title} className='h-24 w-full rounded-2xl object-cover sm:w-32' />

                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-wrap items-start justify-between gap-2'>
                      <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>{item.title}</h3>
                      <p className='text-lg font-extrabold text-indigo-600 dark:text-indigo-300'>${item.price}</p>
                    </div>
                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{item?.userId?.name || item.seller || 'Campus Seller'}</p>

                    <div className='mt-4 flex flex-wrap items-center gap-3'>
                      <div className='flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800'>
                        <button
                          onClick={() => decreaseCartItem(item._id)}
                          className='h-8 w-8 rounded-xl bg-white font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                        >
                          -
                        </button>
                        <span className='w-8 text-center text-sm font-bold'>{item.quantity}</span>
                        <button
                          onClick={() => increaseCartItem(item._id)}
                          className='h-8 w-8 rounded-xl bg-white font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className='rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 dark:border-rose-800 dark:text-rose-300'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className='glass-panel h-fit rounded-3xl p-5'>
            <h2 className='text-lg font-black text-slate-900 dark:text-slate-100'>Order Summary</h2>
            <div className='mt-4 space-y-2 text-sm'>
              <div className='flex items-center justify-between text-slate-600 dark:text-slate-300'>
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className='flex items-center justify-between text-slate-600 dark:text-slate-300'>
                <span>Delivery</span>
                <span>$0.00</span>
              </div>
              <div className='mt-2 border-t border-slate-200 pt-2 dark:border-slate-700'>
                <div className='flex items-center justify-between font-extrabold text-slate-900 dark:text-slate-100'>
                  <span>Total</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className='mt-5 w-full' onClick={handleCheckout}>
              Checkout
            </Button>
            <p className='mt-2 text-xs text-slate-500 dark:text-slate-400'>Payment gateway integration can be added next.</p>
          </aside>
        </div>
      )}
    </Motion.main>
  )
}
