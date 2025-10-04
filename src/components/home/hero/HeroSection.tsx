import UnicornScene from 'unicornstudio-react';
import Container from '../../responsive-container/Container';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <UnicornScene key="home-hero-scene" projectId="IBa8CQbmkGMUFkX46Q5c" />
      </div>
      <Container>
        <div className="hero-content">
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
