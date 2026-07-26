import React from 'react';
import { StatusBadge, StatusType } from './status-badge';

interface PropertyItemProps {
  id: string;
  title: string;
  priceDetails: string;
  status: StatusType;
}

export const PropertyItem = ({ title, priceDetails, status }: PropertyItemProps) => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-border/50 flex items-center gap-4">
      <div className="h-16 w-16 bg-[#e6efe9] rounded-xl flex-shrink-0" />
      <div className="flex flex-col flex-1 gap-1">
        <span className="font-semibold text-foreground text-sm">{title}</span>
        <span className="text-muted-foreground text-[11px]">{priceDetails}</span>
      </div>
      <StatusBadge status={status} />
    </div>
  );
};
