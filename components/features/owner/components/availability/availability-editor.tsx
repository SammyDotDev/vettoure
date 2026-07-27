"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { saveAvailability } from "@/app/owner/actions";
import { DAY_NAMES } from "@/lib/format";
import type { AvailabilitySlot } from "@/lib/types";

interface EditableSlot {
	key: string;
	day_of_week: number;
	start_time: string;
	end_time: string;
}

interface AvailabilityEditorProps {
	initialSlots: AvailabilitySlot[];
}

const selectClass =
	"h-11 rounded-xl border border-border/60 bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AvailabilityEditor({ initialSlots }: AvailabilityEditorProps) {
	const [slots, setSlots] = useState<EditableSlot[]>(
		initialSlots.map((slot) => ({
			key: slot.id,
			day_of_week: slot.day_of_week,
			start_time: slot.start_time.slice(0, 5),
			end_time: slot.end_time.slice(0, 5),
		})),
	);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const addSlot = () => {
		setSlots((prev) => [
			...prev,
			{
				key: crypto.randomUUID(),
				day_of_week: 6,
				start_time: "10:00",
				end_time: "16:00",
			},
		]);
	};

	const updateSlot = (key: string, patch: Partial<EditableSlot>) => {
		setSlots((prev) =>
			prev.map((slot) => (slot.key === key ? { ...slot, ...patch } : slot)),
		);
	};

	const removeSlot = (key: string) => {
		setSlots((prev) => prev.filter((slot) => slot.key !== key));
	};

	const handleSave = () => {
		for (const slot of slots) {
			if (slot.end_time <= slot.start_time) {
				toast.error(
					`${DAY_NAMES[slot.day_of_week]}: end time must be after start time`,
				);
				return;
			}
		}
		const seen = new Set<string>();
		for (const slot of slots) {
			const id = `${slot.day_of_week}-${slot.start_time}`;
			if (seen.has(id)) {
				toast.error(
					`${DAY_NAMES[slot.day_of_week]}: duplicate slot at ${slot.start_time}`,
				);
				return;
			}
			seen.add(id);
		}

		startTransition(async () => {
			const result = await saveAvailability(
				slots.map(({ day_of_week, start_time, end_time }) => ({
					day_of_week,
					start_time,
					end_time,
				})),
			);
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success("Availability saved");
			router.refresh();
		});
	};

	return (
		<div className="flex flex-col gap-4 max-w-2xl">
			{slots.length === 0 && (
				<p className="text-muted-foreground text-sm">
					No inspection windows yet. Buyers can still request a time, but adding
					windows helps them pick a slot you can actually host.
				</p>
			)}

			{slots.map((slot) => (
				<div
					key={slot.key}
					className="bg-white rounded-2xl p-4 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-3"
				>
					<select
						value={slot.day_of_week}
						onChange={(e) =>
							updateSlot(slot.key, { day_of_week: Number(e.target.value) })
						}
						className={`${selectClass} sm:w-40`}
					>
						{DAY_NAMES.map((day, index) => (
							<option key={day} value={index}>
								{day}
							</option>
						))}
					</select>
					<div className="flex items-center gap-2 flex-1">
						<input
							type="time"
							value={slot.start_time}
							onChange={(e) =>
								updateSlot(slot.key, { start_time: e.target.value })
							}
							className={`${selectClass} flex-1`}
						/>
						<span className="text-muted-foreground text-xs font-mono">to</span>
						<input
							type="time"
							value={slot.end_time}
							onChange={(e) =>
								updateSlot(slot.key, { end_time: e.target.value })
							}
							className={`${selectClass} flex-1`}
						/>
					</div>
					<Button
						variant="ghost"
						// size="sm"
						onClick={() => removeSlot(slot.key)}
						className="text-destructive hover:text-destructive text-xs font-semibold self-end sm:self-auto"
					>
						Remove
					</Button>
				</div>
			))}

			<div className="flex flex-col sm:flex-row gap-3">
				<Button
					variant="outline"
					onClick={addSlot}
					className="rounded-xl h-11 font-semibold"
				>
					+ Add window
				</Button>
				<Button
					onClick={handleSave}
					disabled={pending}
					className="rounded-xl h-11 font-semibold sm:ml-auto"
				>
					{pending ? <Spinner /> : "Save availability"}
				</Button>
			</div>
		</div>
	);
}
