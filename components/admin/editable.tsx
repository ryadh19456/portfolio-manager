'use client'

import { Pencil } from 'lucide-react'
import { useAdmin } from './admin-provider'
import { cn } from '@/lib/utils'

/**
 * Wraps a region of the public site. When admin edit mode is on it shows a
 * dashed accent outline and an Edit affordance; clicking calls `onEdit`.
 * When not in edit mode it renders children untouched.
 */
export function Editable({
  label,
  onEdit,
  children,
  className,
}: {
  label: string
  onEdit: () => void
  children: React.ReactNode
  className?: string
}) {
  const { editMode } = useAdmin()

  if (!editMode) return <>{children}</>

  return (
    <div className={cn('editable-ring group/edit relative', className)}>
      {children}
      <button
        type="button"
        onClick={onEdit}
        className="absolute -top-3 right-2 z-20 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground opacity-0 shadow-sm transition-opacity group-hover/edit:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="size-3" />
        Edit {label}
      </button>
    </div>
  )
}
