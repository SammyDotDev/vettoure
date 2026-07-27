import { AvailabilityEditor } from "@/components/features/owner/components/availability/availability-editor";
import { getOwnerAvailability } from "@/lib/data/owner";
import { createClient } from "@/utils/supabase/server";

export default async function AvailabilityPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const slots = await getOwnerAvailability(user!.id);

	return (
		<>
			<div>
				<h1 className="text-2xl md:text-3xl font-bold text-foreground">
					Availability
				</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Weekly windows when you can host live inspections. Buyers see these
					when booking.
				</p>
			</div>

			<AvailabilityEditor initialSlots={slots} />
		</>
	);
}
