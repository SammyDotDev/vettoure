interface StepCardProps {
	number: string;
	title: string;
	description: string;
}
export function StepCard({ number, title, description }: StepCardProps) {
	return (
		<div className="bg-white border border-[#e6eae6] rounded-[14px] p-6">
			<div className="font-mono text-[13px] font-semibold text-[#0f3d2e] border border-[#c3d2f6] w-[38px] h-[38px] flex items-center justify-center rounded-[10px] mb-4">
				{number}
			</div>
			<div className="font-sans text-[17px] font-bold">{title}</div>
			<p className="font-sans mt-2 text-sm leading-[1.55] text-[#55625b]">
				{description}
			</p>
		</div>
	);
}
