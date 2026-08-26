import "server-only"

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import type { Experience, Project, SocialLink } from "@/lib/content-types"

export type JsonData = {
  site_content: Record<string, Record<string, unknown>>
  projects: Project[]
  experience: Experience[]
  social_links: SocialLink[]
}

const dataPath = path.join(process.cwd(), "lib", "db", "json", "site_content.json")

export function readData(): JsonData {
  try {
    const parsed = JSON.parse(readFileSync(dataPath, "utf8")) as Partial<JsonData>
    const legacyContent = parsed as Record<string, Record<string, unknown>>
    return {
      site_content: parsed.site_content ?? {
        hero: legacyContent.hero,
        about: legacyContent.about,
        contact: legacyContent.contact,
        settings: legacyContent.settings,
      },
      projects: parsed.projects ?? [],
      experience: parsed.experience ?? [],
      social_links: parsed.social_links ?? [],
    }
  } catch {
    return { site_content: {}, projects: [], experience: [], social_links: [] }
  }
}

export function writeData(data: JsonData) {
  mkdirSync(path.dirname(dataPath), { recursive: true })
  writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export function nextId(rows: Array<{ id: number }>) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}