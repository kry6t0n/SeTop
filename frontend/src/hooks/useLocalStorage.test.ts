import { renderHook, act } from '@testing-library/react'

import { useLocalStorage } from './useLocalStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    expect(result.current.value).toBe('initial')
  })

  test('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    expect(result.current.value).toBe('stored-value')
  })

  test('updates value and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current.setValue('new-value')
    })

    expect(result.current.value).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  test('handles function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current.setValue((prev) => prev + 1)
    })

    expect(result.current.value).toBe(1)

    act(() => {
      result.current.setValue((prev) => prev + 1)
    })

    expect(result.current.value).toBe(2)
  })

  test('removes value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current.setValue('stored')
    })

    expect(result.current.value).toBe('stored')

    act(() => {
      result.current.removeValue()
    })

    expect(result.current.value).toBe('initial')
    expect(localStorage.getItem('test-key')).toBeNull()
  })

  test('handles complex objects', () => {
    const initialValue = { name: 'test', count: 0 }
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))

    act(() => {
      result.current.setValue({ name: 'updated', count: 1 })
    })

    expect(result.current.value).toEqual({ name: 'updated', count: 1 })
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify({ name: 'updated', count: 1 }))
  })

  test('handles arrays', () => {
    const initialValue: number[] = []
    const { result } = renderHook(() => useLocalStorage('test-key', initialValue))

    act(() => {
      result.current.setValue([1, 2, 3])
    })

    expect(result.current.value).toEqual([1, 2, 3])
  })

  test('handles invalid JSON gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json')

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))

    expect(result.current.value).toBe('fallback')
  })

  test('handles localStorage errors gracefully', () => {
    const originalSetItem = localStorage.setItem

    localStorage.setItem = () => {
      throw new Error('Storage quota exceeded')
    }

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current.setValue('new-value')
    })

    expect(result.current.value).toBe('new-value')

    localStorage.setItem = originalSetItem
  })
})
