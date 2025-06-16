import { NextRequest, NextResponse } from "next/server";
import { Locales } from "./constants/locale";
import createMiddleware from "next-intl/middleware";

export const config = {
    // Match only internationalized pathnames
    matcher: [
        /* Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - .dotfiles
         */
        {
            source: '/((?!_next/image|api|.*\\..*).*)',
        },
        '/',
    ],
};

const handleI18nRouting = createMiddleware({
    locales: Locales,
    defaultLocale: 'en-US',
    localePrefix: 'never',
    alternateLinks: false,
});

export default async function middleware(request: NextRequest, response: NextResponse) {
    response = handleI18nRouting(request);
    return response;
}