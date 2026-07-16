import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { MantineProvider } from "@mantine/core";
import { ViewTransition } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: "Vetta",
	description: "verified remote inspection · abuja",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("h-full", "antialiased")}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-full flex flex-col font-sans">
				<ViewTransition>
					<MantineProvider>
						<TooltipProvider>{children}</TooltipProvider>
					</MantineProvider>
				</ViewTransition>
				<Toaster position="top-right" richColors />
			</body>
		</html>
	);
}
