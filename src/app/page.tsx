import MinimalHero from './components/MinimalHero';
import PlatformSections from './components/PlatformSections';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <MinimalHero />
      <PlatformSections />
    </div>
  );
} 