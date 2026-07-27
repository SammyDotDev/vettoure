"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { updateRequestStatus } from "@/app/owner/actions";
import type { InspectionRequest, RequestStatus } from "@/lib/types";
import { formatRequestTime, initialsOf } from "@/lib/format";

interface RequestItemProps {
	request: InspectionRequest;
}

export const RequestItem = ({ request }: RequestItemProps) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const setStatus = (status: RequestStatus) => {
		startTransition(async () => {
			const result = await updateRequestStatus(request.id, status);
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			toast.success(
				status === "confirmed"
					? "Inspection confirmed"
					: status === "declined"
						? "Request declined"
						: "Inspection marked completed",
			);
			router.refresh();
		});
	};

	return (
		<div className="bg-white rounded-2xl p-4 border border-border/50 flex flex-col gap-4">
			<div className="flex justify-between items-start gap-2">
				<div className="flex gap-3 min-w-0">
					<div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm shrink-0">
						{initialsOf(request.buyer_name)}
					</div>
					<div className="flex flex-col min-w-0">
						<span className="font-semibold text-foreground text-sm truncate">
							{request.buyer_name || "Buyer"}
						</span>
						<span className="text-muted-foreground text-[11px] mt-1 truncate">
							{request.property?.title ?? "Listing removed"}
						</span>
						<span className="text-muted-foreground text-[11px]">
							{formatRequestTime(request.preferred_at)}
						</span>
						{request.message && (
							<p className="text-muted-foreground text-[11px] mt-1 italic line-clamp-2">
								“{request.message}”
							</p>
						)}
					</div>
				</div>
				<StatusBadge status={request.status} />
			</div>

			{request.status === "new" && (
				<div className="flex gap-2 mt-2">
					<Button
						variant="default"
						disabled={pending}
						onClick={() => setStatus("confirmed")}
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Confirm
					</Button>
					<Button
						variant="outline"
						disabled={pending}
						onClick={() => setStatus("declined")}
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Decline
					</Button>
				</div>
			)}
			{request.status === "confirmed" && (
				<div className="flex gap-2 mt-2">
					<Button
						variant="default"
						disabled={pending}
						onClick={() => setStatus("completed")}
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Mark completed
					</Button>
					<Button
						variant="outline"
						disabled={pending}
						onClick={() => setStatus("declined")}
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Decline
					</Button>
				</div>
			)}
		</div>
	);
};
