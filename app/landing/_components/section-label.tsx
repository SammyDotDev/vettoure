import { cn } from "@/lib/utils";

interface SectionLabelProps {
	label: string;
	className?: string;
}

export function SectionLabel({ label, className }: SectionLabelProps) {
	return (
		<div
			className={cn(
				"font-mono text-xs tracking-[0.12em] uppercase text-[#96a09a]",
				className,
			)}
		>
			<span className="text-[#0f3d2e]">//</span> {label}
		</div>
	);
}
