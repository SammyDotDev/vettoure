import React from 'react';

export const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase flex items-center gap-2 mb-4">
      <span className="opacity-50">//</span> {children}
    </h3>
  );
};
