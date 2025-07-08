"use client"

import { useState, useCallback } from "react"

export interface Notification {
  id: number
  message: string
  timestamp: number
  type?: string
  taskName?: string
  robot?: string
  room?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((message: string, type?: string, extra?: any) => {
    const notification: Notification = {
      id: Date.now() + Math.random(),
      message,
      timestamp: Date.now(),
      type,
      ...extra,
    }
    setNotifications((prev) => [...prev, notification])
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    clearNotifications,
  }
}
