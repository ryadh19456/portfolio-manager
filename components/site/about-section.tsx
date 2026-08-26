import type { AboutContent } from '@/lib/content-types'
import { Badge } from '@/components/ui/badge'

export function AboutSection({ about }: { about: AboutContent }) {
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl scroll-mt-20 border-t border-border px-6 py-16"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-5">
          {about.photoUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
              <img
                src={about.photoUrl}
                alt={about.heading || 'Profile'}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ) : null}
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            {about.heading}
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {about.body
              .split('\n')
              .filter((p) => p.trim())
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>

          {about.skills.length > 0 ? (
            <div className="mt-2">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {about.skillsHeading}
              </h3>
              <div className="flex flex-wrap gap-2">
                {about.skills.map((s) => (
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
  )
}
