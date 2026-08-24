import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "pf_admin"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set")
  return secret
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url")
}

/** Constant-time string comparison that does not leak length via early return. */
function safeEqual(a: string, b: string) {
  const ha = createHmac("sha256", getSecret()).update(a).digest()
  const hb = createHmac("sha256", getSecret()).update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return safeEqual(input, expected)
}

function createToken() {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

function verifyToken(token: string | undefined) {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  let expectedSig: string
  try {
    expectedSig = sign(payload)
  } catch {
    return false
  }

  const given = Buffer.from(signature)
  const expected = Buffer.from(expectedSig)
  if (given.length !== expected.length) return false
  if (!timingSafeEqual(given, expected)) return false

  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}

export async function createAdminSession() {
  const store = await cookies()
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: true,
    // The v0 preview renders the app in a cross-site iframe; "none" keeps the cookie.
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroyAdminSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** Read-only check, safe to call from server components. */
export async function isAdmin() {
  try {
    const store = await cookies()
    return verifyToken(store.get(COOKIE_NAME)?.value)
  } catch {
    return false
  }
}

/** Throws if the caller is not an authenticated admin. Use in every mutating action. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized")
}

// --- Simple in-memory rate limiting for unlock attempts ---
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 1000 * 60 * 10
const MAX_ATTEMPTS = 8

export function checkRateLimit(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, retryInMs: entry.resetAt - now }
  }

  entry.count += 1
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count }
}

export function clearRateLimit(key: string) {
  attempts.delete(key)
}
