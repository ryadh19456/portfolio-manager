export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'http://localhost:3000'
  const normalizedUrl = configuredUrl.startsWith('http')
    ? configuredUrl
    : `https://${configuredUrl}`

  return new URL(normalizedUrl)
}
