"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteListing, setListingStatus } from "@/app/owner/actions";
import type { PropertyStatus } from "@/lib/types";

interface PropertyActionsProps {
  propertyId: string;
  status: PropertyStatus;
}

export function PropertyActions({ propertyId, status }: PropertyActionsProps) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const router = useRouter();

  const toggleStatus = () => {
    startTransition(async () => {
      const next = status === "live" ? "draft" : "live";
      const result = await setListingStatus(propertyId, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        next === "live" ? "Listing published" : "Listing unpublished",
      );
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    startTransition(async () => {
      const result = await deleteListing(propertyId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Listing deleted");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
      <Button
        variant="outline"
        // size="sm"
        disabled={pending}
        onClick={toggleStatus}
        className="text-xs font-semibold rounded-lg h-8"
      >
        {status === "live" ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant="outline"
        // size="sm"
        disabled={pending}
        onClick={handleDelete}
        className="text-xs font-semibold border-red-500 rounded-lg h-8 text-destructive hover:text-destructive"
      >
        {confirmingDelete ? "Sure?" : "Delete"}
      </Button>
    </div>
  );
}
