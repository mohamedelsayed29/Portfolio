import { useCallback, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item === null ? initialValue : JSON.parse(item)
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      setStored((previous) => {
        const next = typeof value === 'function' ? value(previous) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // Private mode or a full quota — the in-memory value still stands.
        }
        return next
      })
    },
    [key],
  )

  return [stored, setValue]
}
