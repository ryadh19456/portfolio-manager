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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import type { SiteSettings } from '@/lib/content-types'
import { saveSettings } from '@/app/actions/content'
import { toast } from 'sonner'

export function SettingsEditor({
  open,
  onOpenChange,
  settings,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  settings: SiteSettings
}) {
  const [form, setForm] = useState<SiteSettings>(settings)
  const [pending, startTransition] = useTransition()

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function save() {
    startTransition(async () => {
      const res = await saveSettings(form)
      if (res.ok) {
        toast.success('Settings saved')
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
          <SheetTitle>Site settings</SheetTitle>
          <SheetDescription>Titles, SEO, and section visibility.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Site title (browser tab & SEO)</Label>
            <Input
              value={form.siteTitle}
              onChange={(e) => set('siteTitle', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Site description (SEO)</Label>
            <Textarea
              rows={2}
              value={form.siteDescription}
              onChange={(e) => set('siteDescription', e.target.value)}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5">
            <Label>Work section heading</Label>
            <Input
              value={form.workHeading}
              onChange={(e) => set('workHeading', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Work section subheading</Label>
            <Input
              value={form.workSubheading}
              onChange={(e) => set('workSubheading', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Experience heading</Label>
            <Input
              value={form.experienceHeading}
              onChange={(e) => set('experienceHeading', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Footer text</Label>
            <Input
              value={form.footerText}
              onChange={(e) => set('footerText', e.target.value)}
            />
          </div>

          <Separator />

          <Toggle
            label="Show About section"
            checked={form.showAbout}
            onChange={(v) => set('showAbout', v)}
          />
          <Toggle
            label="Show Experience section"
            checked={form.showExperience}
            onChange={(v) => set('showExperience', v)}
          />
          <Toggle
            label="Show Contact section"
            checked={form.showContact}
            onChange={(v) => set('showContact', v)}
          />
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
