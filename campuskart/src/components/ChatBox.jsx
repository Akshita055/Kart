import { motion as Motion } from 'framer-motion'

export function ChatBox({ messages }) {
  return (
    <section className='flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
      <header className='border-b border-slate-200/70 p-4 dark:border-slate-700/60'>
        <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>Sarah Jenkins</h3>
        <p className='text-xs text-slate-500 dark:text-slate-400'>Verified Student</p>
      </header>

      <div className='flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-950/40'>
        {messages.map((message) => (
          <Motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
              message.from === 'me'
                ? 'ml-auto rounded-br-md bg-indigo-600 text-white'
                : 'rounded-bl-md bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <p>{message.text}</p>
            <p
              className={`mt-1 text-[10px] ${
                message.from === 'me' ? 'text-indigo-100' : 'text-slate-400'
              }`}
            >
              {message.time}
            </p>
          </Motion.div>
        ))}

        <Motion.p
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className='text-xs font-medium text-slate-400'
        >
          Sarah is typing...
        </Motion.p>
      </div>

      <footer className='border-t border-slate-200/70 p-4 dark:border-slate-700/60'>
        <div className='flex items-center gap-2 rounded-2xl bg-slate-100 p-2 dark:bg-slate-800'>
          <input
            className='flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400'
            placeholder='Type your message...'
          />
          <button className='rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white'>Send</button>
        </div>
      </footer>
    </section>
  )
}
