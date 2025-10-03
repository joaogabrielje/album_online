import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = parseInt(searchParams.get('width') || '800')
  const height = parseInt(searchParams.get('height') || '600')
  const text = searchParams.get('text') || 'Photo'
  
  // Criar SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2" rx="8"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy="0.3em">${text}</text>
      <circle cx="${width-30}" cy="30" r="8" fill="#10b981"/>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}