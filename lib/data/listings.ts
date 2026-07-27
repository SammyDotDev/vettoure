import { createClient } from "@/utils/supabase/server";
import type { AvailabilitySlot, Property } from "@/lib/types";

export async function getLiveListings() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("*")
		.eq("status", "live")
		.order("created_at", { ascending: false });

	if (error) throw new Error(`Failed to load listings: ${error.message}`);
	return (data ?? []) as Property[];
}

export async function getListingById(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) throw new Error(`Failed to load listing: ${error.message}`);
	return data as Property | null;
}

export async function getListingAvailability(ownerId: string) {
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
