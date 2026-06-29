import WelcomeStructuredData from '@/components/marketing/WelcomeStructuredData';
import { InitialMountLoader } from '@/components/loading/InitialMountLoader';
import WelcomeLanding from '@/app/welcome/WelcomeLanding';
import { buildLandingMetadata } from '@/lib/marketing/landingSeo';

export const metadata = buildLandingMetadata();

export default function HomePage() {
  return (
    <>
      <WelcomeStructuredData />
      <InitialMountLoader>
        <WelcomeLanding />
      </InitialMountLoader>
    </>
  );
}
