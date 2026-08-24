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
import type { HeroContent } from '@/lib/content-types'
import { saveHero } from '@/app/actions/content'
import { toast } from 'sonner'
import { ImagePicker } from './image-picker'

export function HeroEditor({
  open,
  onOpenChange,
  hero,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  hero: HeroContent
}) {
  const [form, setForm] = useState<HeroContent>(hero)
  const [pending, startTransition] = useTransition()

  function set<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    startTransition(async () => {
      const res = await saveHero(form)
      if (res.ok) {
        toast.success('Intro updated')
        onOpenChange(false)
      } else {
        toast.error(res.error ?? 'Could not save')
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit intro</SheetTitle>
          <SheetDescription>
            The hero section at the top of your site.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <ImagePicker
            label="Profile image"
            value={form.avatarUrl}
            onChange={(url) => set('avatarUrl', url)}
          />

          <Field label="Availability badge">
            <Input
              value={form.availability}
              onChange={(e) => set('availability', e.target.value)}
            />
          </Field>
          <Field label="Headline">
            <Textarea
              rows={2}
              value={form.headline}
              onChange={(e) => set('headline', e.target.value)}
            />
          </Field>
          <Field label="Intro paragraph">
            <Textarea
              rows={4}
              value={form.intro}
              onChange={(e) => set('intro', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field label="Role">
              <Input value={form.role} onChange={(e) => set('role', e.target.value)} />
            </Field>
          </div>
          <Field label="Location">
            <Input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary button label">
              <Input
                value={form.ctaLabel}
                onChange={(e) => set('ctaLabel', e.target.value)}
              />
            </Field>
            <Field label="Primary button link">
              <Input
                value={form.ctaHref}
                onChange={(e) => set('ctaHref', e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Secondary button label">
              <Input
                value={form.secondaryCtaLabel}
                onChange={(e) => set('secondaryCtaLabel', e.target.value)}
              />
            </Field>
            <Field label="Secondary button link">
              <Input
                value={form.secondaryCtaHref}
                onChange={(e) => set('secondaryCtaHref', e.target.value)}
              />
            </Field>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
