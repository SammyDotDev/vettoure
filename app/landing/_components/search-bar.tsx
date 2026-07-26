"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
export function SearchBar() {
	const [mode, setMode] = useState<"buy" | "rent">("buy");
	return (
		<div className="flex gap-2 mt-7 bg-[#f6f7f5] border border-[#e4e8e4] rounded-[14px] p-2">
			{/* Buy/Rent toggle */}
			<div className="flex bg-white border border-[#e4e8e4] rounded-[9px] p-[3px] text-[13px] font-semibold">
				<button
					type="button"
					onClick={() => setMode("buy")}
					className={cn(
						"font-sans px-4 py-[9px] rounded-[7px] transition-colors cursor-pointer",
						mode === "buy"
							? "bg-primary text-primary-foreground"
							: "text-[#55625b]",
					)}
				>
					Buy
				</button>
				<button
					type="button"
					onClick={() => setMode("rent")}
					className={cn(
						"font-sans px-4 py-[9px] rounded-[7px] transition-colors cursor-pointer",
						mode === "rent"
							? "bg-primary text-primary-foreground"
							: "text-[#55625b]",
					)}
				>
					Rent
				</button>
			</div>
			{/* Location input */}
			<div className="flex-1 flex items-center bg-white border border-[#e4e8e4] rounded-[9px] px-3.5">
				<Input
					placeholder="City or area — e.g. Maitama"
					className="font-sans border-0 shadow-none focus-visible:ring-0 text-sm text-[#8a948e] placeholder:text-[#8a948e] p-0 h-auto"
				/>
			</div>
			{/* Search button */}
			<Button className="w-auto font-sans px-[22px] py-3 rounded-[9px] text-sm font-semibold">
				Search
			</Button>
		</div>
	);
}
