import { Button } from './Button'

export function UserCard({ profile }) {
  return (
    <article className='relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/80 p-6 shadow-lg backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
      <div className='absolute inset-x-0 top-0 h-32 overflow-hidden'>
        <img src={profile.cover} alt='Profile cover' className='h-full w-full object-cover opacity-80' />
        <div className='absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-900/90' />
      </div>

      <div className='relative mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex items-end gap-4'>
          <img
            src={profile.avatar}
            alt={profile.name}
            className='h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl dark:border-slate-900'
          />
          <div>
            <h2 className='text-2xl font-extrabold text-slate-900 dark:text-slate-100'>{profile.name}</h2>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{profile.college}</p>
            <p className='text-xs text-slate-500 dark:text-slate-500'>{profile.email}</p>
          </div>
        </div>
        <Button variant='secondary'>Edit Profile</Button>
      </div>
    </article>
  )
}
