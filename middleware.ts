// middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest | any) {


    const session: any = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET })
    const { pathname } = req.nextUrl;
    const validRoles = ['admin', 'super-user', 'SEO'];

    if (pathname === '/api/admin/dashboard') {
        if (!session) {
            return new NextResponse(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        if ((!validRoles.includes(session.user.role))) {
            return new NextResponse(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }

    if (pathname === '/api/admin/users') {
        if (!session) {
            return new NextResponse(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        if ((!validRoles.includes(session.user.role))) {
            return new NextResponse(JSON.stringify({ message: 'No autorizado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }

    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `p=${req.nextUrl.pathname}`
        // return NextResponse.redirect(`/auth/login?p=${requestedPage}`);
        return NextResponse.redirect(url);
    }



    if (pathname === '/admin') {
        if (!validRoles.includes(session.user.role)) {
            const url = req.nextUrl.clone();
            url.pathname = '';
            return NextResponse.redirect(url)
        }
    }


    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/checkout/:path*',
        '/admin',
        '/api/admin/dashboard'
    ],
}