'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import type { Project } from '@/lib/content-types'
import { deleteProject, saveProject } from '@/app/actions/content'
import { ImagePicker } from './image-picker'
import { toast } from 'sonner'

type FormState = {
  title: string
  slug: string
  tagline: string
  description: string
  content: string
  techText: string
  imageUrl: string | null
  liveUrl: string
  repoUrl: string
  year: string
  role: string
  featured: boolean
  published: boolean
}

const EMPTY: FormState = {
  title: '',
  slug: '',
  tagline: '',
  description: '',
  content: '',
  techText: '',
  imageUrl: null,
  liveUrl: '',
  repoUrl: '',
  year: '',
  role: '',
  featured: false,
  published: true,
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ProjectEditor({
  open,
  onOpenChange,
  project,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  project: Project | null
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [pending, startTransition] = useTransition()
  const [deleting, startDelete] = useTransition()

  useEffect(() => {
    if (open) {
      setSlugTouched(!!project)
      setForm(
        project
          ? {
              title: project.title,
              slug: project.slug,
              tagline: project.tagline,
              description: project.description,
              content: project.content,
              techText: project.tech.join(', '),
              imageUrl: project.imageUrl,
              liveUrl: project.liveUrl ?? '',
              repoUrl: project.repoUrl ?? '',
              year: project.year,
              role: project.role,
              featured: project.featured,
              published: project.published,
            }
          : EMPTY,
      )
    }
  }, [open, project])

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function onTitle(v: string) {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugTouched ? f.slug : slugify(v),
    }))
  }

  function save() {
    const tech = form.techText
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
    startTransition(async () => {
      const res = await saveProject({
        id: project?.id,
        title: form.title,
        slug: form.slug || slugify(form.title),
        tagline: form.tagline,
        description: form.description,
        content: form.content,
        tech,
        imageUrl: form.imageUrl,
        liveUrl: form.liveUrl || null,
        repoUrl: form.repoUrl || null,
        year: form.year,
        role: form.role,
        featured: form.featured,
        published: form.published,
      })
      if (res.ok) {
        toast.success(project ? 'Project updated' : 'Project added')
        onOpenChange(false)
      } else {
        toast.error(res.error ?? 'Could not save')
      }
    })
  }

  function remove() {
    if (!project) return
    startDelete(async () => {
      const res = await deleteProject(project.id)
      if (res.ok) {
        toast.success('Project deleted')
        onOpenChange(false)
        router.push('/')
      } else {
        toast.error(res.error ?? 'Could not delete')
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{project ? 'Edit project' : 'Add project'}</SheetTitle>
          <SheetDescription>
            {project
              ? 'Update the details for this project.'
              : 'Fill in the details for your new project.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => onTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', slugify(e.target.value))
              }}
            />
            <p className="text-xs text-muted-foreground">/projects/{form.slug || '…'}</p>
          </div>

          <ImagePicker
            label="Cover image"
            value={form.imageUrl}
            onChange={(url) => set('imageUrl', url)}
          />

          <div className="flex flex-col gap-1.5">
            <Label>Tagline (shown on card)</Label>
            <Input
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Short description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Full write-up (project page)</Label>
            <Textarea
              rows={6}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tech / tags (comma separated)</Label>
            <Input
              value={form.techText}
              onChange={(e) => set('techText', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Year</Label>
              <Input value={form.year} onChange={(e) => set('year', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => set('role', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Live URL</Label>
              <Input
                placeholder="https://…"
                value={form.liveUrl}
                onChange={(e) => set('liveUrl', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Repository URL</Label>
              <Input
                placeholder="https://github.com/…"
                value={form.repoUrl}
                onChange={(e) => set('repoUrl', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Featured</Label>
              <p className="text-xs text-muted-foreground">
                Highlight this project on the grid.
              </p>
            </div>
            <Switch
              checked={form.featured}
              onCheckedChange={(v) => set('featured', v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Published</Label>
              <p className="text-xs text-muted-foreground">
                Off = draft, hidden from visitors.
              </p>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(v) => set('published', v)}
            />
          </div>

          {project ? (
            <>
              <Separator />
              <Button
                variant="ghost"
                className="justify-start text-destructive hover:text-destructive"
                onClick={remove}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete this project'}
              </Button>
            </>
          ) : null}
        </div>

        <SheetFooter>
          <Button onClick={save} disabled={pending || !form.title.trim()}>
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
