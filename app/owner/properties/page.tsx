import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/features/owner/components/dashboard/status-badge";
import { PropertyActions } from "@/components/features/owner/components/properties/property-actions";
import { getOwnerProperties } from "@/lib/data/owner";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/utils/supabase/server";
import { IconPlus } from "@tabler/icons-react";

export default async function PropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const properties = await getOwnerProperties(user!.id);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My properties
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {properties.length === 0
              ? "Your listings will appear here."
              : `${properties.length} listing${properties.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold rounded-xl h-11 px-6 shadow-none"
        >
          <Link href="/owner/properties/new">
            <IconPlus /> New listing
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Create your first listing with a walkthrough video so buyers can inspect remotely."
          action={
            <Button
              asChild
              variant="outline"
              className="rounded-xl font-semibold"
            >
              <Link href="/owner/properties/new">Create a listing</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3 max-w-7xl">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative bg-white rounded-2xl p-4 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="h-16 w-16 bg-[#e6efe9] rounded-xl flex-shrink-0 hidden sm:block" />
              <div className="flex flex-col flex-1 gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {property.title}
                  </span>
                  <StatusBadge status={property.status} />
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {property.area} •{" "}
                  {formatPrice(property.price, property.listing_type)}
                </span>
              </div>
              <PropertyActions
                propertyId={property.id}
                status={property.status}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
