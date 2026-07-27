"use client";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createListing } from "@/app/owner/actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

const fieldLabel =
  "text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block";
const fieldInput = "rounded-xl border-border/60 shadow-none bg-transparent";

export const NewListingForm = () => {
  const [listingType, setListingType] = useState<"buy" | "rent">("buy");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const busy = uploading || pending;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const formData = new FormData(form);
    formData.set("listing_type", listingType);
    formData.set("status", submitter?.value === "draft" ? "draft" : "live");

    if (videoFile) {
      if (videoFile.size > MAX_VIDEO_BYTES) {
        toast.error("Video must be under 500MB");
        return;
      }
      setUploading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be signed in");
          return;
        }
        const path = `${user.id}/${crypto.randomUUID()}.mp4`;
        const { error: uploadError } = await supabase.storage
          .from("walkthroughs")
          .upload(path, videoFile, { contentType: videoFile.type });
        if (uploadError) {
          toast.error(`Video upload failed: ${uploadError.message}`);
          return;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("walkthroughs").getPublicUrl(path);
        formData.set("video_url", publicUrl);
      } finally {
        setUploading(false);
      }
    }

    startTransition(async () => {
      const result = await createListing(null, formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        formData.get("status") === "draft"
          ? "Draft saved"
          : "Listing published",
      );
      form.reset();
      setVideoFile(null);
      router.push("/owner/properties");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <Label className={fieldLabel}>Title</Label>
          <Input
            name="title"
            required
            placeholder="e.g. 3-Bed Apartment"
            className={fieldInput}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className={fieldLabel}>Area</Label>
          <Input
            name="area"
            required
            placeholder="Wuse 2"
            className={fieldInput}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className={fieldLabel}>Price (₦)</Label>
          <Input
            name="price"
            required
            placeholder="0"
            type="number"
            min="1"
            className={fieldInput}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label className={fieldLabel}>Buy / Rent</Label>
          <div className="flex h-12 rounded-xl p-1 border border-border/60">
            <button
              type="button"
              className={`flex-1 text-sm font-semibold rounded-lg transition-all ${listingType === "buy" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setListingType("buy")}
            >
              Buy
            </button>
            <button
              type="button"
              className={`flex-1 text-sm font-semibold rounded-lg transition-all ${listingType === "rent" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setListingType("rent")}
            >
              Rent
            </button>
          </div>
        </div>
        <div className="col-span-1">
          <Label className={fieldLabel}>Beds</Label>
          <Input
            name="beds"
            type="number"
            min="0"
            placeholder="3"
            className={fieldInput}
          />
        </div>
        <div className="col-span-1">
          <Label className={fieldLabel}>Baths</Label>
          <Input
            name="baths"
            type="number"
            min="0"
            placeholder="2"
            className={fieldInput}
          />
        </div>
        <div className="col-span-2">
          <Label className={fieldLabel}>Description</Label>
          <textarea
            name="description"
            rows={3}
            placeholder="What makes this property worth inspecting?"
            className="w-full rounded-xl border border-border/60 shadow-none bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div>
        <Label className={fieldLabel}>Walkthrough Video</Label>
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
          <span className="text-sm font-semibold text-foreground px-4 text-center truncate max-w-full">
            {videoFile ? videoFile.name : "Drag a walkthrough video here"}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-1 tracking-wider uppercase">
            MP4 • up to 500MB • 2-6 min recommended
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          value="live"
          disabled={busy}
          className="rounded-xl h-12 text-sm font-semibold"
        >
          {busy ? <Spinner /> : "Publish listing"}
        </Button>
        <Button
          type="submit"
          value="draft"
          variant="outline"
          disabled={busy}
          className="rounded-xl h-12 text-sm font-semibold"
        >
          Save as draft
        </Button>
      </div>
      {uploading && (
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
          Uploading video…
        </p>
      )}
    </form>
  );
};
