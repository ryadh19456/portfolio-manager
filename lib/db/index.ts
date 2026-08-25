import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { put } from "@vercel/blob"
import { Pool } from "pg"
import { DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_HERO, DEFAULT_SETTINGS } from "@/lib/content-types"
import * as schema from "./schema"

function isSqliteDatabaseUrl(value: string | undefined) {
  const url = (value ?? "file:./portfolio.db").trim()
  return !url.startsWith("postgres://") && !url.startsWith("postgresql://")
}

function resolveSqliteFilePath() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "portfolio.db")
  }

  const raw = (process.env.DATABASE_URL ?? "file:./portfolio.db").trim()

  if (raw.startsWith("file:")) {
    return raw.replace(/^file:/, "") || "./portfolio.db"
  }

  return raw.startsWith("./") || raw.startsWith("/") ? raw : `./${raw}`
}

function hasBlobStorageConfig() {
  return Boolean(process.env.BLOB_STORE_ID && process.env.BLOB_READ_WRITE_TOKEN)
}

function getBlobStoreBaseUrl() {
  if (!hasBlobStorageConfig()) return null
  return `https://${process.env.BLOB_STORE_ID!.trim()}.public.blob.vercel-storage.com`
}

async function syncSqliteFromBlob(sqlitePath: string) {
  if (!hasBlobStorageConfig()) return

  const blobUrl = getBlobStoreBaseUrl()
  if (!blobUrl) return

  try {
    const response = await fetch(`${blobUrl}/portfolio.db?token=${encodeURIComponent(process.env.BLOB_READ_WRITE_TOKEN!.trim())}`)
    if (!response.ok) return

    const buffer = Buffer.from(await response.arrayBuffer())
    mkdirSync(path.dirname(sqlitePath), { recursive: true })
    writeFileSync(sqlitePath, buffer)
  } catch {
    // Blob-backed data is optional; if there's nothing there yet, keep using the local SQLite file.
  }
}

export async function syncSqliteDatabaseToBlob() {
  if (!isSqliteDatabaseUrl(process.env.DATABASE_URL) || !hasBlobStorageConfig()) return

  const sqliteFilePath = resolveSqliteFilePath()
  try {
    const sqliteBytes = readFileSync(sqliteFilePath)
    await put("portfolio.db", new Blob([sqliteBytes]), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    })
  } catch {
    // Ignore blob sync failures so database writes still succeed locally.
  }
}

export function hasDatabaseConfig() {
  return true
}

export function assertDatabaseConfigured() {
  return
}

const globalForDb = globalThis as unknown as { pool?: Pool }
const sqliteEnabled = isSqliteDatabaseUrl(process.env.DATABASE_URL)

function seedDefaultContent(sqlite: Database.Database) {
  const getKeys = sqlite.prepare("SELECT key FROM site_content").all() as Array<{ key: string }>
  const existing = new Set(getKeys.map((row) => row.key))

  const defaults = [
    [
      "hero",
      {
        name: "Avery Stone",
        role: "Product Designer & Frontend Engineer",
        headline: "I design calm, useful digital experiences.",
        intro:
          "I help startups and small teams turn complex ideas into clear, human-centered products — from strategy and UX to polished frontend delivery.",
        location: "Remote · Worldwide",
        availability: "Available for product design & frontend work",
        avatarUrl: null,
        ctaLabel: "View my work",
        ctaHref: "#work",
        secondaryCtaLabel: "Get in touch",
        secondaryCtaHref: "#contact",
      },
    ],
    [
      "about",
      {
        heading: "About",
        body:
          "I’m a multidisciplinary product designer and frontend engineer with a background in product strategy, interface design, and shipping polished web experiences.\n\nI love building products that feel effortless to use — whether that means clarifying a workflow, improving a conversion funnel, or turning a messy concept into a clean system people actually enjoy using.",
        skillsHeading: "Capabilities",
        skills: ["Product Design", "UX Strategy", "UI Systems", "React", "TypeScript", "Design Systems"],
        photoUrl: null,
      },
    ],
    [
      "contact",
      {
        heading: "Let’s build something meaningful.",
        body:
          "I partner with founders, product teams, and agencies to design and build digital experiences that are thoughtful, useful, and measurable.",
        email: "hello@averystone.dev",
        buttonLabel: "Say hello",
        footerNote: "Made with care.",
      },
    ],
    [
      "settings",
      {
        siteTitle: "Avery Stone",
        siteDescription: "Product designer and frontend engineer crafting thoughtful digital experiences.",
        workHeading: "Selected Projects",
        workSubheading: "Recent work across product design, brand systems, and web experiences.",
        experienceHeading: "Experience",
        showExperience: true,
        showAbout: true,
        showContact: true,
        footerText: "© 2026 Avery Stone",
      },
    ],
  ] as const

  const insertSiteContent = sqlite.prepare(
    `INSERT INTO site_content (key, value, updated_at) VALUES (?, ?, ?)`,
  )

  for (const [key, value] of defaults) {
    if (!existing.has(key)) {
      insertSiteContent.run(key, JSON.stringify(value), Date.now())
    }
  }

  const projectCount = sqlite.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number }
  if (projectCount.count === 0) {
    sqlite.prepare(
      `INSERT INTO projects (slug, title, tagline, description, content, tech, image_url, live_url, repo_url, year, role, featured, published, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      "northstar-analytics",
      "Northstar Analytics",
      "Product analytics for modern teams.",
      "A streamlined analytics dashboard designed to help teams move from raw data to confident decisions.",
      "## Northstar Analytics\n\nA collaborative product analytics platform for PMs and growth teams. The work focused on simplifying reporting, clarifying funnel health, and building a design system that scaled across the product.",
      JSON.stringify(["Product Design", "React", "Analytics", "UX Research"]),
      null,
      "https://example.com",
      "https://github.com/example/northstar",
      "2026",
      "Senior Product Designer",
      1,
      1,
      0,
      Date.now(),
      Date.now(),
    )
  }

  const experienceCount = sqlite.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number }
  if (experienceCount.count === 0) {
    sqlite.prepare(
      `INSERT INTO experience (role, company, location, period, description, url, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      "Senior Product Designer",
      "Northstar Labs",
      "Remote",
      "2023 — Present",
      "Led product design for a B2B analytics platform spanning dashboards, onboarding, and experimentation flows.",
      "https://example.com",
      0,
      Date.now(),
    )

    sqlite.prepare(
      `INSERT INTO experience (role, company, location, period, description, url, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      "Frontend Engineer",
      "Freelance",
      "Remote",
      "2020 — 2023",
      "Built high-converting websites and product interfaces for startup teams, with a focus on performance, accessibility, and design polish.",
      "https://example.com",
      1,
      Date.now(),
    )
  }

  const socialCount = sqlite.prepare("SELECT COUNT(*) as count FROM social_links").get() as { count: number }
  if (socialCount.count === 0) {
    sqlite.prepare(
      `INSERT INTO social_links (label, url, icon, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run("GitHub", "https://github.com", "github", 0, Date.now())

    sqlite.prepare(
      `INSERT INTO social_links (label, url, icon, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run("LinkedIn", "https://linkedin.com", "linkedin", 1, Date.now())

    sqlite.prepare(
      `INSERT INTO social_links (label, url, icon, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run("Email", "mailto:hello@averystone.dev", "mail", 2, Date.now())
  }
}

function createDatabase() {
  if (sqliteEnabled) {
    const sqliteFilePath = resolveSqliteFilePath()
    mkdirSync(path.dirname(sqliteFilePath), { recursive: true })
    void syncSqliteFromBlob(sqliteFilePath)

    const sqlite = new Database(sqliteFilePath)
    sqlite.pragma("journal_mode = WAL")
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        tagline TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        tech TEXT NOT NULL DEFAULT '[]',
        image_url TEXT,
        live_url TEXT,
        repo_url TEXT,
        year TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL DEFAULT '',
        featured INTEGER NOT NULL DEFAULT 0,
        published INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        company TEXT NOT NULL DEFAULT '',
        location TEXT NOT NULL DEFAULT '',
        period TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        url TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        url TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT 'link',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '{}',
        updated_at INTEGER NOT NULL
      );
    `)

    seedDefaultContent(sqlite)
    return drizzle(sqlite, { schema })
  }

  const pool =
    globalForDb.pool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    })

  if (process.env.NODE_ENV !== "production") globalForDb.pool = pool

  return drizzlePg(pool, { schema })
}

let db: any

db = createDatabase()

export { db }
