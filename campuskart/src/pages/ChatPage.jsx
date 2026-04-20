import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import { chatApi } from '../lib/api'
import { getSocket } from '../lib/socket'

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatPage() {
  const location = useLocation()
  const { user, addToast, loadNotifications } = useAppContext()
  const [rooms, setRooms] = useState([])
  const [selectedId, setSelectedId] = useState(location.state?.roomId || '')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const { data } = await chatApi.rooms()
        setRooms(data)
        if (!selectedId && data[0]?._id) {
          setSelectedId(data[0]._id)
        }
      } catch {
        addToast('Failed to load conversations', 'error')
      }
    }
    loadRooms()
  }, [addToast, selectedId])

  useEffect(() => {
    if (!selectedId) return
    const loadMessages = async () => {
      try {
        const { data } = await chatApi.messages(selectedId)
        setMessages(data)
      } catch {
        addToast('Failed to load messages', 'error')
      }
    }
    loadMessages()
  }, [addToast, selectedId])

  useEffect(() => {
    if (!selectedId || !user?.id) return
    const socket = getSocket()
    socket.emit('chat:join', { roomId: selectedId })

    const onMessage = (message) => {
      if (message.room !== selectedId) return
      setMessages((prev) => [...prev, message])
      loadNotifications()
    }
    const onTyping = ({ roomId, userId }) => {
      if (roomId === selectedId && userId !== user.id) {
        setTyping(true)
        setTimeout(() => setTyping(false), 1400)
      }
    }

    socket.on('chat:message', onMessage)
    socket.on('chat:typing', onTyping)
    return () => {
      socket.off('chat:message', onMessage)
      socket.off('chat:typing', onTyping)
    }
  }, [loadNotifications, selectedId, user?.id])

  const activeRoom = useMemo(() => rooms.find((room) => room._id === selectedId), [rooms, selectedId])

  const send = async () => {
    if (!input.trim() || !selectedId) return
    try {
      await chatApi.sendMessage(selectedId, input.trim())
      setInput('')
    } catch {
      addToast('Failed to send message', 'error')
    }
  }

  return (
    <Motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className='grid min-h-[calc(100vh-9rem)] gap-6 lg:grid-cols-[340px_1fr]'>
      <aside className='overflow-hidden rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
        <div className='border-b border-slate-200/70 p-4 dark:border-slate-700/60'>
          <h2 className='text-2xl font-black text-slate-900 dark:text-slate-100'>Messages</h2>
        </div>
        <div className='max-h-160 space-y-1 overflow-y-auto p-2'>
          {rooms.length ? (
            rooms.map((chat) => {
              const counterpart = chat.buyer?._id === user?.id ? chat.seller : chat.buyer
              return (
                <button
                  key={chat._id}
                  onClick={() => setSelectedId(chat._id)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    selectedId === chat._id
                      ? 'bg-indigo-50 dark:bg-indigo-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className='grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'>
                    {counterpart?.name?.slice(0, 2)?.toUpperCase() || 'CK'}
                  </div>
                  <div className='min-w-0'>
                    <p className='font-bold text-slate-900 dark:text-slate-100'>{counterpart?.name || 'Student'}</p>
                    <p className='truncate text-xs text-slate-500 dark:text-slate-400'>
                      {chat.lastMessage?.text || 'Start conversation'}
                    </p>
                  </div>
                </button>
              )
            })
          ) : (
            <p className='p-4 text-sm text-slate-500 dark:text-slate-400'>No conversations yet.</p>
          )}
        </div>
      </aside>

      <section className='flex min-h-130 flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70'>
        <header className='border-b border-slate-200/70 p-4 dark:border-slate-700/60'>
          <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
            {activeRoom ? activeRoom.product?.title || 'Conversation' : 'Select a conversation'}
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400'>Realtime buyer-seller chat</p>
        </header>

        <div className='flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-950/40'>
          {messages.map((message) => (
            <Motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                message.sender?._id === user?.id
                  ? 'ml-auto rounded-br-md bg-indigo-600 text-white'
                  : 'rounded-bl-md bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <p>{message.text}</p>
              <p className={`mt-1 text-[10px] ${message.sender?._id === user?.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                {formatTime(message.createdAt)}
              </p>
            </Motion.div>
          ))}

          {typing ? (
            <Motion.p
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className='text-xs font-medium text-slate-400'
            >
              Typing...
            </Motion.p>
          ) : null}
        </div>

        <footer className='border-t border-slate-200/70 p-4 dark:border-slate-700/60'>
          <div className='flex items-center gap-2 rounded-2xl bg-slate-100 p-2 dark:bg-slate-800'>
            <input
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                if (selectedId && user?.id) {
                  getSocket().emit('chat:typing', { roomId: selectedId, userId: user.id })
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  send()
                }
              }}
              className='flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400'
              placeholder='Type your message...'
            />
            <button onClick={send} className='rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white'>
              Send
            </button>
          </div>
        </footer>
      </section>
    </Motion.main>
  )
}
