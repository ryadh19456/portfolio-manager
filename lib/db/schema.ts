import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  content: text("content").notNull().default(""),
  tech: text("tech", { mode: "json" }).notNull().$default(() => []),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  year: text("year").notNull().default(""),
  role: text("role").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const experience = sqliteTable("experience", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  company: text("company").notNull().default(""),
  location: text("location").notNull().default(""),
  period: text("period").notNull().default(""),
  description: text("description").notNull().default(""),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const socialLinks = sqliteTable("social_links", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  url: text("url").notNull().default(""),
  icon: text("icon").notNull().default("link"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull().$defaultFn(() => ({})),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export type Project = typeof projects.$inferSelect
export type ExperienceEntry = typeof experience.$inferSelect
export type SocialLink = typeof socialLinks.$inferSelect
