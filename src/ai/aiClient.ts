import type { AIBehaviorResponse, ChatMessage } from '../types/ai'

const API_URL = (import.meta.env.VITE_AI_API_URL as string | undefined) || 'http://localhost:11434/v1/chat/completions'
const API_KEY = (import.meta.env.VITE_AI_API_KEY as string | undefined) || 'ollama'
const MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) || 'qwen2.5:7b'

const fallback: AIBehaviorResponse = {
  text: '我暂时连接不上 AI，但我还在这里。你可以继续和我说话。',
  emotion: 'neutral',
  expression: 'smile',
  motion: 'nod',
  lookAt: 'user',
  actionPriority: 'medium',
}

function parseResponse(value: unknown): AIBehaviorResponse {
  const data = value as {
    text?: string
    emotion?: AIBehaviorResponse['emotion']
    expression?: AIBehaviorResponse['expression']
    motion?: AIBehaviorResponse['motion']
    lookAt?: AIBehaviorResponse['lookAt']
    actionPriority?: AIBehaviorResponse['actionPriority']
    choices?: Array<{ message?: { content?: string } }>
  }

  if (typeof data.text === 'string') {
    return {
      text: data.text,
      emotion: data.emotion ?? 'happy',
      expression: data.expression ?? 'smile',
      motion: data.motion ?? 'nod',
      lookAt: data.lookAt ?? 'user',
      actionPriority: data.actionPriority ?? 'medium',
    }
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) return fallback

  try {
    const parsed = JSON.parse(content) as Partial<AIBehaviorResponse>
    return {
      text: parsed.text || fallback.text,
      emotion: parsed.emotion || 'happy',
      expression: parsed.expression || 'smile',
      motion: parsed.motion || 'nod',
      lookAt: parsed.lookAt || 'user',
      actionPriority: parsed.actionPriority || 'medium',
    }
  } catch {
    return { ...fallback, text: content }
  }
}

export async function requestAIBehavior(messages: ChatMessage[], signal?: AbortSignal): Promise<AIBehaviorResponse> {
  const payload = {
    model: MODEL,
    temperature: 0.8,
    messages: [
      {
        role: 'system',
        content:
          '你是一个陪伴型 AI。请用中文自然回复。只返回 JSON，不要 Markdown：{"text":"回复","emotion":"neutral|happy|sad|angry|shy|tired","expression":"idle|smile|blink|surprised|wave|sleepy","motion":"idle|wave|nod|look_around|sleepy_idle","lookAt":"camera|user|mouse","actionPriority":"low|medium|high"}',
      },
      ...messages.slice(-12).map((message) => ({
        role: message.role,
        content: message.text,
      })),
    ],
    response_format: { type: 'json_object' },
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`)
  }

  return parseResponse(await response.json())
}

export { fallback as fallbackAIBehavior }
