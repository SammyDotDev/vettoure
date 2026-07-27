import Link from "next/link";
import { Navbar } from "@/app/landing/_components/navbar";
import { Footer } from "@/app/landing/_components/footer";
import { ListingCard } from "@/app/landing/_components/listing-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getLiveListings } from "@/lib/data/listings";
import { formatPrice } from "@/lib/format";

export default async function ListingsPage() {
	const listings = await getLiveListings();

	return (
		<div className="bg-[#eceeeb] min-h-screen flex flex-col">
			<Navbar />
			<main className="w-full lg:max-w-7xl mx-auto px-6 sm:px-10 py-10 flex-1">
				<div className="mb-8">
					<p className="font-mono text-[11px] uppercase tracking-widest text-[#8a948e]">
						{"// browse"}
					</p>
					<h1 className="text-3xl font-extrabold mt-2 text-foreground">
						Verified listings
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Every property comes with a walkthrough video and a bookable live
						inspection.
					</p>
				</div>

				{listings.length === 0 ? (
					<EmptyState
						title="No live listings yet"
						description="Owners are onboarding their properties. Check back soon — or list your own."
						className="bg-white"
					/>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
						{listings.map((listing) => (
							<Link key={listing.id} href={`/listing/${listing.id}`}>
								<ListingCard
									listing={{
										price: formatPrice(listing.price, listing.listing_type),
										deal: listing.listing_type === "rent" ? "For rent" : "For sale",
										title: listing.title,
										area: `${listing.area} · ${listing.city}`,
										beds: listing.beds ?? 0,
										baths: listing.baths ?? 0,
										size: listing.size_sqm ? `${listing.size_sqm} m²` : "—",
										duration: listing.video_url ? "video tour" : "no video yet",
									}}
								/>
							</Link>
						))}
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
