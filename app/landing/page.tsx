import { CtaBand } from "./_components/cta-band";
import { FeaturedSection } from "./_components/featured-section";
import { Footer } from "./_components/footer";
import { HeroSection } from "./_components/hero-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { Navbar } from "./_components/navbar";

const Landing = () => {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main className="">
				<HeroSection />
				<FeaturedSection />
				<HowItWorksSection />
				<CtaBand />
			</main>
			<Footer />
		</div>
	);
};

export default Landing;
