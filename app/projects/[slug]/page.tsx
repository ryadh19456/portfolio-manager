import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getProjectBySlug } from '@/lib/queries'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.published) notFound()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <article className="mt-10">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={`${project.title} preview`}
              className="aspect-[16/7] w-full rounded-2xl border border-border object-cover"
            />
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {project.year ? <span>{project.year}</span> : null}
                {project.role ? <span>· {project.role}</span> : null}
                {project.featured ? <Badge>Featured</Badge> : null}
              </div>
              <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
                {project.title}
              </h1>
              {project.tagline ? (
                <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
                  {project.tagline}
                </p>
              ) : null}
              {project.description ? (
                <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              ) : null}
              {project.content ? (
                <div className="mt-8 whitespace-pre-wrap border-t border-border pt-8 leading-relaxed text-muted-foreground">
                  {project.content}
                </div>
              ) : null}
            </div>

            <aside className="flex flex-col gap-6 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6">
              {project.tech.length > 0 ? (
                <div>
                  <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Built with
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
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
                    View live project <ExternalLink className="size-4" />
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    View source code <Code2 className="size-4" />
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
          See all projects <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </main>
  )
}
