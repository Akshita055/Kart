export function SkeletonCard() {
  return (
    <div className='animate-pulse overflow-hidden rounded-3xl border border-white/40 bg-white/80 dark:border-slate-700/40 dark:bg-slate-900/70'>
      <div className='aspect-[4/5] bg-slate-200 dark:bg-slate-800' />
      <div className='space-y-3 p-5'>
        <div className='h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800' />
        <div className='h-3 w-full rounded bg-slate-200 dark:bg-slate-800' />
        <div className='h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800' />
      </div>
    </div>
  )
}
