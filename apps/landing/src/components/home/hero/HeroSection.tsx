import UnicornScene from 'unicornstudio-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <UnicornScene key="home-hero-scene" projectId="sPN0wenbjZcGdkLIcS5W" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>ACEPYR</h1>
      </div>
    </section>
  );
};

export default HeroSection;
