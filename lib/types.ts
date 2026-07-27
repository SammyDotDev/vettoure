export type ListingType = "buy" | "rent";
export type PropertyStatus = "draft" | "live";
export type RequestStatus = "new" | "confirmed" | "declined" | "completed";

export interface Property {
	id: string;
	owner_id: string;
	owner_name: string;
	title: string;
	area: string;
	city: string;
	price: number;
	listing_type: ListingType;
	status: PropertyStatus;
	beds: number | null;
	baths: number | null;
	size_sqm: number | null;
	description: string | null;
	video_url: string | null;
	created_at: string;
	updated_at: string;
}

export interface InspectionRequest {
	id: string;
	property_id: string;
	buyer_id: string;
	owner_id: string;
	buyer_name: string;
	buyer_phone: string;
	preferred_at: string | null;
	message: string | null;
	status: RequestStatus;
	created_at: string;
	property?: Pick<Property, "id" | "title" | "area"> | null;
}

export interface AvailabilitySlot {
	id: string;
	owner_id: string;
	day_of_week: number;
	start_time: string;
	end_time: string;
}
