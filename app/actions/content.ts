"use server"

import { revalidatePath } from "next/cache"
import { asc, eq, sql } from "drizzle-orm"
import { assertDatabaseConfigured, db } from "@/lib/db"
import { experience, projects, siteContent, socialLinks } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/admin-auth"
import type { ContentKey, Project as ProjectType, SiteSettings, SocialLink } from "@/lib/content-types"

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string }

function refresh() {
  revalidatePath("/", "layout")
}

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || `project-${Date.now()}`
  )
}

async function requireDatabase() {
  await requireAdmin()
  assertDatabaseConfigured()
}

/** Merges a partial patch into a singleton content row. */
export async function saveContent(key: ContentKey, patch: Record<string, unknown>): Promise<ActionResult> {
  await requireDatabase()

  const rows = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1)
  const currentValue = (rows[0]?.value as Record<string, unknown> | undefined) ?? {}
  const nextValue = { ...currentValue, ...patch }

  await db
    .insert(siteContent)
    .values({
      key,
      value: nextValue,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: {
        value: nextValue,
        updatedAt: new Date(),
      },
    })

  refresh()
  return { ok: true }
}

export async function saveHero(patch: Record<string, unknown>): Promise<ActionResult> {
  return saveContent("hero", patch)
}

export async function saveAbout(patch: Record<string, unknown>): Promise<ActionResult> {
  return saveContent("about", patch)
}

export async function saveContact(patch: Record<string, unknown>): Promise<ActionResult> {
  return saveContent("contact", patch)
}

export async function saveSettings(patch: SiteSettings): Promise<ActionResult> {
  return saveContent("settings", patch)
}

// ---------- Projects ----------

export type ProjectInput = {
  id?: number
  title: string
  slug?: string
  tagline?: string
  description?: string
  content?: string
  tech?: string[]
  imageUrl?: string | null
  liveUrl?: string | null
  repoUrl?: string | null
  year?: string
  role?: string
  featured?: boolean
  published?: boolean
}

async function uniqueSlug(desired: string, ignoreId?: number) {
  let candidate = desired
  let suffix = 2

  while (true) {
    const rows = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, candidate)).limit(1)
    const clash = rows[0] && rows[0].id !== ignoreId
    if (!clash) return candidate
    candidate = `${desired}-${suffix++}`
  }
}

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  await requireDatabase()

  if (input.id) {
    const title = input.title.trim() || "Untitled project"
    const slug = await uniqueSlug(slugify(input.slug?.trim() || title), input.id)

    await db
      .update(projects)
      .set({
        title,
        slug,
        tagline: input.tagline ?? "",
        description: input.description ?? "",
        content: input.content ?? "",
        tech: input.tech ?? [],
        imageUrl: input.imageUrl ?? null,
        liveUrl: input.liveUrl ?? null,
        repoUrl: input.repoUrl ?? null,
        year: input.year ?? "",
        role: input.role ?? "",
        featured: input.featured ?? false,
        published: input.published ?? true,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, input.id))

    refresh()
    return { ok: true }
  }

  const title = input.title.trim() || "Untitled project"
  const slug = await uniqueSlug(slugify(input.slug?.trim() || title))
  const maxRow = await db.select({ max: sql<number>`coalesce(max(${projects.sortOrder}), -1)` }).from(projects)

  const [row] = await db
    .insert(projects)
    .values({
      title,
      slug,
      tagline: input.tagline ?? "",
      description: input.description ?? "",
      content: input.content ?? "",
      tech: input.tech ?? [],
      imageUrl: input.imageUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      repoUrl: input.repoUrl ?? null,
      year: input.year ?? "",
      role: input.role ?? "",
      featured: input.featured ?? false,
      published: input.published ?? true,
      sortOrder: (maxRow[0]?.max ?? -1) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  refresh()
  return { ok: true }
}

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  return saveProject(input)
}

export async function updateProject(id: number, input: ProjectInput): Promise<ActionResult> {
  return saveProject({ ...input, id })
}

export async function deleteProject(id: number): Promise<ActionResult> {
  await requireDatabase()
  await db.delete(projects).where(eq(projects.id, id))
  refresh()
  return { ok: true }
}

export async function moveProject(id: number, direction: "up" | "down"): Promise<ActionResult> {
  await requireDatabase()

  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id))
  const index = rows.findIndex((row: { id: number }) => row.id === id)
  if (index === -1) return { ok: false, error: "Project not found" }

  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= rows.length) return { ok: true }

  const current = rows[index]
  const other = rows[swapIndex]

  await Promise.all([
    db.update(projects).set({ sortOrder: other.sortOrder, updatedAt: new Date() }).where(eq(projects.id, current.id)),
    db.update(projects).set({ sortOrder: current.sortOrder, updatedAt: new Date() }).where(eq(projects.id, other.id)),
  ])

  refresh()
  return { ok: true }
}

export async function reorderProjects(orderedIds: number[]): Promise<ActionResult> {
  await requireDatabase()

  await Promise.all(
    orderedIds.map((id, index) => db.update(projects).set({ sortOrder: index, updatedAt: new Date() }).where(eq(projects.id, id))),
  )

  refresh()
  return { ok: true }
}

// ---------- Experience ----------

export type ExperienceInput = {
  id?: number
  role: string
  company?: string
  location?: string
  period?: string
  description?: string
  url?: string | null
}

export async function saveExperience(input: ExperienceInput): Promise<ActionResult> {
  await requireDatabase()

  if (input.id) {
    await db
      .update(experience)
      .set({
        role: input.role.trim() || "Untitled role",
        company: input.company ?? "",
        location: input.location ?? "",
        period: input.period ?? "",
        description: input.description ?? "",
        url: input.url ?? null,
      })
      .where(eq(experience.id, input.id))
  } else {
    const maxRow = await db.select({ max: sql<number>`coalesce(max(${experience.sortOrder}), -1)` }).from(experience)
    await db.insert(experience).values({
      role: input.role.trim() || "Untitled role",
      company: input.company ?? "",
      location: input.location ?? "",
      period: input.period ?? "",
      description: input.description ?? "",
      url: input.url ?? null,
      sortOrder: (maxRow[0]?.max ?? -1) + 1,
      createdAt: new Date(),
    })
  }

  refresh()
  return { ok: true }
}

export async function createExperience(input: ExperienceInput): Promise<ActionResult> {
  return saveExperience(input)
}

export async function updateExperience(id: number, input: ExperienceInput): Promise<ActionResult> {
  return saveExperience({ ...input, id })
}

export async function deleteExperience(id: number): Promise<ActionResult> {
  await requireDatabase()
  await db.delete(experience).where(eq(experience.id, id))
  refresh()
  return { ok: true }
}

export async function reorderExperience(orderedIds: number[]): Promise<ActionResult> {
  await requireDatabase()

  await Promise.all(
    orderedIds.map((id, index) => db.update(experience).set({ sortOrder: index }).where(eq(experience.id, id))),
  )

  refresh()
  return { ok: true }
}

// ---------- Social links ----------

export type SocialInput = { label: string; url?: string; icon?: string }

export async function saveSocials(rows: SocialInput[]): Promise<ActionResult> {
  await requireDatabase()

  await db.delete(socialLinks)
  await db.insert(socialLinks).values(
    rows.map((row, index) => ({
      label: row.label.trim() || "Link",
      url: row.url ?? "",
      icon: row.icon ?? "link",
      sortOrder: index,
      createdAt: new Date(),
    })),
  )

  refresh()
  return { ok: true }
}

export async function createSocialLink(input: SocialInput): Promise<ActionResult> {
  await requireDatabase()
  const maxRow = await db.select({ max: sql<number>`coalesce(max(${socialLinks.sortOrder}), -1)` }).from(socialLinks)
  await db.insert(socialLinks).values({
    label: input.label.trim() || "Link",
    url: input.url ?? "",
    icon: input.icon ?? "link",
    sortOrder: (maxRow[0]?.max ?? -1) + 1,
    createdAt: new Date(),
  })
  refresh()
  return { ok: true }
}

export async function updateSocialLink(id: number, input: SocialInput): Promise<ActionResult> {
  await requireDatabase()
  await db
    .update(socialLinks)
    .set({
      label: input.label.trim() || "Link",
      url: input.url ?? "",
      icon: input.icon ?? "link",
    })
    .where(eq(socialLinks.id, id))
  refresh()
  return { ok: true }
}

export async function deleteSocialLink(id: number): Promise<ActionResult> {
  await requireDatabase()
  await db.delete(socialLinks).where(eq(socialLinks.id, id))
  refresh()
  return { ok: true }
}
