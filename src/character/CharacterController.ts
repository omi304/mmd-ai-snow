import type { CharacterState, Emotion, Expression, LookAt, Motion, Priority } from '../types/ai'

export type CharacterBehavior = {
  emotion?: Emotion
  expression?: Expression
  motion?: Motion
  lookAt?: LookAt
  actionPriority?: Priority
}

export class CharacterController {
  private state: CharacterState = {
    emotion: 'happy',
    expression: 'idle',
    motion: 'idle',
    lookAt: 'camera',
    isTalking: false,
    status: 'Ready',
  }

  getState(): CharacterState {
    return { ...this.state }
  }

  applyBehavior(behavior: CharacterBehavior) {
    const priority = behavior.actionPriority ?? 'low'

    if (priority === 'high') {
      this.state = {
        ...this.state,
        emotion: behavior.emotion ?? this.state.emotion,
        expression: behavior.expression ?? this.state.expression,
        motion: behavior.motion ?? this.state.motion,
        lookAt: behavior.lookAt ?? this.state.lookAt,
        status: 'Acting',
      }
      return
    }

    this.state = {
      ...this.state,
      emotion: behavior.emotion ?? this.state.emotion,
      expression: behavior.expression ?? this.state.expression,
      motion: behavior.motion ?? this.state.motion,
      lookAt: behavior.lookAt ?? this.state.lookAt,
      status: priority === 'medium' ? 'Listening' : 'Ready',
    }
  }

  setTalking(isTalking: boolean) {
    this.state = {
      ...this.state,
      isTalking,
      status: isTalking ? 'Speaking' : this.state.status,
    }
  }
}
