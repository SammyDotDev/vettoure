import { Button } from "@/components/ui/button";
export function CtaBand() {
	return (
		<section className="px-10 py-14 bg-[#051d15] text-white text-center">
			<div className="lg:max-w-7xl sm:mx-10 w-full justify-between items-center lg:mx-auto">
				<h2 className="font-sans text-[32px] font-extrabold tracking-[-0.02em] m-0">
					Ready to inspect from anywhere?
				</h2>
				<p className="font-sans mt-3 mb-6 text-[15px] text-[#aeb9e6]">
					Join buyers and renters across the diaspora inspecting Abuja property
					with confidence.
				</p>
				<Button
					variant="outline"
					className="w-auto font-sans bg-white text-[#101a3d] border-white font-bold text-[15px] px-7 py-3.5 rounded-[10px] hover:bg-white/90 hover:text-[#101a3d]"
				>
					Browse verified listings
				</Button>
			</div>
		</section>
	);
}
