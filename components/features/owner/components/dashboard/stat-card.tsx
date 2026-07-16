import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="bg-[#f4f5f4] border border-border/50 rounded-2xl p-5 flex flex-col justify-center">
      <div className="text-3xl font-bold text-foreground leading-none">{value}</div>
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-3">{label}</div>
    </div>
  );
};
