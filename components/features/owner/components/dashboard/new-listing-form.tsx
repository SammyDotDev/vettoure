"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const NewListingForm = () => {
  const [listingType, setListingType] = useState<'buy' | 'rent'>('buy');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">Title</Label>
          <Input placeholder="e.g. 3-Bed Apartment" className="rounded-xl border-border/60 shadow-none bg-transparent" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">Area</Label>
          <Input placeholder="Wuse 2" className="rounded-xl border-border/60 shadow-none bg-transparent" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">Price (₦)</Label>
          <Input placeholder="0" type="number" className="rounded-xl border-border/60 shadow-none bg-transparent" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">Buy / Rent</Label>
          <div className="flex h-12 rounded-xl p-1 border border-border/60">
            <button
              type="button"
              className={`flex-1 text-sm font-semibold rounded-lg transition-all ${listingType === 'buy' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setListingType('buy')}
            >
              Buy
            </button>
            <button
              type="button"
              className={`flex-1 text-sm font-semibold rounded-lg transition-all ${listingType === 'rent' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setListingType('rent')}
            >
              Rent
            </button>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">Walkthrough Video</Label>
        <div className="relative w-full h-32 rounded-xl border border-dashed border-border/80 bg-[#f4f5f4] hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer group">
          <input
            type="file"
            accept="video/mp4"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
          <span className="text-xl text-foreground mb-1 group-hover:-translate-y-1 transition-transform">
            ↑
          </span>
          <span className="text-sm font-semibold text-foreground">
            {videoFile ? videoFile.name : 'Drag a walkthrough video here'}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-1 tracking-wider uppercase">
            MP4 • up to 500MB • 2-6 min recommended
          </span>
        </div>
      </div>

      <Button className="w-full rounded-xl h-12 text-sm font-semibold">
        Publish listing
      </Button>
    </div>
  );
};
