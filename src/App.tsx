import { useState } from 'react'
import { generateMockBrainResponse } from './ai/mockCharacterAI'
import { ChatPanel } from './components/ChatPanel'
import { Canvas } from './components/Canvas'
import { TopMenu } from './components/TopMenu'
import type { AIBehaviorResponse, CharacterState, ChatMessage } from './types/ai'
import './App.css'

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: '你好，我已经准备好了。你可以点我、说话，或者直接试着给我一个动作要求。',
    timestamp: 'now',
  },
]

const initialCharacterState: CharacterState = {
  emotion: 'happy',
  expression: 'idle',
  motion: 'idle',
  lookAt: 'camera',
  isTalking: false,
  status: 'Ready',
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [characterState, setCharacterState] = useState<CharacterState>(initialCharacterState)

  const handleSend = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])

    const response: AIBehaviorResponse = generateMockBrainResponse(trimmed)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, assistantMessage])

    setCharacterState((prev) => ({
      ...prev,
      emotion: response.emotion ?? prev.emotion,
      expression: response.expression ?? prev.expression,
      motion: response.motion ?? prev.motion,
      lookAt: response.lookAt ?? prev.lookAt,
      isTalking: !!response.text,
      status: response.actionPriority === 'high' ? 'Acting' : 'Listening',
    }))
  }

  return (
    <div className="app-container">
      <TopMenu />

      <div className="main-layout">
        <aside className="panel left-panel">
          <div className="panel-header">Library</div>
          <div className="panel-body">
            <div className="library-item active">Character</div>
            <div className="library-item">Models</div>
            <div className="library-item">Motions</div>
            <div className="library-item">Expressions</div>
          </div>
        </aside>

        <div className="viewport-container">
          <Canvas />
          <div className="character-badge">
            <span className="indicator" />
            {characterState.emotion}
          </div>
        </div>

        <aside className="panel right-panel">
          <div className="panel-header">Character</div>
          <div className="panel-body compact">
            <div className="stat-row">
              <span>Emotion</span>
              <strong>{characterState.emotion}</strong>
            </div>
            <div className="stat-row">
              <span>Motion</span>
              <strong>{characterState.motion}</strong>
            </div>
            <div className="stat-row">
              <span>Look at</span>
              <strong>{characterState.lookAt}</strong>
            </div>
            <div className="stat-row">
              <span>Status</span>
              <strong>{characterState.status}</strong>
            </div>
          </div>

          <ChatPanel messages={messages} onSend={handleSend} characterState={characterState} />
        </aside>
      </div>

      <div className="bottom-bar">
        <span>AI core enabled</span>
        <span>Mouse interaction ready</span>
        <span>MMD scene active</span>
      </div>
    </div>
  )
}
