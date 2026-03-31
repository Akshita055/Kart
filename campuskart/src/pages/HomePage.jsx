import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { categories, products } from '../utils/data'
import { CategoryCard } from '../components/CategoryCard'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductCard } from '../components/ProductCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { useAppContext } from '../hooks/useAppContext'

export function HomePage() {
  const { searchQuery } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(700)
  const [loading] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      const priceMatch = item.price <= maxPrice
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      return categoryMatch && priceMatch && searchMatch
    })
  }, [maxPrice, searchQuery, selectedCategory])

  return (
    <Motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-10'
    >
      <section className='relative overflow-hidden rounded-[2rem] bg-linear-to-br from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-[0_30px_65px_rgba(37,99,235,0.35)] md:p-12'>
        <div className='absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/20 blur-2xl' />
        <div className='absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-200/25 blur-2xl' />
        <div className='absolute bottom-4 left-8 hidden gap-2 md:flex'>
          <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide backdrop-blur-sm'>
            2k+ Verified Students
          </span>
          <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wide backdrop-blur-sm'>
            Safe Campus Meetups
          </span>
        </div>
        <div className='relative grid items-center gap-8 md:grid-cols-2'>
          <div className='space-y-5'>
            <p className='section-kicker !text-cyan-100'>Student Marketplace</p>
            <h1 className='text-4xl font-black leading-tight md:text-6xl'>
              The Campus <span className='text-cyan-100'>Commons.</span>
            </h1>
            <p className='max-w-md text-sm text-white/90 md:text-base'>
              Curated student-to-student marketplace for books, electronics, dorm furniture, and notes.
            </p>
            <div className='flex flex-wrap gap-3'>
              <button className='rounded-full bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 shadow-lg'>
                Shop All
              </button>
              <button className='rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-bold backdrop-blur-sm'>
                How it works
              </button>
            </div>
          </div>
          <Motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className='rounded-3xl border border-white/30 bg-white/10 p-4 backdrop-blur-md'
          >
            <img
              src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
              alt='Students'
              onError={(event) => {
                event.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
              }}
              className='aspect-video w-full rounded-2xl object-cover'
            />
          </Motion.div>
        </div>
      </section>

      <section className='space-y-4'>
        <div className='flex items-end justify-between'>
          <div>
            <p className='section-kicker'>Curated Picks</p>
            <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Explore Collections</h2>
          </div>
          <button className='text-sm font-bold text-indigo-600 dark:text-indigo-300'>View All</button>
        </div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className='grid gap-6 lg:grid-cols-[250px_1fr]'>
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='section-kicker'>Fresh Nearby</p>
              <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Nearby Listings</h2>
            </div>
            <span className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
              {filteredProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length ? (
            <Motion.div
              initial='hidden'
              animate='show'
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.07 },
                },
              }}
              className='grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3'
            >
              {filteredProducts.map((product) => (
                <Motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
                  <ProductCard product={product} />
                </Motion.div>
              ))}
            </Motion.div>
          ) : (
            <div className='rounded-3xl border border-dashed border-slate-300 bg-white/50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100'>No products found</h3>
              <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>Try changing your filters or search keyword.</p>
            </div>
          )}
        </div>
      </section>
    </Motion.main>
  )
}
