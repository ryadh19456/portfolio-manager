'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import type { Experience, SiteSettings } from '@/lib/content-types'
import { useAdmin } from '@/components/admin/admin-provider'
import { ExperienceEditor } from '@/components/admin/editors/experience-editor'
import { Button } from '@/components/ui/button'
import { deleteExperience } from '@/app/actions/content'
import { toast } from 'sonner'

export function ExperienceSection({
  experience,
  settings,
}: {
  experience: Experience[]
  settings: SiteSettings
}) {
  const { editMode } = useAdmin()
  const [editing, setEditing] = useState<Experience | null | 'new'>(null)
  const [, startTransition] = useTransition()

  function remove(id: number) {
    startTransition(async () => {
      const res = await deleteExperience(id)
      if (res.ok) toast.success('Entry removed')
      else toast.error(res.error ?? 'Could not remove')
    })
  }

  return (
    <section
      id="experience"
      className="mx-auto max-w-5xl scroll-mt-20 border-t border-border px-6 py-16"
    >
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
          {settings.experienceHeading}
        </h2>
        {editMode ? (
          <Button onClick={() => setEditing('new')} className="gap-2">
            <Plus className="size-4" />
            Add entry
          </Button>
        ) : null}
      </div>

      <ol className="flex flex-col">
        {experience.map((job) => (
          <li
            key={job.id}
            className="grid grid-cols-1 gap-2 border-t border-border py-6 first:border-t-0 sm:grid-cols-[180px_1fr]"
          >
            <div className="text-sm text-muted-foreground">{job.period}</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium">
                  {job.role}
                  {job.company ? (
                    <span className="text-muted-foreground">
                      {' '}
                      · {job.company}
                    </span>
                  ) : null}
                </h3>
                {job.location ? (
                  <span className="text-sm text-muted-foreground">
                    {job.location}
                  </span>
                ) : null}
              </div>
              {job.description ? (
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {job.description}
                </p>
              ) : null}
              {editMode ? (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(job)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <ExperienceEditor
        open={editing !== null}
        onOpenChange={(v) => !v && setEditing(null)}
        entry={editing === 'new' ? null : editing}
      />
    </section>
  )
}
