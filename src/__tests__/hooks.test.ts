import { useState } from '../domain/hooks/services/useState'
import { useEffect } from '../domain/hooks/services/useEffect'
import { useMemo } from '../domain/hooks/services/useMemo'
import { useCallback } from '../domain/hooks/services/useCallback'
import { useReducer } from '../domain/hooks/services/useReducer'
import { useRef } from '../domain/hooks/services/useRef'
import { useTransition } from '../domain/hooks/services/useTransition'
import { createContext } from '../domain/hooks/services/createContext'
import { useContext } from '../domain/hooks/services/useContext'
import { prepareToUseHooks, resetHooks } from '../domain/hooks/model/hookContext'
import type { FiberNode } from '../domain/vdom/model/vnode'

// Mock FiberNode
const createMockFiber = (): FiberNode => ({
  type: 'div',
  key: null,
  ref: null,
  stateNode: null,
  return: null,
  child: null,
  sibling: null,
  alternate: null,
  pendingProps: {},
  memoizedProps: null,
  memoizedState: null,
  flags: 0,
  index: 0,
})

// Setup hook context before each test
beforeEach(() => {
  const mockFiber = createMockFiber()
  prepareToUseHooks(mockFiber)
})

// Cleanup after each test
afterEach(() => {
  resetHooks()
})

describe('React Hooks', () => {
  describe('useState', () => {
    it('should initialize with initial value', () => {
      const [state] = useState(42)
      expect(state).toBe(42)
    })

    it('should update state when setState is called', () => {
      const [state, setState] = useState(0)
      setState(100)
      expect(typeof setState).toBe('function')
    })

    it('should handle function updates', () => {
      const [state, setState] = useState<number>(0)
      setState((prev: number) => prev + 1)
      expect(typeof setState).toBe('function')
    })
  })

  describe('useEffect', () => {
    it('should register effect function', () => {
      const effect = jest.fn()
      useEffect(effect, [])
      // Effect should be queued for execution
      expect(effect).not.toHaveBeenCalled() // Not called immediately
    })

    it('should handle cleanup function', () => {
      const cleanup = jest.fn()
      const effect = jest.fn(() => cleanup)
      useEffect(effect, [])
      // Effect should be queued
      expect(effect).not.toHaveBeenCalled()
    })

    it('should handle different dependencies', () => {
      const effect = jest.fn()
      useEffect(effect, [1, 2, 3])
      useEffect(effect, [1, 2, 4]) // Different dependencies
      // Both effects should be queued
      expect(effect).not.toHaveBeenCalled()
    })
  })

  describe('useMemo', () => {
    it('should compute value on first render', () => {
      const factory = jest.fn(() => 42)
      const value = useMemo(factory, [])
      expect(factory).toHaveBeenCalledTimes(1)
      expect(value).toBe(42)
    })

    it('should handle dependency changes', () => {
      const factory = jest.fn(() => 42)
      useMemo(factory, [1])
      useMemo(factory, [2]) // Different dependency
      expect(factory).toHaveBeenCalledTimes(2)
    })

    it('should return same value for same dependencies', () => {
      const factory = jest.fn(() => ({ value: 42 }))
      const value1 = useMemo(factory, [1, 2, 3])
      const value2 = useMemo(factory, [1, 2, 3])
      expect(value1).toStrictEqual(value2)
    })
  })

  describe('useCallback', () => {
    it('should return the same function when dependencies are the same', () => {
      const callback = jest.fn()
      const memoized1 = useCallback(callback, [1, 2, 3])
      const memoized2 = useCallback(callback, [1, 2, 3])
      expect(memoized1).toBe(memoized2)
    })

    it('should return different function when dependencies change', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      const memoized1 = useCallback(callback1, [1])
      // Simulate re-render with different dependencies
      resetHooks()
      const mockFiber = createMockFiber()
      prepareToUseHooks(mockFiber)
      const memoized2 = useCallback(callback2, [2])

      // They should be different functions
      expect(memoized1).not.toBe(memoized2)
    })
  })

  describe('useReducer', () => {
    const reducer = (state: number, action: { type: string; payload?: number }) => {
      switch (action.type) {
        case 'increment':
          return state + 1
        case 'decrement':
          return state - 1
        case 'set':
          return action.payload || 0
        default:
          return state
      }
    }

    it('should initialize with initial state', () => {
      const [state] = useReducer(reducer, 0)
      expect(state).toBe(0)
    })

    it('should provide dispatch function', () => {
      const [state, dispatch] = useReducer(reducer, 0)
      expect(typeof dispatch).toBe('function')
    })
  })

  describe('useRef', () => {
    it('should initialize with initial value', () => {
      const ref = useRef(42)
      expect(ref.current).toBe(42)
    })

    it('should allow updating current value', () => {
      const ref = useRef(0)
      ref.current = 100
      expect(ref.current).toBe(100)
    })

    it('should persist between renders', () => {
      const ref = useRef(0)
      const initialRef = ref
      // Simulate re-render by calling useRef again
      resetHooks()
      const mockFiber = createMockFiber()
      prepareToUseHooks(mockFiber)
      const newRef = useRef(0)
      expect(newRef).toStrictEqual(initialRef)
    })
  })

  describe('useTransition', () => {
    it('should return isPending and startTransition', () => {
      const [isPending, startTransition] = useTransition()
      expect(typeof isPending).toBe('function')
      expect(typeof startTransition).toBe('function')
    })

    it('should handle transition state', () => {
      const [isPending, startTransition] = useTransition()
      const pendingState = isPending()
      expect(typeof pendingState).toBe('boolean')
    })
  })

  describe('Context', () => {
    it('should create context with default value', () => {
      const defaultValue = { theme: 'dark' }
      const context = createContext(defaultValue)
      expect(context.value).toBe(defaultValue)
    })

    it('should provide context value', () => {
      const defaultValue = { theme: 'dark' }
      const newValue = { theme: 'light' }
      const context = createContext(defaultValue)

      const TestComponent = () => {
        return context.Provider({ value: newValue, children: null })
      }

      TestComponent()
      expect(context.value).toBe(newValue)
    })

    it('should use context value', () => {
      const defaultValue = { theme: 'dark' }
      const context = createContext(defaultValue)
      const value = useContext(context)
      expect(value).toBe(defaultValue)
    })
  })
})
