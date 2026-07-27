import { ProfileDropdown } from "@/components/profile-dropdown";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { initialsOf } from "@/lib/format";
import Link from "next/link";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const fullName = [
    user?.user_metadata?.first_name,
    user?.user_metadata?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <nav className="flex px-10 py-5 border-b border-[#eef1ee] lg:max-w-7xl sm:mx-10 w-full justify-between lg:items-center lg:mx-auto">
      <span className="font-mono font-semibold tracking-[0.3em] text-[17px]">
        VETTA
      </span>
      <div className="flex flex-col-reverse items-end md:flex-row lg:items-center gap-4 sm:gap-7 font-sans text-sm font-medium text-[#4d5a54]">
        <div className="flex flex-col items-end lg:flex-row lg:items-center gap-4">
          <Link
            href="/listing"
            className="hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/auth"
            className="hover:text-foreground transition-colors"
          >
            For owners
          </Link>
        </div>
        {isLoggedIn ? (
          <ProfileDropdown
            initials={initialsOf(fullName || (user?.email ?? "?"))}
            isOwner={user?.user_metadata?.role === "owner"}
          />
        ) : (
          <Link
            href="/auth/"
            className="text-[#0f3d2e] font-semibold hover:opacity-80 transition-opacity"
          >
            Log in
          </Link>
        )}
        {!isLoggedIn && (
          <Button
            asChild
            className="w-auto font-sans px-[18px] py-2.5 rounded-[9px] text-sm font-semibold"
          >
            <Link href="/auth">Get started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
