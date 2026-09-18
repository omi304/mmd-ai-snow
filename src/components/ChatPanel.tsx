import { useState } from 'react'
import type { CharacterProfile, CharacterState, ChatMessage } from '../types/ai'
import { DEFAULT_CHARACTER_PROFILE } from '../types/ai'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  characterState: CharacterState
  profile: CharacterProfile
}

export function ChatPanel({ messages, onSend, characterState, profile }: ChatPanelProps) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="title">{profile.name}</span>
        <span className="chat-status">{characterState.status}</span>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div>{message.text}</div>
            <div className="message-meta">{message.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-wrap">
        <textarea
          className="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`和 ${profile.name} 聊天...`}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSubmit()
            }
          }}
        />
        <button className="send-btn" onClick={handleSubmit}>Send</button>
      </div>
    </div>
  )
}
