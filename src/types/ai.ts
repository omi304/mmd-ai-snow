export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'shy' | 'tired'
export type Expression = 'idle' | 'smile' | 'blink' | 'surprised' | 'wave' | 'sleepy'
export type Motion = 'idle' | 'wave' | 'nod' | 'look_around' | 'sleepy_idle'
export type LookAt = 'camera' | 'user' | 'mouse'
export type Priority = 'low' | 'medium' | 'high'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

export interface CharacterState {
  emotion: Emotion
  expression: Expression
  motion: Motion
  lookAt: LookAt
  isTalking: boolean
  status: string
}

export interface AIBehaviorResponse {
  text: string
  emotion?: Emotion
  expression?: Expression
  motion?: Motion
  lookAt?: LookAt
  actionPriority?: Priority
}
