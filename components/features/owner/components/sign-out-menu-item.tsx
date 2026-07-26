"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const SignOutMenuItem = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/auth");
		router.refresh();
	};

	return (
		<DropdownMenuItem
			onSelect={handleSignOut}
			className="text-destructive focus:text-destructive"
		>
			Log out
		</DropdownMenuItem>
	);
};
