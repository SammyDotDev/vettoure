import { SectionLabel } from "./section-label";
import { StepCard } from "./step-card";
const STEPS = [
  {
    number: "01",
    title: "Browse verified listings",
    description:
      "Each listing includes a walkthrough video recorded by the owner, so you see the real home.",
  },
  {
    number: "02",
    title: "Book a live inspection",
    description:
      "Pick a time and tour the property over guided video with the owner or agent.",
  },
  {
    number: "03",
    title: "Decide with confidence",
    description:
      "See every room, ask questions in real time, then make your move — from anywhere.",
  },
];
export function HowItWorksSection() {
  return (
    <section
      className="px-10 py-12 border-t border-[#eef1ee]"
      id="how-it-works"
    >
      <div className="px-10 lg:max-w-7xl sm:mx-10 w-full justify-between items-center lg:mx-auto">
        <SectionLabel label="how it works" className="mb-6" />
        <div className="flex lg:flex-row flex-col items-center gap-6">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
