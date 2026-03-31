import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { ChatBox } from '../components/ChatBox'
import { conversations, messages } from '../utils/data'

export function ChatPage() {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id)

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='grid min-h-[calc(100vh-9rem)] gap-6 lg:grid-cols-[340px_1fr]'>
      <aside className='overflow-hidden rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
        <div className='border-b border-slate-200/70 p-4 dark:border-slate-700/60'>
          <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Messages</h2>
        </div>
        <div className='max-h-[640px] space-y-1 overflow-y-auto p-2'>
          {conversations.length ? (
            conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  selectedId === chat.id
                    ? 'bg-indigo-50 dark:bg-indigo-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name} className='h-11 w-11 rounded-full object-cover' />
                ) : (
                  <div className='grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'>
                    {chat.initials}
                  </div>
                )}
                <div className='min-w-0'>
                  <p className='font-bold text-slate-900 dark:text-slate-100'>{chat.name}</p>
                  <p className='truncate text-xs text-slate-500 dark:text-slate-400'>{chat.preview}</p>
                </div>
              </button>
            ))
          ) : (
            <div className='p-8 text-center text-sm text-slate-500 dark:text-slate-400'>No chats yet.</div>
          )}
        </div>
      </aside>

      <ChatBox messages={messages} />
    </Motion.main>
  )
}
