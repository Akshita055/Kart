import { motion as Motion } from 'framer-motion'

export function CategoryCard({ category }) {
  return (
    <Motion.article
      whileHover={{ y: -6 }}
      className='group relative aspect-square overflow-hidden rounded-3xl'
    >
      <img
        src={category.image}
        alt={category.title}
        className='h-full w-full object-cover transition duration-700 group-hover:scale-110'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent' />
      <div className='absolute bottom-3 left-3 right-3 text-white sm:bottom-4 sm:left-4'>
        <h3 className='truncate text-base font-bold sm:text-lg'>{category.title}</h3>
        <p className='truncate text-[11px] text-white/80 sm:text-xs'>{category.listings}</p>
      </div>
    </Motion.article>
  )
}
