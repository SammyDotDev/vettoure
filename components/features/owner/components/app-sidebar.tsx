"use client";

import {
	Sidebar,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AppSidebar = () => {
	const pathname = usePathname();

	const navItems = [
		{ name: "Overview", href: "/owner/dashboard" },
		{ name: "My properties", href: "/owner/properties" },
		{ name: "Inspection requests", href: "/owner/requests" },
		{ name: "Availability", href: "/owner/availability" },
	];

	return (
		<Sidebar className="text-white" variant="floating">
			<SidebarHeader className="p-6">
				<div className="text-xl tracking-widest font-semibold uppercase mb-4">
					VETTA
					<div className="text-[9px] text-gray-400 mt-1">OWNER WORKSPACE</div>
				</div>
			</SidebarHeader>
			<SidebarMenu className="px-4 gap-2 flex-1">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton
								isActive={isActive}
								asChild
								className={`
									h-11 px-4 text-sm font-medium transition-all
									${isActive ? "bg-white/5 text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-white before:rounded-full relative" : "text-gray-400 hover:bg-white/5 hover:text-white"}
								`}
							>
								<Link href={item.href}>{item.name}</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
			<SidebarFooter className="p-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
						CO
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-white">
							Chidi Okafor
						</span>
						<span className="text-[10px] text-gray-400 flex items-center gap-1">
							<svg
								className="w-3 h-3 text-green-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							verified owner
						</span>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
};
