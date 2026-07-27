import { EmptyState } from "@/components/ui/empty-state";
import { RequestItem } from "@/components/features/owner/components/dashboard/request-item";
import { getOwnerRequests } from "@/lib/data/owner";
import { createClient } from "@/utils/supabase/server";

export default async function RequestsPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const requests = await getOwnerRequests(user!.id);

	const open = requests.filter(
		(r) => r.status === "new" || r.status === "confirmed",
	);
	const closed = requests.filter(
		(r) => r.status === "declined" || r.status === "completed",
	);

	return (
		<>
			<div>
				<h1 className="text-2xl md:text-3xl font-bold text-foreground">
					Inspection requests
				</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Confirm a time, or decline requests you can’t host.
				</p>
			</div>

			{requests.length === 0 ? (
				<EmptyState
					title="No inspection requests yet"
					description="When a buyer books an inspection on one of your live listings, it will show up here."
				/>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">
					<div className="flex flex-col gap-3">
						<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
							{"// open"} ({open.length})
						</span>
						{open.length === 0 ? (
							<EmptyState
								title="All caught up"
								description="No open requests right now."
							/>
						) : (
							open.map((request) => (
								<RequestItem key={request.id} request={request} />
							))
						)}
					</div>
					<div className="flex flex-col gap-3">
						<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
							{"// closed"} ({closed.length})
						</span>
						{closed.length === 0 ? (
							<EmptyState
								title="Nothing closed yet"
								description="Declined and completed inspections will move here."
							/>
						) : (
							closed.map((request) => (
								<RequestItem key={request.id} request={request} />
							))
						)}
					</div>
				</div>
			)}
		</>
	);
}
