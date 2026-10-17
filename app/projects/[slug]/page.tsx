import { notFound } from 'next/navigation'
import { ProjectDetailView } from '@/components/site/project-detail-view'
import { getProjectBySlug, getSettings } from '@/lib/queries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.published) {
    return { robots: { index: false, follow: false } }
  }

  const settings = await getSettings()
  const description = project.tagline || project.description || settings.siteDescription

  return {
    title: `${project.title} | ${settings.siteTitle}`,
    description,
    alternates: {
      canonical: `/projects/${encodeURIComponent(project.slug)}`,
    },
    openGraph: {
      title: project.title,
      description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.published) notFound()

  const settings = await getSettings()
  return <ProjectDetailView project={project} settings={settings} />
}
