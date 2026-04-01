import { motion as Motion } from 'framer-motion'
import { ProductCard } from '../components/ProductCard'
import { UserCard } from '../components/UserCard'
import { useAppContext } from '../hooks/useAppContext'
import { products, userProfile } from '../utils/data'

export function ProfilePage() {
  const { user, isAuthenticated } = useAppContext()
  const descriptor = isAuthenticated
    ? `${user?.course || 'Student'} • Year ${user?.year || '1'} • ${user?.specialization || 'General'}`
    : userProfile.college

  const profileData = {
    ...userProfile,
    name: isAuthenticated ? user?.name || userProfile.name : userProfile.name,
    email: isAuthenticated ? user?.email || userProfile.email : userProfile.email,
    college: descriptor,
    avatar: isAuthenticated ? user?.photoUrl || userProfile.avatar : userProfile.avatar,
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
      <UserCard profile={profileData} />

      <section className='grid gap-4 md:grid-cols-3'>
        {userProfile.stats.map((stat) => (
          <article
            key={stat.label}
            className='rounded-3xl border border-white/30 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'
          >
            <p className='text-3xl font-black text-slate-900 dark:text-slate-100'>{stat.value}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>My Listings</h2>
        <div className='grid gap-5 sm:grid-cols-2 2xl:grid-cols-3'>
          {products.slice(0, 3).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className='rounded-3xl border border-white/30 bg-white/75 p-6 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
        <h3 className='text-xl font-black text-slate-900 dark:text-slate-100'>Ratings & Reviews</h3>
        <div className='mt-4 space-y-4'>
          <article className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60'>
            <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>Mia T. • ★★★★★</p>
            <p className='text-sm text-slate-600 dark:text-slate-300'>Great seller, smooth and fast meetup.</p>
          </article>
          <article className='rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60'>
            <p className='text-sm font-bold text-slate-900 dark:text-slate-100'>Noah P. • ★★★★☆</p>
            <p className='text-sm text-slate-600 dark:text-slate-300'>Item matched description, very professional.</p>
          </article>
        </div>
      </section>
    </Motion.main>
  )
}
