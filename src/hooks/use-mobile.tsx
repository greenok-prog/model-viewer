"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => {
      setMatches(media.matches)
    }

    // Добавляем слушатель для изменения размера экрана
    media.addEventListener("change", listener)

    // Очистка слушателя при размонтировании
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [matches, query])

  return matches
}

