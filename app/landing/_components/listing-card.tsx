export interface ListingData {
  price: string;
  deal: string;
  title: string;
  area: string;
  beds: number;
  baths: number;
  size: string;
  duration: string;
}
interface ListingCardProps {
  listing: ListingData;
}
export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="border border-[#e6eae6] rounded-[14px] overflow-hidden bg-white group cursor-pointer flex flex-col flex-1 w-[90%] lg:w-auto">
      {/* Image placeholder with video overlay */}
      <div
        className="relative h-[150px]"
        style={{
          background:
            "repeating-linear-gradient(45deg, #e9ede9, #e9ede9 10px, #e2e7e2 10px, #e2e7e2 20px)",
        }}
      >
        {/* Verified badge */}
        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-[5px] bg-[#0f3d2e] text-white font-mono text-[10px] font-semibold px-2 py-1 rounded-full">
          <span>✓</span>Verified
        </div>
        {/* Duration */}
        <div className="absolute bottom-2.5 right-2.5 font-mono text-[10px] bg-[rgba(20,33,29,0.72)] text-white px-[7px] py-[3px] rounded-[5px]">
          {listing.duration}
        </div>
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover:scale-110">
            <div className="w-0 h-0 border-l-[12px] border-l-[#0f3d2e] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-[3px]" />
          </div>
        </div>
      </div>
      {/* Card details */}
      <div className="p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-sans text-[16px] font-extrabold tracking-[-0.01em]">
            {listing.price}
          </span>
          <span className="font-mono text-[9px] tracking-[0.06em] uppercase text-[#0f3d2e] border border-[#c3d2f6] rounded-[5px] px-[5px] py-[2px] shrink-0">
            {listing.deal}
          </span>
        </div>
        <div className="font-sans text-sm font-semibold mt-2 leading-[1.3]">
          {listing.title}
        </div>
        <div className="font-mono text-[11px] text-[#8a948e] mt-1">
          {listing.area}
        </div>
        <div className="flex gap-3.5 mt-3 pt-3 border-t border-[#eef1ee] font-sans text-xs text-[#55625b]">
          <span>{listing.beds} bd</span>
          <span>{listing.baths} ba</span>
          <span>{listing.size}</span>
        </div>
      </div>
    </div>
  );
}
