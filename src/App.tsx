import { useRef, useState } from 'react'
import { CharacterController } from './character/CharacterController'
import { InteractionManager } from './character/InteractionManager'
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

export default function App() {
  const controllerRef = useRef(new CharacterController())
  const interactionManagerRef = useRef(new InteractionManager())

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [characterState, setCharacterState] = useState<CharacterState>(controllerRef.current.getState())

  const syncState = () => {
    setCharacterState(controllerRef.current.getState())
  }

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
    controllerRef.current.applyBehavior(response)
    controllerRef.current.setTalking(true)
    syncState()

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, assistantMessage])

    setTimeout(() => {
      controllerRef.current.setTalking(false)
      syncState()
    }, 1200)
  }

  const handlePointerMove = () => {
    const behavior = interactionManagerRef.current.handlePointerMove()
    controllerRef.current.applyBehavior(behavior)
    syncState()
  }

  const handleClick = (target: 'head' | 'body' | 'hand' | 'anywhere') => {
    const behavior = interactionManagerRef.current.handleClick(target)
    controllerRef.current.applyBehavior(behavior)
    syncState()
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

        <div className="viewport-container" onMouseMove={handlePointerMove}>
          <Canvas characterState={characterState} />
          <div className="character-badge">
            <span className="indicator" />
            {characterState.emotion}
          </div>
          <div className="interaction-row">
            <button className="interaction-btn" onClick={() => handleClick('head')}>点头</button>
            <button className="interaction-btn" onClick={() => handleClick('hand')}>挥手</button>
            <button className="interaction-btn" onClick={() => handleClick('body')}>看看</button>
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
