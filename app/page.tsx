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

const InstrumentsData = async () => {
	const supabase = await createClient();
	const { data: instruments } = await supabase.from("instruments").select();
	return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
};

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={100}
					height={20}
					priority
				/>
				<FieldSet className="mt-5">
					<FieldLegend>Profile</FieldLegend>
					<FieldDescription>
						This appears on invoices and emails.
					</FieldDescription>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full name</FieldLabel>
							<Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
							<FieldDescription>
								This appears on invoices and emails.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<Input id="username" autoComplete="off" aria-invalid />
							<FieldError>Choose another username.</FieldError>
						</Field>
						<Field orientation="horizontal">
							<Switch id="newsletter" />
							<FieldLabel htmlFor="newsletter">
								Subscribe to the newsletter
							</FieldLabel>
						</Field>
					</FieldGroup>
				</FieldSet>

				<Button size={"lg"} className="mt-4">
					Log In
				</Button>
				<InstrumentsData />
			</main>
		</div>
	);
}
