import React from "react";
import { StatusBadge, StatusType } from "./status-badge";
import { Button } from "@/components/ui/button";

interface RequestItemProps {
	id: string;
	initials: string;
	name: string;
	propertyTitle: string;
	dateTime: string;
	status: StatusType;
}

export const RequestItem = ({
	initials,
	name,
	propertyTitle,
	dateTime,
	status,
}: RequestItemProps) => {
	return (
		<div className="bg-white rounded-2xl p-4 border border-border/50 flex flex-col gap-4">
			<div className="flex justify-between items-start">
				<div className="flex gap-3">
					<div className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
						{initials}
					</div>
					<div className="flex flex-col">
						<span className="font-semibold text-foreground text-sm">
							{name}
						</span>
						<span className="text-muted-foreground text-[11px] mt-1">
							{propertyTitle}
						</span>
						<span className="text-muted-foreground text-[11px]">
							{dateTime}
						</span>
					</div>
				</div>
				<StatusBadge status={status} />
			</div>

			{(status === "new" || status === "pending") && (
				<div className="flex gap-2 mt-2">
					<Button
						variant="default"
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Confirm
					</Button>
					<Button
						variant="outline"
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Reschedule
					</Button>
				</div>
			)}
			{status === "confirmed" && (
				<div className="flex gap-2 mt-2">
					<Button
						variant="default"
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Confirm
					</Button>
					<Button
						variant="outline"
						className="w-1/2 text-xs font-semibold rounded-xl h-10"
					>
						Reschedule
					</Button>
				</div>
			)}
		</div>
	);
};
