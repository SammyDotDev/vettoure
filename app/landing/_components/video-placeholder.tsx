import { cn } from "@/lib/utils";
interface VideoPlaceholderProps {
	label?: string;
	className?: string;
}
export function VideoPlaceholder({
	label = "owner walkthrough · maitama",
	className,
}: VideoPlaceholderProps) {
	return (
		<div
			className={cn(
				"relative h-[380px] rounded-[18px] overflow-hidden",
				className,
			)}
			style={{
				background:
					"repeating-linear-gradient(45deg, #e9ede9, #e9ede9 12px, #e2e7e2 12px, #e2e7e2 24px)",
			}}
		>
			{/* Verified badge */}
			<div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#0f3d2e] text-white font-mono text-[11px] font-semibold px-2.5 py-[5px] rounded-full">
				<span>✓</span>Verified
			</div>
			{/* Play button + label */}
			<div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
				<div className="w-[76px] h-[76px] rounded-full bg-white/[0.92] flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
					<div className="w-0 h-0 border-l-[22px] border-l-[#0f3d2e] border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1.5" />
				</div>
				<div className="font-mono text-xs tracking-[0.06em] uppercase text-[#5c6862]">
					{label}
				</div>
			</div>
		</div>
	);
}
