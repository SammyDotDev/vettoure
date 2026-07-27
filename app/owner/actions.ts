"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { RequestStatus } from "@/lib/types";

export type ActionResult =
	| { ok: true; id?: string }
	| { ok: false; error: string };

const listingSchema = z.object({
	title: z.string().trim().min(3, "Title is required"),
	area: z.string().trim().min(2, "Area is required"),
	city: z.string().trim().min(2).default("Abuja"),
	price: z.coerce.number().positive("Price must be greater than zero"),
	listing_type: z.enum(["buy", "rent"]),
	status: z.enum(["draft", "live"]).default("live"),
	beds: z.coerce.number().int().min(0).optional(),
	baths: z.coerce.number().int().min(0).optional(),
	size_sqm: z.coerce.number().positive().optional(),
	description: z.string().trim().max(2000).optional(),
	video_url: z.string().url().optional(),
});

async function requireOwner() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { supabase, user: null, error: "You must be signed in" };
	if (user.user_metadata?.role !== "owner")
		return { supabase, user: null, error: "Only owners can do this" };
	return { supabase, user, error: null };
}

function revalidateOwnerScreens() {
	revalidatePath("/owner/dashboard");
	revalidatePath("/owner/properties");
	revalidatePath("/owner/requests");
	revalidatePath("/listing");
}

export async function createListing(
	_prev: ActionResult | null,
	formData: FormData,
): Promise<ActionResult> {
	const { supabase, user, error: authError } = await requireOwner();
	if (!user) return { ok: false, error: authError! };

	const raw = Object.fromEntries(
		[...formData.entries()].filter(([, v]) => v !== ""),
	);
	const parsed = listingSchema.safeParse(raw);
	if (!parsed.success) {
		return { ok: false, error: parsed.error.issues[0].message };
	}

	const ownerName = [
		user.user_metadata?.first_name,
		user.user_metadata?.last_name,
	]
		.filter(Boolean)
		.join(" ");

	const { data, error } = await supabase
		.from("properties")
		.insert({ ...parsed.data, owner_id: user.id, owner_name: ownerName })
		.select("id")
		.single();

	if (error) return { ok: false, error: error.message };

	revalidateOwnerScreens();
	return { ok: true, id: data.id };
}

export async function setListingStatus(
	propertyId: string,
	status: "draft" | "live",
): Promise<ActionResult> {
	const { supabase, user, error: authError } = await requireOwner();
	if (!user) return { ok: false, error: authError! };

	const { error } = await supabase
		.from("properties")
		.update({ status })
		.eq("id", propertyId)
		.eq("owner_id", user.id);

	if (error) return { ok: false, error: error.message };

	revalidateOwnerScreens();
	return { ok: true };
}

export async function deleteListing(propertyId: string): Promise<ActionResult> {
	const { supabase, user, error: authError } = await requireOwner();
	if (!user) return { ok: false, error: authError! };

	const { error } = await supabase
		.from("properties")
		.delete()
		.eq("id", propertyId)
		.eq("owner_id", user.id);

	if (error) return { ok: false, error: error.message };

	revalidateOwnerScreens();
	return { ok: true };
}

export async function updateRequestStatus(
	requestId: string,
	status: RequestStatus,
): Promise<ActionResult> {
	const { supabase, user, error: authError } = await requireOwner();
	if (!user) return { ok: false, error: authError! };

	const { error } = await supabase
		.from("inspection_requests")
		.update({ status })
		.eq("id", requestId)
		.eq("owner_id", user.id);

	if (error) return { ok: false, error: error.message };

	revalidateOwnerScreens();
	return { ok: true };
}

const slotSchema = z.object({
	day_of_week: z.number().int().min(0).max(6),
	start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time"),
	end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time"),
});

export async function saveAvailability(
	slots: Array<z.infer<typeof slotSchema>>,
): Promise<ActionResult> {
	const { supabase, user, error: authError } = await requireOwner();
	if (!user) return { ok: false, error: authError! };

	const parsed = z.array(slotSchema).max(50).safeParse(slots);
	if (!parsed.success) return { ok: false, error: "Invalid availability" };

	for (const slot of parsed.data) {
		if (slot.end_time <= slot.start_time) {
			return { ok: false, error: "End time must be after start time" };
		}
	}

	// Replace-all semantics: clear the owner's schedule, then write the new one.
	const { error: deleteError } = await supabase
		.from("availability_slots")
		.delete()
		.eq("owner_id", user.id);
	if (deleteError) return { ok: false, error: deleteError.message };

	if (parsed.data.length > 0) {
		const { error: insertError } = await supabase
			.from("availability_slots")
			.insert(parsed.data.map((slot) => ({ ...slot, owner_id: user.id })));
		if (insertError) return { ok: false, error: insertError.message };
	}

	revalidatePath("/owner/availability");
	return { ok: true };
}
