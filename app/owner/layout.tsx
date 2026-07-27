import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AppSidebar } from "@/components/features/owner/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SignOutMenuItem } from "@/components/features/owner/components/sign-out-menu-item";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initialsOf } from "@/lib/format";

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

	const fullName =
		[user.user_metadata?.first_name, user.user_metadata?.last_name]
			.filter(Boolean)
			.join(" ") || "Owner";
	const initials = initialsOf(fullName);

	return (
		<SidebarProvider className="bg-white md:bg-background">
			<AppSidebar name={fullName} initials={initials} />

			<div className="flex flex-col flex-1 w-full md:max-h-screen overflow-hidden">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center justify-between px-6 py-5 bg-black shrink-0">
					<div className="text-xl tracking-widest font-semibold uppercase text-white">
						VETTA
					</div>
					<div className="flex items-center gap-2">
						<span className="font-bold text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
							{initials}
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center font-bold text-xs outline-none text-white">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4ZM12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6Z"
											fill="currentColor"
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M4 18C4 15.7909 5.79086 14 8 14H16C18.2091 14 20 15.7909 20 18V20H4V18ZM8 16C6.89543 16 6 16.8954 6 18V18H18V18C18 16.8954 17.1046 16 16 16H8Z"
											fill="currentColor"
										/>
									</svg>
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Settings</DropdownMenuItem>
								<SignOutMenuItem />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-y-auto px-6 pb-12 md:p-8 flex justify-center">
					<div className="w-full flex flex-col md:bg-background md:rounded-[32px] md:p-10 md:border md:border-border/40 h-max gap-8 md:gap-10">
						{children}
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
