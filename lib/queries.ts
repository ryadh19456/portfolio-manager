import "server-only"

import { asc, eq } from "drizzle-orm"
import { db, ensureSqliteDatabaseSynced, hasDatabaseConfig } from "@/lib/db"
import { experience, projects, siteContent, socialLinks } from "@/lib/db/schema"
import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_HERO,
  DEFAULT_SETTINGS,
  type About,
  type Contact,
  type Hero,
  type Settings,
} from "@/lib/content-types"

/**
 * Reads one singleton content row and merges it over the defaults so a missing
 * key or a partially-filled row can never render as blank UI.
 */
async function readContent<T>(key: string, fallback: T): Promise<T> {
  if (!hasDatabaseConfig()) return fallback

  try {
    await ensureSqliteDatabaseSynced()
    const rows = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1)
    if (!rows.length) return fallback
    return { ...fallback, ...(rows[0].value as Partial<T>) }
  } catch (error) {
    console.log("[v0] readContent failed for key:", key, error)
    return fallback
  }
}

export function getHero() {
  return readContent<Hero>("hero", DEFAULT_HERO)
}

export function getAbout() {
  return readContent<About>("about", DEFAULT_ABOUT)
}

export function getContact() {
  return readContent<Contact>("contact", DEFAULT_CONTACT)
}

export function getSettings() {
  return readContent<Settings>("settings", DEFAULT_SETTINGS)
}

/** All projects, including unpublished. Admin views only. */
export async function getAllProjects() {
  if (!hasDatabaseConfig()) return []

  try {
    await ensureSqliteDatabaseSynced()
    return await db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id))
  } catch (error) {
    console.log("[v0] getAllProjects failed:", error)
    return []
  }
}

export async function getPublishedProjects() {
  if (!hasDatabaseConfig()) return []

  try {
    await ensureSqliteDatabaseSynced()
    return await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.sortOrder), asc(projects.id))
  } catch (error) {
    console.log("[v0] getPublishedProjects failed:", error)
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  if (!hasDatabaseConfig()) return null

  try {
    await ensureSqliteDatabaseSynced()
    const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
    return rows[0] ?? null
  } catch (error) {
    console.log("[v0] getProjectBySlug failed:", error)
    return null
  }
}

export async function getExperience() {
  if (!hasDatabaseConfig()) return []

  try {
    await ensureSqliteDatabaseSynced()
    return await db.select().from(experience).orderBy(asc(experience.sortOrder), asc(experience.id))
  } catch (error) {
    console.log("[v0] getExperience failed:", error)
    return []
  }
}

export async function getSocialLinks() {
  if (!hasDatabaseConfig()) return []

  try {
    await ensureSqliteDatabaseSynced()
    return await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id))
  } catch (error) {
    console.log("[v0] getSocialLinks failed:", error)
    return []
  }
}
