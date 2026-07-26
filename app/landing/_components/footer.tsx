import Link from "next/link";
export function Footer() {
	return (
		<footer className="flex justify-between items-center px-10 py-8 border-t border-[#eef1ee] text-[13px] text-[#8a948e]">
			<span className="font-mono tracking-[0.28em] font-semibold text-[#14211d]">
				VETTA
			</span>
			<div className="flex gap-7">
				<Link href="#" className="hover:text-foreground transition-colors">
					Browse
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					How it works
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					For owners
				</Link>
				<Link href="#" className="hover:text-foreground transition-colors">
					Support
				</Link>
			</div>
			<span className="font-mono">© 2026 · abuja, ng</span>
		</footer>
	);
}
