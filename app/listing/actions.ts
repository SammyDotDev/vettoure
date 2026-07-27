"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResult } from "@/app/owner/actions";

const bookingSchema = z.object({
	property_id: z.string().uuid(),
	preferred_at: z.string().datetime({ offset: true }).nullable(),
	message: z.string().trim().max(1000).optional(),
});

export async function bookInspection(input: {
	property_id: string;
	preferred_at: string | null;
	message?: string;
}): Promise<ActionResult> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { ok: false, error: "Sign in to book an inspection" };

	const parsed = bookingSchema.safeParse(input);
	if (!parsed.success) return { ok: false, error: "Invalid booking details" };

	const { data: property, error: propertyError } = await supabase
		.from("properties")
		.select("id, owner_id, status")
		.eq("id", parsed.data.property_id)
		.maybeSingle();

	if (propertyError) return { ok: false, error: propertyError.message };
	if (!property || property.status !== "live") {
		return { ok: false, error: "This listing is not available" };
	}
	if (property.owner_id === user.id) {
		return { ok: false, error: "You cannot book your own listing" };
	}

	const buyerName =
		[user.user_metadata?.first_name, user.user_metadata?.last_name]
			.filter(Boolean)
			.join(" ") || (user.email ?? "Buyer");

	const { error } = await supabase.from("inspection_requests").insert({
		property_id: property.id,
		owner_id: property.owner_id,
		buyer_id: user.id,
		buyer_name: buyerName,
		buyer_phone: user.user_metadata?.phone ?? "",
		preferred_at: parsed.data.preferred_at,
		message: parsed.data.message ?? null,
	});

	if (error) return { ok: false, error: error.message };
	return { ok: true };
}
