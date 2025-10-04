import { useState, useEffect } from 'react';
import UnicornScene from 'unicornstudio-react';
import Container from '../../responsive-container/Container';
import './NetworthHero.css';

const NetworthHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate scene load detection
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="networth-hero-section">
      <div className={`networth-hero-overlay ${isLoaded ? 'fade-out' : ''}`} />
      <div className="networth-hero-background">
        <UnicornScene key="networth-hero-scene" projectId="199Dk8sfY6nRTeNcpEtY" />
      </div>
      <div className="networth-hero-content">
        <Container>
          <div className="networth-hero-top">
            <h1 className="networth-hero-title-left" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500, textTransform: 'uppercase' }}>Networth</h1>
            <p className="networth-hero-subtitle">Welcome to the Sandbox</p>
          </div>
        </Container>
        <Container>
          <div className="networth-hero-title-right" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500, textTransform: 'uppercase' }}>by Acepyr</div>
        </Container>
      </div>
    </section>
  );
};

export default NetworthHero;
