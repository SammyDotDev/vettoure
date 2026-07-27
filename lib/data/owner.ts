import { createClient } from "@/utils/supabase/server";
import type {
	AvailabilitySlot,
	InspectionRequest,
	Property,
} from "@/lib/types";

export async function getOwnerProperties(ownerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("*")
		.eq("owner_id", ownerId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(`Failed to load properties: ${error.message}`);
	return (data ?? []) as Property[];
}

export async function getOwnerRequests(ownerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("inspection_requests")
		.select("*, property:properties(id, title, area)")
		.eq("owner_id", ownerId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(`Failed to load requests: ${error.message}`);
	return (data ?? []) as InspectionRequest[];
}

export async function getOwnerAvailability(ownerId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("availability_slots")
		.select("*")
		.eq("owner_id", ownerId)
		.order("day_of_week")
		.order("start_time");

	if (error) throw new Error(`Failed to load availability: ${error.message}`);
	return (data ?? []) as AvailabilitySlot[];
}

export interface OwnerStats {
	listings: number;
	newRequests: number;
	totalRequests: number;
}

export async function getOwnerStats(ownerId: string): Promise<OwnerStats> {
	const supabase = await createClient();

	const [listings, newRequests, totalRequests] = await Promise.all([
		supabase
			.from("properties")
			.select("id", { count: "exact", head: true })
			.eq("owner_id", ownerId),
		supabase
			.from("inspection_requests")
			.select("id", { count: "exact", head: true })
			.eq("owner_id", ownerId)
			.eq("status", "new"),
		supabase
			.from("inspection_requests")
			.select("id", { count: "exact", head: true })
			.eq("owner_id", ownerId),
	]);

	return {
		listings: listings.count ?? 0,
		newRequests: newRequests.count ?? 0,
		totalRequests: totalRequests.count ?? 0,
	};
}
