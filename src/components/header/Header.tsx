import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isNetworthPage = location.pathname === '/networth';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Email submitted:', email);
    setEmail('');
    setIsModalOpen(false);
  };

  const handleNavigateWithCleanup = (path: string) => {
    // Kill all ScrollTriggers immediately before navigation
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/logos/acepyr-logo-white.svg" alt="Acepyr Logo" className="header-logo" onClick={() => navigate('/')} />
            <nav className="header-nav">
              {isNetworthPage ? (
                <>
                  <button onClick={() => handleNavigateWithCleanup('/')} className="header-nav-link">HOME</button>
                  <button onClick={() => scrollToSection('game-modes')} className="header-nav-link">MODES</button>
                  <button onClick={() => scrollToSection('token')} className="header-nav-link">TOKEN</button>
                  <button onClick={() => scrollToSection('learnwithsyncr')} className="header-nav-link">SYNCR</button>
                  <button onClick={() => scrollToSection('traits')} className="header-nav-link">TRAITS</button>
                </>
              ) : (
                <>
                  <button onClick={() => scrollToSection('products')} className="header-nav-link">PRODUCTS</button>
                  <button onClick={() => scrollToSection('syncr')} className="header-nav-link">SYNCR</button>
                  <button onClick={() => scrollToSection('data')} className="header-nav-link">DATA</button>
                  <button onClick={() => scrollToSection('company')} className="header-nav-link">COMPANY</button>
                  <button onClick={() => handleNavigateWithCleanup('/networth')} className="header-nav-link">NETWORTH</button>
                </>
              )}
            </nav>
          </div>
          <div className="header-right">
            <button onClick={() => setIsModalOpen(true)} className="header-signup-btn">
              Sign Up
            </button>
            <button className="header-hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {isNetworthPage ? (
              <>
                <button onClick={() => handleNavigateWithCleanup('/')} className="mobile-nav-link">HOME</button>
                <button onClick={() => scrollToSection('game-modes')} className="mobile-nav-link">MODES</button>
                <button onClick={() => scrollToSection('token')} className="mobile-nav-link">TOKEN</button>
                <button onClick={() => scrollToSection('learnwithsyncr')} className="mobile-nav-link">SYNCR</button>
                <button onClick={() => scrollToSection('traits')} className="mobile-nav-link">TRAITS</button>
              </>
            ) : (
              <>
                <button onClick={() => scrollToSection('products')} className="mobile-nav-link">PRODUCTS</button>
                <button onClick={() => scrollToSection('syncr')} className="mobile-nav-link">SYNCR</button>
                <button onClick={() => scrollToSection('data')} className="mobile-nav-link">DATA</button>
                <button onClick={() => scrollToSection('company')} className="mobile-nav-link">COMPANY</button>
                <button onClick={() => handleNavigateWithCleanup('/networth')} className="mobile-nav-link">NETWORTH</button>
              </>
            )}
            <button onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }} className="mobile-signup-btn">
              Sign Up
            </button>
          </nav>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">Sign Up</h2>
            <form onSubmit={handleSubmit} name="signup" data-netlify="true">
              <input type="hidden" name="form-name" value="signup" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modal-input"
                style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200 }}
              />
              <button type="submit" className="modal-submit-btn" style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200 }}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
