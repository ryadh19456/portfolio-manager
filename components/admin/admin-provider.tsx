'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { lockAdmin } from '@/app/actions/auth'
import { UnlockDialog } from './unlock-dialog'

type AdminContextValue = {
  isAdmin: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
  openUnlock: () => void
  onUnlocked: () => void
  onLocked: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

/* Controls global editMode. When true, Editable and ProjectEditor appear. */
export function AdminProvider({
  initialIsAdmin,
  children,
}: {
  initialIsAdmin: boolean
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  const [editMode, setEditMode] = useState(false)
  const [unlockOpen, setUnlockOpen] = useState(false)

  const openUnlock = useCallback(() => setUnlockOpen(true), [])

  const onUnlocked = useCallback(() => {
    setIsAdmin(true)
    setEditMode(true)
    setUnlockOpen(false)
  }, [])

  const onLocked = useCallback(() => {
    setIsAdmin(false)
    setEditMode(false)
    setUnlockOpen(false)
  }, [])

  useEffect(() => {
    let typed = ''
    let resetTimer: number | undefined

    function resetSequence() {
      typed = ''
      if (resetTimer) window.clearTimeout(resetTimer)
    }

    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const isEditable =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (isEditable) {
        resetSequence()
        return
      }

      const combo =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'A' || e.key === 'a')

      if (combo) {
        e.preventDefault()
        if (isAdmin) {
          setEditMode((v) => !v)
        } else {
          setUnlockOpen(true)
        }
        resetSequence()
        return
      }

      const key = e.key
      if (key.length !== 1) {
        if (key === 'Enter' || key === 'Escape') resetSequence()
        return
      }

      const next = `${typed}${key.toLowerCase()}`
      if (next.includes('admin')) {
        e.preventDefault()
        if (isAdmin) {
          void lockAdmin()
          onLocked()
        } else {
          setUnlockOpen(true)
        }
        resetSequence()
        return
      }

      typed = next.slice(-8)
      if (resetTimer) window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(resetSequence, 1200)
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [isAdmin, onLocked])

  const value = useMemo(
    () => ({
      isAdmin,
      editMode,
      setEditMode,
      openUnlock,
      onUnlocked,
      onLocked,
    }),
    [isAdmin, editMode, openUnlock, onUnlocked, onLocked],
  )

  return (
    <AdminContext.Provider value={value}>
      {children}
      <UnlockDialog
        open={unlockOpen}
        onOpenChange={setUnlockOpen}
        onUnlocked={onUnlocked}
      />
    </AdminContext.Provider>
  )
}
