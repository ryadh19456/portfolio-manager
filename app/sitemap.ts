import type { MetadataRoute } from 'next'
import { getPublishedProjects } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const projects = await getPublishedProjects()

  return [
    {
      url: siteUrl.toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projects.map((project) => ({
      url: new URL(`/projects/${encodeURIComponent(project.slug)}`, siteUrl).toString(),
      lastModified: project.updatedAt ? new Date(project.updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ]
}
