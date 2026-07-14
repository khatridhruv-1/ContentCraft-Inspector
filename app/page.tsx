import WelcomeStructuredData from '@/components/marketing/WelcomeStructuredData';
import LandingHeroStatic from '@/components/marketing/LandingHeroStatic';
import WelcomeLanding from '@/app/welcome/WelcomeLanding';
import { buildLandingMetadata } from '@/lib/marketing/landingSeo';

export const metadata = buildLandingMetadata();

export default function HomePage() {
  return (
    <>
      <WelcomeStructuredData />
      <WelcomeLanding heroSlot={<LandingHeroStatic />} />
    </>
  );
}
