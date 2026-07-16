import { Button } from "@/components/ui/button";
import Link from "next/link";
export function Navbar() {
	return (
		<nav className="flex px-10 py-5 border-b border-[#eef1ee] lg:max-w-7xl sm:mx-10 w-full justify-between items-center lg:mx-auto">
			<span className="font-mono font-semibold tracking-[0.3em] text-[17px]">
				VETTA
			</span>
			<div className="flex items-center gap-7 font-sans text-sm font-medium text-[#4d5a54]">
				<Link href="#" className="hover:text-foreground transition-colors">
					Browse
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					How it works
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					For owners
				</Link>
				<Link
					href="/auth"
					className="text-[#0f3d2e] font-semibold hover:opacity-80 transition-opacity"
				>
					Log in
				</Link>
				<Button className="w-auto font-sans px-[18px] py-2.5 rounded-[9px] text-sm font-semibold">
					Get started
				</Button>
			</div>
		</nav>
	);
}
