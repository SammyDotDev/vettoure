import { log } from "console";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
		},
	);
	// IMPORTANT: Do not run code between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.
	const {
		data: { user },
  } = await supabase.auth.getUser()

  console.log(user)

	const { pathname } = request.nextUrl;
	const role = user?.user_metadata?.role as string | undefined;

	// Any response we build ourselves must carry the refreshed auth cookies,
	// otherwise the browser and server sessions desync.
	const redirectTo = (path: string, search?: string) => {
		const url = request.nextUrl.clone();
		url.pathname = path;
		url.search = search ?? "";
		const redirectResponse = NextResponse.redirect(url);
		supabaseResponse.cookies.getAll().forEach((cookie) => {
			redirectResponse.cookies.set(cookie);
		});
		return redirectResponse;
	};

	// Protected owner workspace: must be signed in with the owner role
	if (pathname.startsWith("/owner")) {
		if (!user) {
			return redirectTo("/auth", `?next=${encodeURIComponent(pathname)}`);
		}
		if (role !== "owner") {
			return redirectTo("/listing");
		}
	}

	// Signed-in users have no business on the auth screen
	if (pathname === "/auth" && user) {
		return redirectTo(role === "owner" ? "/owner/dashboard" : "/listing");
	}

	return supabaseResponse;
}
