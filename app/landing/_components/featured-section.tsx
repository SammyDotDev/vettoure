import { ListingCard, type ListingData } from "./listing-card";
import { SectionLabel } from "./section-label";
const FEATURED_LISTINGS: ListingData[] = [
	{
		price: "₦85,000,000",
		deal: "For sale",
		title: "3-Bed Semi-Detached Duplex",
		area: "Wuse 2, Abuja",
		beds: 3,
		baths: 4,
		size: "320 m²",
		duration: "03:45",
	},
	{
		price: "₦3,500,000/yr",
		deal: "For rent",
		title: "2-Bed Luxury Apartment",
		area: "Maitama, Abuja",
		beds: 2,
		baths: 3,
		size: "180 m²",
		duration: "02:58",
	},
	{
		price: "₦120,000,000",
		deal: "For sale",
		title: "5-Bed Detached Duplex",
		area: "Asokoro, Abuja",
		beds: 5,
		baths: 6,
		size: "520 m²",
		duration: "05:12",
	},
	{
		price: "₦45,000,000",
		deal: "For sale",
		title: "4-Bed Terrace Duplex",
		area: "Gwarinpa, Abuja",
		beds: 4,
		baths: 5,
		size: "380 m²",
		duration: "04:30",
	},
];
export function FeaturedSection() {
	return (
		<section className="lg:max-w-7xl sm:mx-10 w-full justify-between items-center lg:mx-auto pt-2 pb-12 px-10">
			<div className="flex items-baseline justify-between mb-5">
				<SectionLabel label="featured verified listings" />
				<span className="font-sans text-sm font-semibold text-[#0f3d2e] cursor-pointer hover:opacity-80 transition-opacity">
					View all →
				</span>
			</div>
			<div className="grid grid-cols-4 gap-5">
				{FEATURED_LISTINGS.map((listing, i) => (
					<ListingCard key={i} listing={listing} />
				))}
			</div>
		</section>
	);
}
