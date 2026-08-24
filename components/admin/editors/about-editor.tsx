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
import type { AboutContent } from '@/lib/content-types'
import { saveAbout } from '@/app/actions/content'
import { toast } from 'sonner'
import { ImagePicker } from './image-picker'

export function AboutEditor({
  open,
  onOpenChange,
  about,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  about: AboutContent
}) {
  const [form, setForm] = useState({
    ...about,
    skillsText: about.skills.join(', '),
  })
  const [pending, startTransition] = useTransition()

  function save() {
    const skills = form.skillsText
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
    startTransition(async () => {
      const res = await saveAbout({
        heading: form.heading,
        body: form.body,
        skillsHeading: form.skillsHeading,
        skills,
        photoUrl: form.photoUrl ?? null,
      })
      if (res.ok) {
        toast.success('About updated')
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
          <SheetTitle>Edit about</SheetTitle>
          <SheetDescription>Your bio and skills.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <ImagePicker
            label="Profile photo"
            value={form.photoUrl ?? null}
            onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
          />

          <div className="flex flex-col gap-1.5">
            <Label>Heading</Label>
            <Input
              value={form.heading}
              onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Bio (use blank lines to separate paragraphs)</Label>
            <Textarea
              rows={8}
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Skills heading</Label>
            <Input
              value={form.skillsHeading}
              onChange={(e) =>
                setForm((f) => ({ ...f, skillsHeading: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Skills (comma or line separated)</Label>
            <Textarea
              rows={4}
              value={form.skillsText}
              onChange={(e) =>
                setForm((f) => ({ ...f, skillsText: e.target.value }))
              }
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
