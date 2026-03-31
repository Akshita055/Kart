export function FilterSidebar({ selectedCategory, setSelectedCategory, maxPrice, setMaxPrice }) {
  const options = [
    { id: 'all', label: 'All Categories' },
    { id: 'books', label: 'Textbooks' },
    { id: 'electronics', label: 'Tech Accessories' },
    { id: 'furniture', label: 'Dorm Decor' },
    { id: 'notes', label: 'Notes' },
  ]

  return (
    <aside className='sticky top-24 hidden h-fit space-y-6 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl lg:block dark:border-slate-700/40 dark:bg-slate-900/70'>
      <div className='space-y-2'>
        <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>Categories</h3>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedCategory(option.id)}
            className={`block w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
              selectedCategory === option.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className='space-y-3'>
        <h3 className='text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>Max Price</h3>
        <input
          type='range'
          min={20}
          max={700}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className='w-full accent-indigo-600'
        />
        <p className='text-sm font-semibold text-slate-700 dark:text-slate-300'>Under ${maxPrice}</p>
      </div>
    </aside>
  )
}
