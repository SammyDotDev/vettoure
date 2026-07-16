import { SearchBar } from "./search-bar";
import { VideoPlaceholder } from "./video-placeholder";
export function HeroSection() {
	return (
		<section className="lg:max-w-7xl sm:mx-10 w-full justify-between lg:mx-auto grid grid-cols-2 gap-10 px-10 py-14 items-center">
			{/* Left column — copy + search */}
			<div>
				<div className="font-mono text-xs tracking-[0.1em] uppercase text-[#0f3d2e] mb-[18px]">
					<span>//</span> verified remote inspection · abuja
				</div>
				<h1 className="font-sans text-[52px] leading-[1.04] font-extrabold tracking-[-0.03em] m-0">
					Inspect and trust a property from anywhere.
				</h1>
				<p className="font-sans mt-5 text-[17px] leading-[1.6] text-[#55625b] max-w-[460px]">
					Every Vetta listing includes an owner-recorded walkthrough video. Book
					a live guided video inspection with the owner before you commit.
				</p>
				<SearchBar />
				<div className="flex gap-[18px] mt-[22px] font-mono text-[11px] tracking-[0.05em] uppercase text-[#6b756f]">
					<span>✓ owner-verified</span>
					<span>✓ live video inspection</span>
					<span>✓ no agent runaround</span>
				</div>
			</div>
			{/* Right column — video placeholder */}
			<VideoPlaceholder />
		</section>
	);
}
