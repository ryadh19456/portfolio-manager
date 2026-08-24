'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Experience } from '@/lib/content-types'
import { saveExperience } from '@/app/actions/content'
import { toast } from 'sonner'

const EMPTY = {
  role: '',
  company: '',
  location: '',
  period: '',
  description: '',
}

export function ExperienceEditor({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  entry: Experience | null
}) {
  const [form, setForm] = useState(EMPTY)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (open) {
      setForm(
        entry
          ? {
              role: entry.role,
              company: entry.company,
              location: entry.location,
              period: entry.period,
              description: entry.description,
            }
          : EMPTY,
      )
    }
  }, [open, entry])

  function set(k: keyof typeof EMPTY, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function save() {
    startTransition(async () => {
      const res = await saveExperience({ id: entry?.id, ...form })
      if (res.ok) {
        toast.success(entry ? 'Entry updated' : 'Entry added')
        onOpenChange(false)
      } else {
        toast.error(res.error ?? 'Could not save')
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{entry ? 'Edit entry' : 'Add entry'}</SheetTitle>
          <SheetDescription>An experience or education entry.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Role / title</Label>
            <Input value={form.role} onChange={(e) => set('role', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Company</Label>
              <Input
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Period (e.g. 2023 — Present)</Label>
            <Input
              value={form.period}
              onChange={(e) => set('period', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={save} disabled={pending || !form.role.trim()}>
            {pending ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
