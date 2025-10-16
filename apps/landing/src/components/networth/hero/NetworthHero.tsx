import { useState, useEffect } from 'react';
import UnicornScene from 'unicornstudio-react';
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
        <div>
          <p className="networth-hero-subtitle">Welcome to the Sandbox</p>
          <h1 className="networth-hero-title" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500 }}>NETWORTH</h1>
        </div>
      </div>
    </section>
  );
};

export default NetworthHero;
