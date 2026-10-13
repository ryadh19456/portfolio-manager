'use client'

import { useState, useTransition } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/content-types'
import { saveProject } from '@/app/actions/content'
import { useAdmin } from './admin-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ProjectDetailEdit({ project }: { project: Project }) {
  const { editMode } = useAdmin()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const [text, setText] = useState(() => ({
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    content: project.content,
  }))

  const isEditing = editMode && editing

  function cancel() {
    setText({
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      content: project.content,
    })
    setEditing(false)
  }

  function save() {
    startTransition(async () => {
      try {
        const result = await saveProject({
          id: project.id,
          title: text.title,
          slug: project.slug,
          tagline: text.tagline,
          description: text.description,
          content: text.content,
          tech: project.tech,
          imageUrl: project.imageUrl,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          year: project.year,
          role: project.role,
          featured: project.featured,
          published: project.published,
        })
        if (!result.ok) {
          toast.error(result.error ?? 'Could not save project')
          return
        }
        toast.success('Project text saved')
        setEditing(false)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Could not save project')
      }
    })
  }

  return (
    <div>
      {isEditing ? (
        <Input
          aria-label="Project title"
          className="mt-3 h-auto py-2 font-serif text-5xl sm:text-6xl"
          value={text.title}
          onChange={(event) => setText((current) => ({ ...current, title: event.target.value }))}
        />
      ) : (
        <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
          {project.title}
        </h1>
      )}
      {isEditing ? (
        <Textarea
          aria-label="Project tagline"
          className="mt-4 text-xl leading-relaxed"
          placeholder="Tagline"
          value={text.tagline}
          onChange={(event) => setText((current) => ({ ...current, tagline: event.target.value }))}
        />
      ) : project.tagline ? (
        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
      ) : null}
      {isEditing ? (
        <Textarea
          aria-label="Project short description"
          className="mt-8 text-lg leading-relaxed"
          placeholder="Short description"
          rows={3}
          value={text.description}
          onChange={(event) => setText((current) => ({ ...current, description: event.target.value }))}
        />
      ) : project.description ? (
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      ) : null}
      {isEditing ? (
        <Textarea
          aria-label="Project full write-up"
          className="mt-8 leading-relaxed"
          placeholder="Full write-up"
          rows={8}
          value={text.content}
          onChange={(event) => setText((current) => ({ ...current, content: event.target.value }))}
        />
      ) : project.content ? (
        <div className="mt-8 whitespace-pre-wrap border-t border-border pt-8 leading-relaxed text-muted-foreground">
          {project.content}
        </div>
      ) : null}
      {editMode ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <Button onClick={save} disabled={pending || !text.title.trim()}>
                <Check />
                {pending ? 'Saving…' : 'Save text'}
              </Button>
              <Button variant="outline" onClick={cancel} disabled={pending}>
                <X />
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Pencil />
              Edit text here
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}