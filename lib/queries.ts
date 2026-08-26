import "server-only"

import { DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_HERO, DEFAULT_SETTINGS, type About, type Contact, type Hero, type Settings } from "@/lib/content-types"
import { readData } from "@/lib/db/json/store"

async function readContent<T>(key: string, fallback: T): Promise<T> {
  const value = readData().site_content[key]
  return value ? { ...fallback, ...value } : fallback
}

export function getHero() { return readContent<Hero>("hero", DEFAULT_HERO) }
export function getAbout() { return readContent<About>("about", DEFAULT_ABOUT) }
export function getContact() { return readContent<Contact>("contact", DEFAULT_CONTACT) }
export function getSettings() { return readContent<Settings>("settings", DEFAULT_SETTINGS) }

export async function getAllProjects() {
  return readData().projects.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

export async function getPublishedProjects() {
  return (await getAllProjects()).filter((project) => project.published)
}

export async function getProjectBySlug(slug: string) {
  return readData().projects.find((project) => project.slug === slug) ?? null
}

export async function getExperience() {
  return readData().experience.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

export async function getSocialLinks() {
  return readData().social_links.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}
