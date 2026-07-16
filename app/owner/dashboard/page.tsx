import { AppSidebar } from "@/components/features/owner/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { StatCard } from "@/components/features/owner/components/dashboard/stat-card";
import { SectionHeader } from "@/components/features/owner/components/dashboard/section-header";
import { RequestItem } from "@/components/features/owner/components/dashboard/request-item";
import { PropertyItem } from "@/components/features/owner/components/dashboard/property-item";
import { NewListingForm } from "@/components/features/owner/components/dashboard/new-listing-form";
import { MessagingPlaceholder } from "@/components/features/owner/components/dashboard/messaging-placeholder";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

const dummyRequests = [
	{
		id: "1",
		initials: "EN",
		name: "Emeka Nwosu",
		propertyTitle: "4-Bedroom Terrace, Maitama",
		dateTime: "Sat 6 Jul • 4:00 PM",
		status: "new" as const,
	},
	{
		id: "2",
		initials: "NA",
		name: "Ngozi Adeyemi",
		propertyTitle: "3-Bed Apartment, Wuse 2",
		dateTime: "Sun 7 Jul • 11:00 AM",
		status: "confirmed" as const,
	},
	{
		id: "3",
		initials: "IS",
		name: "Ibrahim Sani",
		propertyTitle: "4-Bedroom Terrace, Maitama",
		dateTime: "Requested a time",
		status: "pending" as const,
	},
];

const dummyProperties = [
	{
		id: "1",
		title: "4-Bedroom Terrace, Maitama",
		priceDetails: "₦180,000,000",
		status: "live" as const,
	},
	{
		id: "2",
		title: "3-Bed Apartment, Wuse 2",
		priceDetails: "₦4,500,000/yr",
		status: "live" as const,
	},
	{
		id: "3",
		title: "Studio, Lugbe",
		priceDetails: "₦900,000/yr",
		status: "draft" as const,
	},
];

const Dashboard = () => {
	return (
		<SidebarProvider className="bg-white md:bg-background">
			<AppSidebar />

			<div className="flex flex-col flex-1 w-full md:max-h-screen overflow-hidden">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center justify-between px-6 py-5 bg-black shrink-0">
					<div className="text-xl tracking-widest font-semibold uppercase">
						VETTA
					</div>
					<div className="flex items-center gap-2">
						<span className="font-bold text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
							CO
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center font-bold text-xs outline-none">
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
								<DropdownMenuItem className="text-destructive focus:text-destructive">
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-y-auto px-6 pb-12 md:p-8 flex justify-center">
					<div className="w-full flex flex-col md:bg-background md:rounded-[32px] md:p-10 md:border md:border-border/40 h-max gap-8 md:gap-10">
						{/* Greeting (Mobile Only) */}
						<div className="md:hidden flex flex-col">
							<h1 className="text-[28px] font-bold text-foreground tracking-tight">
								Hello, Chidi
							</h1>
						</div>

						{/* Header (Desktop Only) */}
						<div className="hidden md:flex flex-row items-center justify-between gap-4">
							<div>
								<h1 className="text-3xl font-bold text-foreground">Overview</h1>
								<p className="text-muted-foreground text-sm mt-1">
									Manage your listings and inspection requests.
								</p>
							</div>
							<Button className="w-auto bg-primary text-primary-foreground font-semibold rounded-xl h-11 px-6 shadow-none">
								<IconPlus /> New listing
							</Button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<StatCard value="3" label="Listings" />
							<StatCard value="4" label="New Requests" />
							<div className="hidden md:block">
								<StatCard value="17" label="Total Requests" />
							</div>
							<div className="hidden md:block">
								<StatCard value="1.2k" label="Video Views" />
							</div>
						</div>

						{/* Mobile + New Listing button */}
						<div className="md:hidden">
							<Button className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-12 shadow-none text-base">
								+ New listing
							</Button>
						</div>

						{/* Main Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
							{/* Right Column (Mobile shows this first, but Desktop shows it on right - Wait, in design Mobile shows Incoming requests first, then My Properties) */}
							<div className="flex flex-col gap-6 md:gap-10 order-1 lg:order-2">
								<div>
									<SectionHeader>Incoming Inspection Requests</SectionHeader>
									<div className="flex flex-col gap-3">
										{dummyRequests.map((r) => (
											<RequestItem key={r.id} {...r} />
										))}
									</div>
								</div>

								<div className="hidden lg:block mt-auto pb-4">
									<MessagingPlaceholder />
								</div>
							</div>

							{/* Left Column (Mobile shows this second, Desktop shows it left) */}
							<div className="flex flex-col gap-6 md:gap-10 order-2 lg:order-1">
								<div>
									<SectionHeader>My Properties</SectionHeader>
									<div className="flex flex-col gap-3">
										{dummyProperties.map((p) => (
											<PropertyItem key={p.id} {...p} />
										))}
									</div>
								</div>

								{/* New Listing Form is Desktop only based on the design, or at least it shows up in left col */}
								<div className="hidden md:block">
									<SectionHeader>New Listing</SectionHeader>
									<NewListingForm />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default Dashboard;
