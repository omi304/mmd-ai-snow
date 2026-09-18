import { useRef, useState } from 'react'
import { CharacterController } from './character/CharacterController'
import { InteractionManager } from './character/InteractionManager'
import { requestAIBehavior, fallbackAIBehavior } from './ai/aiClient'
import { ChatPanel } from './components/ChatPanel'
import { Canvas } from './components/Canvas'
import { TopMenu } from './components/TopMenu'
import type { AIBehaviorResponse, CharacterState, ChatMessage } from './types/ai'
import './App.css'

const initialMessages: ChatMessage[] = [{ id: 'welcome', role: 'assistant', text: '你好，我已经准备好了。你可以和我聊天，也可以移动鼠标或点击场景和我互动。', timestamp: 'now' }]

export default function App() {
  const controllerRef = useRef(new CharacterController())
  const interactionManagerRef = useRef(new InteractionManager())
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [characterState, setCharacterState] = useState<CharacterState>(controllerRef.current.getState())
  const [isThinking, setIsThinking] = useState(false)

  const syncState = () => setCharacterState(controllerRef.current.getState())
  const applyBehavior = (behavior: AIBehaviorResponse) => {
    controllerRef.current.applyBehavior(behavior)
    controllerRef.current.setTalking(Boolean(behavior.text))
    syncState()
    window.setTimeout(() => {
      controllerRef.current.setTalking(false)
      syncState()
    }, 1400)
  }

  const handleSend = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isThinking) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsThinking(true)

    try {
      const behavior = await requestAIBehavior(nextMessages)
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: behavior.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      applyBehavior(behavior)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: fallbackAIBehavior.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      applyBehavior(fallbackAIBehavior)
    } finally {
      setIsThinking(false)
    }
  }

  const handlePointerMove = () => {
    controllerRef.current.applyBehavior(interactionManagerRef.current.handlePointerMove())
    syncState()
  }

  const handleClick = (target: 'head' | 'body' | 'hand' | 'anywhere') => {
    controllerRef.current.applyBehavior(interactionManagerRef.current.handleClick(target))
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
          <div className="panel-header">AI Companion</div>
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
              <strong>{isThinking ? 'Thinking' : characterState.status}</strong>
            </div>
          </div>

          <ChatPanel
            messages={messages}
            onSend={handleSend}
            characterState={characterState}
            isThinking={isThinking}
          />
        </aside>
      </div>

      <div className="bottom-bar">
        <span>{isThinking ? 'AI thinking...' : 'AI core ready'}</span>
        <span>Mouse interaction ready</span>
        <span>MMD scene active</span>
      </div>
    </div>
  )
}
