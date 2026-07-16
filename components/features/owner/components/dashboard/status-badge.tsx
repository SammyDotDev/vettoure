import { cn } from "@/lib/utils";

export type StatusType = 'new' | 'confirmed' | 'pending' | 'live' | 'draft';

export const StatusBadge = ({ status, className }: { status: StatusType, className?: string }) => {
  const variants: Record<StatusType, string> = {
    new: "bg-orange-100 text-orange-600",
    confirmed: "bg-gray-200 text-gray-700",
    pending: "bg-gray-100 text-gray-500",
    live: "bg-[#e6efe9] text-primary",
    draft: "bg-gray-100 text-gray-500",
  };

  return (
    <span className={cn("text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", variants[status], className)}>
      {status}
    </span>
  );
};
