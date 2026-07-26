import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Landing from "./landing/page";
import { Toaster } from "sonner";

export default function Home() {
	return (
		<div className="bg-[#eceeeb]">
			<Landing />
		</div>
	);
}
