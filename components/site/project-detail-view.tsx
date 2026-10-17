'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectEditor } from '@/components/admin/editors/project-editor'
import { ProjectDetailEdit } from '@/components/admin/project-detail-edit'
import type { Project, SiteSettings } from '@/lib/content-types'
import { useLanguage } from './language-provider'
import { SiteHeader } from './site-header'
import { useAdmin } from '@/components/admin/admin-provider'

export function ProjectDetailView({
  project,
  settings,
}: {
  project: Project
  settings: SiteSettings
}) {
  const { t, localize, translateContent } = useLanguage()
  const { editMode } = useAdmin()
  const [projectEditorOpen, setProjectEditorOpen] = useState(false)
  const displayedProject = translateContent(project)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader name={settings.siteTitle} settings={settings} />
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t('project.back')}
        </Link>

        <article className="mt-10">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={`${localize(displayedProject.title)} preview`}
              className="aspect-[16/7] w-full rounded-2xl border border-border object-cover"
            />
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {displayedProject.year ? <span>{displayedProject.year}</span> : null}
                {displayedProject.role ? <span>· {localize(displayedProject.role)}</span> : null}
                {project.featured ? <Badge>{t('project.featured')}</Badge> : null}
                {editMode ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Edit project details"
                    title="Edit project details"
                    onClick={() => setProjectEditorOpen(true)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                ) : null}
              </div>
              <ProjectDetailEdit project={project} />
            </div>

            <aside className="flex flex-col gap-6 border-t border-border pt-6 lg:border-s lg:border-t-0 lg:ps-6">
              {displayedProject.tech.length > 0 ? (
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {t('project.builtWith')}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {displayedProject.tech.map((technology) => (
                      <Badge key={technology} variant="secondary">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col items-start gap-3">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    {t('project.viewLive')} <ExternalLink className="size-4" />
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    {t('project.viewSource')} <Code2 className="size-4" />
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        </article>

        <Link
          href="/#work"
          className="mt-16 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('project.all')} <ArrowUpRight className="size-4" />
        </Link>
      </div>
      <ProjectEditor
        open={projectEditorOpen}
        onOpenChange={setProjectEditorOpen}
        project={project}
      />
    </main>
  )
}