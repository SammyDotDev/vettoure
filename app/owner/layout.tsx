import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function OwnerLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth?next=/owner/dashboard");
	}

	if (user.user_metadata?.role !== "owner") {
		redirect("/");
	}

	return <>{children}</>;
}
