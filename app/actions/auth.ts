"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  checkRateLimit,
  clearRateLimit,
  createAdminSession,
  destroyAdminSession,
  isAdmin,
  verifyPassword,
} from "@/lib/admin-auth"

export type UnlockResult = { ok: boolean; error?: string }

export async function unlockAdmin(password: string): Promise<UnlockResult> {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return { ok: false, error: "Admin access is not configured on the server." }
  }

  const headerList = await headers()
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"

  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    const minutes = Math.ceil((limit.retryInMs ?? 0) / 60000)
    return { ok: false, error: `Too many attempts. Try again in ${minutes} minute(s).` }
  }

  // Blunt the timing signal on failed attempts.
  await new Promise((resolve) => setTimeout(resolve, 350))

  if (!verifyPassword(password)) {
    return { ok: false, error: "Incorrect password." }
  }

  clearRateLimit(ip)
  await createAdminSession()
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function login(password: string): Promise<UnlockResult> {
  return unlockAdmin(password)
}

export async function lockAdmin() {
  await destroyAdminSession()
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function checkAdmin() {
  return isAdmin()
}
