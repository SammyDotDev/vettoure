"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { bookInspection } from "@/app/listing/actions";
import { DAY_NAMES } from "@/lib/format";
import type { AvailabilitySlot } from "@/lib/types";

interface BookingFormProps {
	propertyId: string;
	availability: AvailabilitySlot[];
}

export function BookingForm({ propertyId, availability }: BookingFormProps) {
	const [preferredAt, setPreferredAt] = useState("");
	const [message, setMessage] = useState("");
	const [booked, setBooked] = useState(false);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (preferredAt && availability.length > 0) {
			const picked = new Date(preferredAt);
			const day = picked.getDay();
			const time = preferredAt.slice(11, 16);
			const fits = availability.some(
				(slot) =>
					slot.day_of_week === day &&
					slot.start_time.slice(0, 5) <= time &&
					time < slot.end_time.slice(0, 5),
			);
			if (!fits) {
				toast.error(
					"That time is outside the owner's inspection windows — pick a time inside one, or leave the time blank to let the owner suggest one.",
				);
				return;
			}
		}

		startTransition(async () => {
			const result = await bookInspection({
				property_id: propertyId,
				preferred_at: preferredAt ? new Date(preferredAt).toISOString() : null,
				message: message || undefined,
			});
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			setBooked(true);
			toast.success("Inspection requested — the owner will confirm your time");
			router.refresh();
		});
	};

	if (booked) {
		return (
			<div className="rounded-2xl border border-[#e6efe9] bg-[#f2f7f4] p-6 text-center flex flex-col gap-2">
				<span className="font-mono text-[10px] uppercase tracking-widest text-primary">
					{"// request sent"}
				</span>
				<p className="font-semibold text-foreground text-sm">
					Your inspection request is with the owner.
				</p>
				<p className="text-muted-foreground text-xs">
					You’ll be able to join a live guided walkthrough once they confirm.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{availability.length > 0 && (
				<div className="rounded-xl bg-[#f4f5f4] border border-border/50 p-4">
					<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
						{"// owner's inspection windows"}
					</span>
					<ul className="text-xs text-foreground flex flex-col gap-1">
						{availability.map((slot) => (
							<li key={slot.id}>
								<span className="font-semibold">
									{DAY_NAMES[slot.day_of_week]}s
								</span>{" "}
								{slot.start_time.slice(0, 5)}–{slot.end_time.slice(0, 5)}
							</li>
						))}
					</ul>
				</div>
			)}

			<div>
				<label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">
					Preferred time (optional)
				</label>
				<input
					type="datetime-local"
					value={preferredAt}
					onChange={(e) => setPreferredAt(e.target.value)}
					className="w-full h-12 rounded-xl border border-border/60 bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
				/>
			</div>

			<div>
				<label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">
					Message to the owner (optional)
				</label>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={3}
					maxLength={1000}
					placeholder="I'm relocating in September and would love a live tour…"
					className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
				/>
			</div>

			<Button
				type="submit"
				disabled={pending}
				className="w-full rounded-xl h-12 text-sm font-semibold"
			>
				{pending ? <Spinner /> : "Request live inspection"}
			</Button>
		</form>
	);
}
