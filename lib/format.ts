import type { ListingType } from "./types";

export function formatPrice(price: number, listingType: ListingType) {
	const naira = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: 0,
	}).format(price);
	return listingType === "rent" ? `${naira}/yr` : naira;
}

export function formatRequestTime(preferredAt: string | null) {
	if (!preferredAt) return "Requested a time";
	return new Intl.DateTimeFormat("en-NG", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(preferredAt));
}

export function initialsOf(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	return parts
		.slice(0, 2)
		.map((p) => p.charAt(0).toUpperCase())
		.join("");
}

export const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
] as const;
