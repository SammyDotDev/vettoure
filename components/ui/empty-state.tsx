import { cn } from "@/lib/utils";

interface EmptyStateProps {
	title: string;
	description: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border/80 bg-[#f7f8f7] px-6 py-12 gap-2",
				className,
			)}
		>
			<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
				{"// nothing here yet"}
			</span>
			<span className="font-semibold text-foreground text-sm">{title}</span>
			<p className="text-muted-foreground text-xs max-w-[280px]">
				{description}
			</p>
			{action && <div className="mt-3">{action}</div>}
		</div>
	);
}
