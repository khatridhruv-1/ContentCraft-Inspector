import WelcomeStructuredData from '@/components/marketing/WelcomeStructuredData';
import LandingHeroAnimated from '@/components/marketing/LandingHeroAnimated';
import WelcomeLanding from '@/app/welcome/WelcomeLanding';
import { buildLandingMetadata } from '@/lib/marketing/landingSeo';

export const metadata = buildLandingMetadata();

export default function HomePage() {
  return (
    <>
      <WelcomeStructuredData />
      <WelcomeLanding heroSlot={<LandingHeroAnimated />} />
    </>
  );
}
