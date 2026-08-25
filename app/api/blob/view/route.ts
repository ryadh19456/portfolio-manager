import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')

  if (!pathname) {
    return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
  }

  try {
    const result = await get(pathname, { access: 'private' })

    if (!result || result.statusCode !== 200) {
      return new NextResponse('Not found', { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
