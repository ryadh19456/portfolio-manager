/* All things in site not editable. Only projects section remains. */

'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import type { Project, SiteSettings } from '@/lib/content-types'
import { useAdmin } from '@/components/admin/admin-provider'
import { ProjectCard } from './project-card'
import { ProjectEditor } from '@/components/admin/editors/project-editor'
import { Button } from '@/components/ui/button'
import { moveProject } from '@/app/actions/content'
import { toast } from 'sonner'
import { useLanguage } from './language-provider'

export function WorkSection({
  projects,
  settings,
}: {
  projects: Project[]
  settings: SiteSettings
}) {
  const { editMode } = useAdmin()
  const { t, localize } = useLanguage()
  const [addOpen, setAddOpen] = useState(false)
  const [, startTransition] = useTransition()

  function reorder(id: number, dir: 'up' | 'down') {
    startTransition(async () => {
      const res = await moveProject(id, dir)
      if (!res.ok) toast.error(res.error ?? 'Could not reorder')
    })
  }

  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            {localize(settings.workHeading)}
          </h2>
          {settings.workSubheading ? (
            <p className="mt-2 text-muted-foreground">
              {localize(settings.workSubheading)}
            </p>
          ) : null}
        </div>
        {editMode ? (
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="size-4" />
            {t('work.add')}
          </Button>
        ) : null}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          {editMode
            ? t('work.noProjectsEdit')
            : t('work.noProjects')}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              onReorder={(dir) => reorder(p.id, dir)}
              isFirst={i === 0}
              isLast={i === projects.length - 1}
            />
          ))}
        </div>
      )}

      <ProjectEditor open={addOpen} onOpenChange={setAddOpen} project={null} />
    </section>
  )
}
