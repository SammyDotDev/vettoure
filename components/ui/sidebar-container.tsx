import React from "react";

const SidebarContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-screen w-full flex flex-col bg-background">
			{children}
		</div>
	);
};

export default SidebarContainer;
