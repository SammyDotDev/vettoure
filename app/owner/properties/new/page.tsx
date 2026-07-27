import Link from "next/link";
import { NewListingForm } from "@/components/features/owner/components/dashboard/new-listing-form";
import { SectionHeader } from "@/components/features/owner/components/dashboard/section-header";

export default function NewListingPage() {
	return (
		<>
			<div className="flex flex-col gap-1">
				<Link
					href="/owner/properties"
					className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-max"
				>
					← My properties
				</Link>
				<h1 className="text-2xl md:text-3xl font-bold text-foreground">
					New listing
				</h1>
				<p className="text-muted-foreground text-sm">
					Publish a property with a verified walkthrough video.
				</p>
			</div>

			<div className="w-full max-w-2xl">
				<SectionHeader>Listing details</SectionHeader>
				<NewListingForm />
			</div>
		</>
	);
}
