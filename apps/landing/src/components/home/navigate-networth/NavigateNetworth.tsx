import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UnicornScene from 'unicornstudio-react';
import './NavigateNetworth.css';

const NavigateNetworth = () => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const navigate = useNavigate();

  const preloadNetworthScene = () => {
    if (!isPreloaded) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      link.href = 'https://unicorn.studio/embed/OnNqTzoAjg0v69x0qApe';
      document.head.appendChild(link);
      setIsPreloaded(true);
    }
  };

  const handleNavigateToNetworth = () => {
    // Kill all ScrollTriggers immediately before navigation
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.scrollTo(0, 0);
    navigate('/networth');
  };

  return (
    <section className="navigate-networth-section">
      <div className="navigate-networth-background">
        <UnicornScene projectId="XubRMaowYe9rPw9lMysU" />
      </div>
      <div className="navigate-networth-content">
        <p className="navigate-networth-label">AN ACEPYR ORIGINAL GAME</p>
        <h2 className="navigate-networth-title">NETWORTH</h2>
        <button
          className="navigate-networth-button"
          onClick={handleNavigateToNetworth}
          onMouseEnter={preloadNetworthScene}
        >
          LEARN MORE
        </button>
      </div>
    </section>
  );
};

export default NavigateNetworth;
