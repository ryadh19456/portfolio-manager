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
  const [open, setOpen] = useState(false)

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
              alt={`${project.title} preview`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="font-serif text-2xl text-muted-foreground/50">
                {project.title}
              </span>
            </div>
          )}
          {project.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl tracking-tight">
                {project.title}
              </h3>
              {project.year ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {project.year}
                  {project.role ? ` · ${project.role}` : ''}
                </p>
              ) : null}
            </div>
            <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>

          <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {project.tagline || project.description}
          </p>

          {project.tech.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
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
            {!project.published ? 'Draft' : `Order ${project.sortOrder}`}
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={isFirst}
              onClick={() => onReorder?.('up')}
            >
              Up
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isLast}
              onClick={() => onReorder?.('down')}
            >
              Down
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              Edit
            </Button>
          </div>
        </div>
      ) : null}

      <ProjectEditor open={open} onOpenChange={setOpen} project={project} />
    </article>
  )
}
