const emotionMap: Record<string, { text: string; emotion: any; expression: any; motion: any; lookAt: any; actionPriority: any }> = {
  hello: {
    text: '你好呀，我已经在这里等你了。想让我做什么？',
    emotion: 'happy',
    expression: 'smile',
    motion: 'wave',
    lookAt: 'user',
    actionPriority: 'medium',
  },
  hi: {
    text: '嗨！很高兴看到你，我现在状态很好。',
    emotion: 'happy',
    expression: 'smile',
    motion: 'nod',
    lookAt: 'user',
    actionPriority: 'medium',
  },
  tired: {
    text: '我今天有点累，不过看见你还是会很开心。',
    emotion: 'tired',
    expression: 'sleepy',
    motion: 'sleepy_idle',
    lookAt: 'user',
    actionPriority: 'medium',
  },
  angry: {
    text: '我有点不高兴了，不过我会先冷静下来。',
    emotion: 'angry',
    expression: 'surprised',
    motion: 'look_around',
    lookAt: 'camera',
    actionPriority: 'high',
  },
  sad: {
    text: '我有点低落，来靠近我一点吧。',
    emotion: 'sad',
    expression: 'idle',
    motion: 'idle',
    lookAt: 'user',
    actionPriority: 'medium',
  },
  wave: {
    text: '好呀，我来跟你打个招呼！',
    emotion: 'happy',
    expression: 'wave',
    motion: 'wave',
    lookAt: 'user',
    actionPriority: 'high',
  },
}

export function generateMockBrainResponse(input: string) {
  const raw = input.toLowerCase().trim()

  if (!raw) {
    return {
      text: '你还没说话，我先保持待机状态。',
      emotion: 'neutral',
      expression: 'idle',
      motion: 'idle',
      lookAt: 'camera',
      actionPriority: 'low',
    }
  }

  if (raw.includes('hello') || raw.includes('hi') || raw.includes('你好')) {
    return emotionMap.hello
  }

  if (raw.includes('累') || raw.includes('困') || raw.includes('tired') || raw.includes('sleepy')) {
    return emotionMap.tired
  }

  if (raw.includes('生气') || raw.includes('angry') || raw.includes('烦')) {
    return emotionMap.angry
  }

  if (raw.includes('难过') || raw.includes('sad') || raw.includes('低落')) {
    return emotionMap.sad
  }

  if (raw.includes('挥手') || raw.includes('wave') || raw.includes('打招呼')) {
    return emotionMap.wave
  }

  return {
    text: `我听到了：${input}。如果你愿意，我也可以跟着你的意思做个动作或者换个表情。`,
    emotion: 'happy',
    expression: 'smile',
    motion: 'nod',
    lookAt: 'user',
    actionPriority: 'medium',
  }
}
