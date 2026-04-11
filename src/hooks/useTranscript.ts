import { useRef, useState } from 'react'

export function useTranscript() {
  const [transcript, setTranscript] = useState<string[]>([])
  const lastAdded = useRef('')

  function addPhrase(text: string) {
    if (text === '' || text === lastAdded.current) return
    lastAdded.current = text
    setTranscript((prev) => {
      const next = [...prev, text]
      return next.length > 20 ? next.slice(next.length - 20) : next
    })
  }

  function clearTranscript() {
    setTranscript([])
    lastAdded.current = ''
  }

  return { transcript, addPhrase, clearTranscript }
}
