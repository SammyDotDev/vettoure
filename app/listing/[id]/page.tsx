import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/app/landing/_components/navbar";
import { Footer } from "@/app/landing/_components/footer";
import { BookingForm } from "@/components/features/listing/booking-form";
import { Button } from "@/components/ui/button";
import { getListingAvailability, getListingById } from "@/lib/data/listings";
import { formatPrice, initialsOf } from "@/lib/format";
import { createClient } from "@/utils/supabase/server";

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ListingDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	if (!UUID_RE.test(id)) notFound();

	const listing = await getListingById(id);
	if (!listing) notFound();

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [availability] = await Promise.all([
		getListingAvailability(listing.owner_id),
	]);

	const isOwnListing = user?.id === listing.owner_id;

	const facts = [
		listing.beds != null ? `${listing.beds} bd` : null,
		listing.baths != null ? `${listing.baths} ba` : null,
		listing.size_sqm != null ? `${listing.size_sqm} m²` : null,
	].filter(Boolean);

	return (
		<div className="bg-[#eceeeb] min-h-screen flex flex-col">
			<Navbar />
			<main className="w-full lg:max-w-7xl mx-auto px-6 sm:px-10 py-10 flex-1">
				<Link
					href="/listing"
					className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
				>
					← All listings
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 mt-6">
					{/* Left: media + details */}
					<div className="flex flex-col gap-6 min-w-0">
						<div className="rounded-2xl overflow-hidden bg-[#dfe5df] border border-[#e6eae6]">
							{listing.video_url ? (
								<video
									src={listing.video_url}
									controls
									playsInline
									className="w-full aspect-video object-cover bg-black"
								/>
							) : (
								<div
									className="w-full aspect-video flex items-center justify-center"
									style={{
										background:
											"repeating-linear-gradient(45deg, #e9ede9, #e9ede9 10px, #e2e7e2 10px, #e2e7e2 20px)",
									}}
								>
									<span className="font-mono text-[11px] uppercase tracking-widest text-[#8a948e]">
										walkthrough video coming soon
									</span>
								</div>
							)}
						</div>

						<div className="bg-white rounded-2xl border border-[#e6eae6] p-6 sm:p-8">
							<div className="flex flex-wrap items-baseline justify-between gap-3">
								<h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
									{listing.title}
								</h1>
								<span className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#0f3d2e] border border-[#c3d2f6] rounded-[5px] px-[6px] py-[3px]">
									{listing.listing_type === "rent" ? "For rent" : "For sale"}
								</span>
							</div>
							<p className="font-mono text-xs text-[#8a948e] mt-2">
								{listing.area} · {listing.city}
							</p>
							<p className="text-2xl font-extrabold text-[#0f3d2e] mt-4">
								{formatPrice(listing.price, listing.listing_type)}
							</p>

							{facts.length > 0 && (
								<div className="flex gap-4 mt-4 pt-4 border-t border-[#eef1ee] text-sm text-[#55625b]">
									{facts.map((fact) => (
										<span key={fact}>{fact}</span>
									))}
								</div>
							)}

							{listing.description && (
								<div className="mt-6">
									<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
										{"// about this property"}
									</span>
									<p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
										{listing.description}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Right: owner + booking */}
					<div className="flex flex-col gap-6">
						<div className="bg-white rounded-2xl border border-[#e6eae6] p-6">
							<div className="flex items-center gap-3">
								<div className="w-11 h-11 rounded-full bg-[#e6efe9] flex items-center justify-center font-bold text-sm text-[#0f3d2e]">
									{initialsOf(listing.owner_name || "Owner")}
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-semibold text-foreground">
										{listing.owner_name || "Property owner"}
									</span>
									<span className="text-[10px] text-muted-foreground flex items-center gap-1">
										<span className="text-green-600">✓</span> verified owner
									</span>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-2xl border border-[#e6eae6] p-6">
							<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">
								{"// book a live inspection"}
							</span>

							{isOwnListing ? (
								<p className="text-sm text-muted-foreground">
									This is your listing — inspection requests from buyers will
									appear in your dashboard.
								</p>
							) : user ? (
								<BookingForm
									propertyId={listing.id}
									availability={availability}
								/>
							) : (
								<div className="flex flex-col gap-3">
									<p className="text-sm text-muted-foreground">
										Sign in to request a live guided inspection with the owner.
									</p>
									<Button
										asChild
										className="w-full rounded-xl h-12 text-sm font-semibold"
									>
										<Link
											href={`/auth?next=${encodeURIComponent(`/listing/${listing.id}`)}`}
										>
											Sign in to book
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
