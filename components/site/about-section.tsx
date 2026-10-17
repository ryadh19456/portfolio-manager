'use client'

import type { AboutContent } from '@/lib/content-types'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from './language-provider'
import { useState } from 'react'
import { AboutEditor } from '@/components/admin/editors/about-editor'
import { Editable } from '@/components/admin/editable'

export function AboutSection({ about }: { about: AboutContent }) {
  const { localize, translateContent } = useLanguage()
  const [editorOpen, setEditorOpen] = useState(false)
  const displayedAbout = translateContent(about)

  return (
    <Editable label="about" onEdit={() => setEditorOpen(true)}>
    <section
      id="about"
      className="mx-auto max-w-5xl scroll-mt-20 border-t border-border px-6 py-16"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-5">
          {displayedAbout.photoUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
              <img
                src={displayedAbout.photoUrl}
                alt={localize(displayedAbout.heading) || 'Profile'}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ) : null}
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            {localize(displayedAbout.heading)}
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {localize(displayedAbout.body)
                .split('\n')
              .filter((p) => p.trim())
              .map((para, i) => (
                <p key={i}>{localize(para)}</p>
              ))}
          </div>

          {about.skills.length > 0 ? (
            <div className="mt-2">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {localize(displayedAbout.skillsHeading)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayedAbout.skills.map((s) => (
                  <Badge key={s} variant="outline" className="font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

    </section>
    <AboutEditor open={editorOpen} onOpenChange={setEditorOpen} about={about} />
    </Editable>
  )
}
