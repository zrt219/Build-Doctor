import { ContactCTA } from "@/components/portfolio/ContactCTA";
import { EmployerSignalPanel } from "@/components/portfolio/EmployerSignalPanel";
import { EvidenceLedger } from "@/components/portfolio/EvidenceLedger";
import { FeaturedProofGrid } from "@/components/portfolio/FeaturedProofGrid";
import { Footer } from "@/components/portfolio/Footer";
import { HeroMainframe } from "@/components/portfolio/HeroMainframe";
import { LiveWorkflowEventsTracker } from "@/components/portfolio/LiveWorkflowEventsTracker";
import { MotionSection } from "@/components/portfolio/MotionSection";
import { ProjectDirectory } from "@/components/portfolio/ProjectDirectory";
import { RalphplanWorkflowMap } from "@/components/portfolio/RalphplanWorkflowMap";
import { RecruiterPath } from "@/components/portfolio/RecruiterPath";
import { StatsRibbon } from "@/components/portfolio/StatsRibbon";
import { TopCommandNav } from "@/components/portfolio/TopCommandNav";

export function SuiteHub() {
  return (
    <>
      <TopCommandNav />
      <main className="relative mx-auto min-h-screen max-w-7xl px-4 pb-8 text-[16px] sm:px-5 lg:px-8">
        <HeroMainframe />
        <MotionSection className="mb-8">
          <StatsRibbon />
        </MotionSection>
        <MotionSection className="mb-8">
          <LiveWorkflowEventsTracker />
        </MotionSection>
        <MotionSection className="mb-8">
          <FeaturedProofGrid />
        </MotionSection>
        <MotionSection className="mb-8">
          <RecruiterPath />
        </MotionSection>
        <MotionSection className="mb-8">
          <RalphplanWorkflowMap />
        </MotionSection>
        <MotionSection className="mb-8">
          <ProjectDirectory />
        </MotionSection>
        <MotionSection className="mb-8">
          <EmployerSignalPanel />
        </MotionSection>
        <MotionSection className="mb-8">
          <EvidenceLedger />
        </MotionSection>
        <MotionSection>
          <ContactCTA />
        </MotionSection>
      </main>
      <Footer />
    </>
  );
}
