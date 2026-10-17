'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, GripVertical } from 'lucide-react'
import type { Project } from '@/lib/content-types'
import { useAdmin } from '@/components/admin/admin-provider'
import { ProjectEditor } from '@/components/admin/editors/project-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from './language-provider'

/* Projects only. Editable via ProjectEditor. */

export function ProjectCard({
  project,
  onReorder,
  isFirst,
  isLast,
}: {
  project: Project
  onReorder?: (dir: 'up' | 'down') => void
  isFirst?: boolean
  isLast?: boolean
}) {
  const { editMode } = useAdmin()
  const { t, localize, translateContent } = useLanguage()
  const [open, setOpen] = useState(false)
  const displayedProject = translateContent(project)

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors',
        !editMode && 'hover:border-foreground/25',
        !project.published && 'opacity-60',
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn('block', editMode && 'pointer-events-none')}
        tabIndex={editMode ? -1 : undefined}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl || '/placeholder.svg'}
              alt={`${localize(displayedProject.title)} preview`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="font-serif text-2xl text-muted-foreground/50">
                {localize(displayedProject.title)}
              </span>
            </div>
          )}
          {project.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              {t('project.featured')}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl tracking-tight">
                {localize(displayedProject.title)}
              </h3>
              {displayedProject.year ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {displayedProject.year}
                  {displayedProject.role ? ` · ${localize(displayedProject.role)}` : ''}
                </p>
              ) : null}
            </div>
            <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>

          <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {localize(displayedProject.tagline || displayedProject.description)}
          </p>

          {displayedProject.tech.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {displayedProject.tech.slice(0, 4).map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>

      {editMode ? (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-secondary/50 px-4 py-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <GripVertical className="size-3.5" />
            {!project.published ? t('edit.draft') : `${t('edit.order')} ${project.sortOrder}`}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={isFirst}
              onClick={() => onReorder?.('up')}
            >
              {t('edit.up')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isLast}
              onClick={() => onReorder?.('down')}
            >
              {t('edit.down')}
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              {t('edit.edit')}
            </Button>
          </div>
        </div>
      ) : null}

      <ProjectEditor open={open} onOpenChange={setOpen} project={project} />
    </article>
  )
}
