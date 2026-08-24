'use client'

import { useState, useTransition } from 'react'
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
import type { ContactContent } from '@/lib/content-types'
import { saveContact } from '@/app/actions/content'
import { toast } from 'sonner'

export function ContactEditor({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  contact: ContactContent
}) {
  const [form, setForm] = useState<ContactContent>(contact)
  const [pending, startTransition] = useTransition()

  function set<K extends keyof ContactContent>(k: K, v: ContactContent[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function save() {
    startTransition(async () => {
      const res = await saveContact(form)
      if (res.ok) {
        toast.success('Contact updated')
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
          <SheetTitle>Edit contact</SheetTitle>
          <SheetDescription>The closing call-to-action and footer.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Heading</Label>
            <Textarea
              rows={2}
              value={form.heading}
              onChange={(e) => set('heading', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Body</Label>
            <Textarea
              rows={3}
              value={form.body}
              onChange={(e) => set('body', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email address</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Button label</Label>
            <Input
              value={form.buttonLabel}
              onChange={(e) => set('buttonLabel', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Footer note (after the © year)</Label>
            <Input
              value={form.footerNote}
              onChange={(e) => set('footerNote', e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={save} disabled={pending}>
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
