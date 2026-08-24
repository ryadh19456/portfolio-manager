'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { SocialLink } from '@/lib/content-types'
import { saveSocials } from '@/app/actions/content'
import { SOCIAL_ICON_OPTIONS, SocialIcon } from '@/components/site/social-icon'
import { toast } from 'sonner'

type Row = { label: string; url: string; icon: string }

export function SocialsEditor({
  open,
  onOpenChange,
  socials,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  socials: SocialLink[]
}) {
  const [rows, setRows] = useState<Row[]>(
    socials.map((s) => ({ label: s.label, url: s.url, icon: s.icon })),
  )
  const [pending, startTransition] = useTransition()

  function update(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))
  }

  function save() {
    const cleaned = rows.filter((r) => r.label.trim() && r.url.trim())
    startTransition(async () => {
      const res = await saveSocials(cleaned)
      if (res.ok) {
        toast.success('Social links saved')
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
          <SheetTitle>Social links</SheetTitle>
          <SheetDescription>
            Shown in the hero and footer. Order matters.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <SocialIcon icon={row.icon} className="size-4" />
                  {row.label || 'New link'}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                  aria-label="Remove link"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={row.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Icon</Label>
                  <select
                    value={row.icon}
                    onChange={(e) => update(i, { icon: e.target.value })}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm capitalize"
                  >
                    {SOCIAL_ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">URL</Label>
                <Input
                  placeholder="https://…"
                  value={row.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              setRows((r) => [...r, { label: '', url: '', icon: 'link' }])
            }
          >
            <Plus className="size-4" />
            Add link
          </Button>
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
