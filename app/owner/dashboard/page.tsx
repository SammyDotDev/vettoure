import Link from "next/link";
import { StatCard } from "@/components/features/owner/components/dashboard/stat-card";
import { SectionHeader } from "@/components/features/owner/components/dashboard/section-header";
import { RequestItem } from "@/components/features/owner/components/dashboard/request-item";
import { PropertyItem } from "@/components/features/owner/components/dashboard/property-item";
import { NewListingForm } from "@/components/features/owner/components/dashboard/new-listing-form";
import { MessagingPlaceholder } from "@/components/features/owner/components/dashboard/messaging-placeholder";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconPlus } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/server";
import {
	getOwnerProperties,
	getOwnerRequests,
	getOwnerStats,
} from "@/lib/data/owner";
import { formatPrice } from "@/lib/format";

const Dashboard = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [stats, requests, properties] = await Promise.all([
		getOwnerStats(user!.id),
		getOwnerRequests(user!.id),
		getOwnerProperties(user!.id),
	]);

	const firstName = (user!.user_metadata?.first_name as string) || "there";
	const openRequests = requests
		.filter((r) => r.status === "new" || r.status === "confirmed")
		.slice(0, 4);
	const recentProperties = properties.slice(0, 4);

	return (
		<>
			{/* Greeting (Mobile Only) */}
			<div className="md:hidden flex flex-col">
				<h1 className="text-[28px] font-bold text-foreground tracking-tight">
					Hello, {firstName}
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
				<Button
					asChild
					className="w-auto bg-primary text-primary-foreground font-semibold rounded-xl h-11 px-6 shadow-none"
				>
					<Link href="/owner/properties/new">
						<IconPlus /> New listing
					</Link>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard value={String(stats.listings)} label="Listings" />
				<StatCard value={String(stats.newRequests)} label="New Requests" />
				<div className="hidden md:block">
					<StatCard value={String(stats.totalRequests)} label="Total Requests" />
				</div>
				<div className="hidden md:block">
					<StatCard
						value={String(properties.filter((p) => p.status === "live").length)}
						label="Live Listings"
					/>
				</div>
			</div>

			{/* Mobile + New Listing button */}
			<div className="md:hidden">
				<Button
					asChild
					className="w-full bg-primary text-primary-foreground font-semibold rounded-xl h-12 shadow-none text-base"
				>
					<Link href="/owner/properties/new">+ New listing</Link>
				</Button>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
				<div className="flex flex-col gap-6 md:gap-10 order-1 lg:order-2">
					<div>
						<SectionHeader>Incoming Inspection Requests</SectionHeader>
						{openRequests.length === 0 ? (
							<EmptyState
								title="No open requests"
								description="When buyers request inspections on your live listings, they land here."
							/>
						) : (
							<div className="flex flex-col gap-3">
								{openRequests.map((request) => (
									<RequestItem key={request.id} request={request} />
								))}
							</div>
						)}
					</div>

					<div className="hidden lg:block mt-auto pb-4">
						<MessagingPlaceholder />
					</div>
				</div>

				<div className="flex flex-col gap-6 md:gap-10 order-2 lg:order-1">
					<div>
						<SectionHeader>My Properties</SectionHeader>
						{recentProperties.length === 0 ? (
							<EmptyState
								title="No properties yet"
								description="Publish your first listing to start receiving inspection requests."
							/>
						) : (
							<div className="flex flex-col gap-3">
								{recentProperties.map((property) => (
									<PropertyItem
										key={property.id}
										id={property.id}
										title={property.title}
										priceDetails={formatPrice(
											property.price,
											property.listing_type,
										)}
										status={property.status}
									/>
								))}
							</div>
						)}
					</div>

					<div className="hidden md:block">
						<SectionHeader>New Listing</SectionHeader>
						<NewListingForm />
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
