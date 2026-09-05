import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const UUID_REGEX = /^\/vendors\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export async function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(UUID_REGEX);
  if (match) {
    const uuid = match[1];
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        const res = await fetch(`${supabaseUrl}/rest/v1/vendors?id=eq.${uuid}&select=id,name`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const slug = (data[0] as any).slug || data[0].name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s_-]+/g, '-');
            if (slug) {
              return NextResponse.redirect(new URL(`/vendors/${slug}`, request.url), 308);
            }
          }
        }
      }
    } catch (e) {
      console.error('Middleware redirect error:', e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendors/:path+'],
};
