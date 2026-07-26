import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Handles the link in the Supabase confirmation email. Supports both the
// token_hash flow (customized email template) and the PKCE code flow
// (default template with emailRedirectTo).
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";

	const supabase = await createClient();

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			redirect(next);
		}
	} else if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(next);
		}
	}

	redirect("/auth?error=confirmation_failed");
}
