import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isApiRoute = req.nextUrl.pathname.startsWith('/api/admin');

        const role = token?.role;
        const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

        if (!isAdmin) {
            if (isApiRoute) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
            // Redirect non-admins to the home page
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
