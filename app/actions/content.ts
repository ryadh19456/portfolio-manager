"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin-auth"
import { nextId, readData, writeData } from "@/lib/db/json/store"
import type { ContentKey, Project, SiteSettings } from "@/lib/content-types"

export type ActionResult = { ok: true } | { ok: false; error: string }

function refresh() { revalidatePath("/", "layout") }
async function requireEditor() { await requireAdmin() }

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60) || `project-${Date.now()}`
}

function uniqueSlug(projects: Project[], desired: string, ignoreId?: number) {
  let candidate = desired
  let suffix = 2
  while (projects.some((project) => project.slug === candidate && project.id !== ignoreId)) candidate = `${desired}-${suffix++}`
  return candidate
}

export async function saveContent(key: ContentKey, patch: Record<string, unknown>): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.site_content[key] = { ...(data.site_content[key] ?? {}), ...patch }
  writeData(data)
  refresh()
  return { ok: true }
}

export async function saveHero(patch: Record<string, unknown>) { return saveContent("hero", patch) }
export async function saveAbout(patch: Record<string, unknown>) { return saveContent("about", patch) }
export async function saveContact(patch: Record<string, unknown>) { return saveContent("contact", patch) }
export async function saveSettings(patch: SiteSettings) { return saveContent("settings", patch) }

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

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  const title = input.title.trim() || "Untitled project"
  const project = {
    title,
    slug: uniqueSlug(data.projects, slugify(input.slug?.trim() || title), input.id),
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
    updatedAt: new Date().toISOString(),
  }

  if (input.id) {
    const index = data.projects.findIndex((item) => item.id === input.id)
    if (index === -1) return { ok: false, error: "Project not found" }
    data.projects[index] = { ...data.projects[index], ...project }
  } else {
    data.projects.push({ ...project, id: nextId(data.projects), sortOrder: data.projects.length, createdAt: new Date().toISOString() } as Project)
  }

  writeData(data)
  refresh()
  return { ok: true }
}

export async function createProject(input: ProjectInput) { return saveProject(input) }
export async function updateProject(id: number, input: ProjectInput) { return saveProject({ ...input, id }) }

export async function deleteProject(id: number): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.projects = data.projects.filter((project) => project.id !== id)
  writeData(data)
  refresh()
  return { ok: true }
}

export async function moveProject(id: number, direction: "up" | "down"): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.projects.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
  const index = data.projects.findIndex((project) => project.id === id)
  if (index === -1) return { ok: false, error: "Project not found" }
  const swapIndex = direction === "up" ? index - 1 : index + 1
  if (swapIndex >= 0 && swapIndex < data.projects.length) {
    const currentOrder = data.projects[index].sortOrder
    data.projects[index].sortOrder = data.projects[swapIndex].sortOrder
    data.projects[swapIndex].sortOrder = currentOrder
  }
  writeData(data)
  refresh()
  return { ok: true }
}

export async function reorderProjects(orderedIds: number[]): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  orderedIds.forEach((id, index) => {
    const project = data.projects.find((item) => item.id === id)
    if (project) project.sortOrder = index
  })
  writeData(data)
  refresh()
  return { ok: true }
}

export type ExperienceInput = { id?: number; role: string; company?: string; location?: string; period?: string; description?: string; url?: string | null }

export async function saveExperience(input: ExperienceInput): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  const entry = { role: input.role.trim() || "Untitled role", company: input.company ?? "", location: input.location ?? "", period: input.period ?? "", description: input.description ?? "", url: input.url ?? null }
  if (input.id) {
    const index = data.experience.findIndex((item) => item.id === input.id)
    if (index === -1) return { ok: false, error: "Experience not found" }
    data.experience[index] = { ...data.experience[index], ...entry }
  } else {
    data.experience.push({ ...entry, id: nextId(data.experience), sortOrder: data.experience.length, createdAt: new Date().toISOString() })
  }
  writeData(data)
  refresh()
  return { ok: true }
}

export async function createExperience(input: ExperienceInput) { return saveExperience(input) }
export async function updateExperience(id: number, input: ExperienceInput) { return saveExperience({ ...input, id }) }

export async function deleteExperience(id: number): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.experience = data.experience.filter((item) => item.id !== id)
  writeData(data)
  refresh()
  return { ok: true }
}

export async function reorderExperience(orderedIds: number[]): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  orderedIds.forEach((id, index) => {
    const entry = data.experience.find((item) => item.id === id)
    if (entry) entry.sortOrder = index
  })
  writeData(data)
  refresh()
  return { ok: true }
}

export type SocialInput = { label: string; url?: string; icon?: string }

export async function saveSocials(rows: SocialInput[]): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.social_links = rows.map((row, index) => ({ label: row.label.trim() || "Link", url: row.url ?? "", icon: row.icon ?? "link", id: index + 1, sortOrder: index, createdAt: new Date().toISOString() }))
  writeData(data)
  refresh()
  return { ok: true }
}

export async function createSocialLink(input: SocialInput): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.social_links.push({ label: input.label.trim() || "Link", url: input.url ?? "", icon: input.icon ?? "link", id: nextId(data.social_links), sortOrder: data.social_links.length, createdAt: new Date().toISOString() })
  writeData(data)
  refresh()
  return { ok: true }
}

export async function updateSocialLink(id: number, input: SocialInput): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  const link = data.social_links.find((item) => item.id === id)
  if (!link) return { ok: false, error: "Social link not found" }
  Object.assign(link, { label: input.label.trim() || "Link", url: input.url ?? "", icon: input.icon ?? "link" })
  writeData(data)
  refresh()
  return { ok: true }
}

export async function deleteSocialLink(id: number): Promise<ActionResult> {
  await requireEditor()
  const data = readData()
  data.social_links = data.social_links.filter((item) => item.id !== id)
  writeData(data)
  refresh()
  return { ok: true }
}
