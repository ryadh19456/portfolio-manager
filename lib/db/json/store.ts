import "server-only"

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { get, put } from "@vercel/blob"
import type { Experience, Project, SocialLink } from "@/lib/content-types"

export type JsonData = {
  site_content: Record<string, Record<string, unknown>>
  projects: Project[]
  experience: Experience[]
  social_links: SocialLink[]
}

const dataPath = path.join(process.cwd(), "lib", "db", "json", "site_content.json")
const blobPathname = "portfolio/site_content.json"

function parseData(raw: string): JsonData {
  const parsed = JSON.parse(raw) as Partial<JsonData>
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
}

export async function readData(): Promise<JsonData> {
  if (process.env.VERCEL) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is required to persist content on Vercel")
    }

    const blob = await get(blobPathname, { access: "private" })
    if (blob) return parseData(await new Response(blob.stream).text())
  }

  try {
    return parseData(readFileSync(dataPath, "utf8"))
  } catch {
    return { site_content: {}, projects: [], experience: [], social_links: [] }
  }
}

export async function writeData(data: JsonData): Promise<void> {
  if (process.env.VERCEL) {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is required to persist content on Vercel")
    }

    await put(blobPathname, `${JSON.stringify(data, null, 2)}\n`, {
      access: "private",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    })
    return
  }

  mkdirSync(path.dirname(dataPath), { recursive: true })
  writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

export function nextId(rows: Array<{ id: number }>) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}
