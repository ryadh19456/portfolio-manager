import "server-only"

import { DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_HERO, DEFAULT_SETTINGS, type AboutContent, type ContactContent, type HeroContent, type SiteSettings } from "@/lib/content-types"
import { readData } from "@/lib/db/json/store"

async function readContent<T>(key: string, fallback: T): Promise<T> {
  const value = (await readData()).site_content[key]
  return value ? { ...fallback, ...value } : fallback
}

export function getHero() { return readContent<HeroContent>("hero", DEFAULT_HERO) }
export function getAbout() { return readContent<AboutContent>("about", DEFAULT_ABOUT) }
export function getContact() { return readContent<ContactContent>("contact", DEFAULT_CONTACT) }
export function getSettings() { return readContent<SiteSettings>("settings", DEFAULT_SETTINGS) }

export async function getAllProjects() {
  return (await readData()).projects.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

export async function getPublishedProjects() {
  return (await getAllProjects()).filter((project) => project.published)
}

export async function getProjectBySlug(slug: string) {
  return (await readData()).projects.find((project) => project.slug === slug) ?? null
}

export async function getExperience() {
  return (await readData()).experience.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

export async function getSocialLinks() {
  return (await readData()).social_links.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}
