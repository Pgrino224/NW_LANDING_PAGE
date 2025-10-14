import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

// Declare Turnstile on window
declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [referrerXHandle, setReferrerXHandle] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formOpenedAt, setFormOpenedAt] = useState<number>(0);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isNetworthPage = location.pathname === '/networth';
  const isBountyPage = location.pathname === '/bounty';
  const isNftPage = location.pathname === '/nft';

  // Load Turnstile script
  useEffect(() => {
    // Load Turnstile script if not already loaded
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Define global callback
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
  }, []);

  // Track when modal opens for time-based validation and render Turnstile
  useEffect(() => {
    if (isModalOpen) {
      setFormOpenedAt(Date.now());
      setTurnstileToken(''); // Reset token when modal opens

      // Wait for modal to be visible, then render Turnstile widget
      const renderTurnstile = () => {
        const widgetElement = document.getElementById('turnstile-widget');

        if (widgetElement && window.turnstile) {
          // Clear the widget container first to avoid duplicates
          widgetElement.innerHTML = '';

          // Render new widget
          try {
            const widgetId = window.turnstile.render('#turnstile-widget', {
              sitekey: '0x4AAAAAAB6j86p5AbmVjVNV',
              callback: (token: string) => {
                setTurnstileToken(token);
              },
              'error-callback': () => {
                console.error('Turnstile verification failed');
                setTurnstileToken('');
              }
            });
            setTurnstileWidgetId(widgetId);
          } catch (e) {
            console.error('Failed to render Turnstile:', e);
          }
        } else if (widgetElement && !window.turnstile) {
          // Script not loaded yet, wait a bit and try again
          setTimeout(renderTurnstile, 100);
        }
      };

      // Small delay to ensure modal is rendered in DOM
      setTimeout(renderTurnstile, 100);
    } else {
      // Clear widget when modal closes
      const widgetElement = document.getElementById('turnstile-widget');
      if (widgetElement) {
        widgetElement.innerHTML = '';
      }
      setTurnstileWidgetId(null);
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Check honeypot field
    if (honeypot) {
      setSubmitStatus('error');
      setErrorMessage('Invalid submission detected.');
      setIsSubmitting(false);
      return;
    }

    // Check Turnstile token
    if (!turnstileToken) {
      setSubmitStatus('error');
      setErrorMessage('Please complete the security verification.');
      setIsSubmitting(false);
      return;
    }

    // Calculate time spent on form
    const timeSpent = Math.floor((Date.now() - formOpenedAt) / 1000);

    try {
      const response = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          referrerXHandle: referrerXHandle || null,
          turnstileToken,
          timeSpent
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setEmail('');
        setReferrerXHandle('');
        // Auto-close modal after 2 seconds
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
        // Handle specific error messages
        if (data.error?.includes('duplicate') || data.error?.includes('already exists')) {
          setErrorMessage('This email is already registered');
        } else {
          setErrorMessage(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Error calling signup function:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                  <button onClick={() => handleNavigateWithCleanup('/bounty')} className="header-nav-link">BOUNTY</button>
                  <button onClick={() => handleNavigateWithCleanup('/nft')} className="header-nav-link">NFT</button>
                </>
              ) : isBountyPage ? (
                <>
                  <button onClick={() => handleNavigateWithCleanup('/')} className="header-nav-link">HOME</button>
                  <button onClick={() => handleNavigateWithCleanup('/networth')} className="header-nav-link">NETWORTH</button>
                  <button onClick={() => handleNavigateWithCleanup('/nft')} className="header-nav-link">NFT</button>
                </>
              ) : isNftPage ? (
                <>
                  <button onClick={() => handleNavigateWithCleanup('/')} className="header-nav-link">HOME</button>
                  <button onClick={() => handleNavigateWithCleanup('/networth')} className="header-nav-link">NETWORTH</button>
                  <button onClick={() => handleNavigateWithCleanup('/bounty')} className="header-nav-link">BOUNTY</button>
                </>
              ) : (
                <>
                  <button onClick={() => scrollToSection('products')} className="header-nav-link">PRODUCTS</button>
                  <button onClick={() => scrollToSection('syncr')} className="header-nav-link">SYNCR</button>
                  <button onClick={() => scrollToSection('data')} className="header-nav-link">DATA</button>
                  <button onClick={() => scrollToSection('company')} className="header-nav-link">COMPANY</button>
                  <button onClick={() => handleNavigateWithCleanup('/networth')} className="header-nav-link">NETWORTH</button>
                  <button onClick={() => handleNavigateWithCleanup('/bounty')} className="header-nav-link">BOUNTY</button>
                  <button onClick={() => handleNavigateWithCleanup('/nft')} className="header-nav-link">NFT</button>
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
                <button onClick={() => handleNavigateWithCleanup('/bounty')} className="mobile-nav-link">BOUNTY</button>
                <button onClick={() => handleNavigateWithCleanup('/nft')} className="mobile-nav-link">NFT</button>
              </>
            ) : isBountyPage ? (
              <>
                <button onClick={() => handleNavigateWithCleanup('/')} className="mobile-nav-link">HOME</button>
                <button onClick={() => handleNavigateWithCleanup('/networth')} className="mobile-nav-link">NETWORTH</button>
                <button onClick={() => handleNavigateWithCleanup('/nft')} className="mobile-nav-link">NFT</button>
              </>
            ) : isNftPage ? (
              <>
                <button onClick={() => handleNavigateWithCleanup('/')} className="mobile-nav-link">HOME</button>
                <button onClick={() => handleNavigateWithCleanup('/networth')} className="mobile-nav-link">NETWORTH</button>
                <button onClick={() => handleNavigateWithCleanup('/bounty')} className="mobile-nav-link">BOUNTY</button>
              </>
            ) : (
              <>
                <button onClick={() => scrollToSection('products')} className="mobile-nav-link">PRODUCTS</button>
                <button onClick={() => scrollToSection('syncr')} className="mobile-nav-link">SYNCR</button>
                <button onClick={() => scrollToSection('data')} className="mobile-nav-link">DATA</button>
                <button onClick={() => scrollToSection('company')} className="mobile-nav-link">COMPANY</button>
                <button onClick={() => handleNavigateWithCleanup('/networth')} className="mobile-nav-link">NETWORTH</button>
                <button onClick={() => handleNavigateWithCleanup('/bounty')} className="mobile-nav-link">BOUNTY</button>
                <button onClick={() => handleNavigateWithCleanup('/nft')} className="mobile-nav-link">NFT</button>
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

            {submitStatus === 'success' ? (
              <div className="modal-success">
                <div className="success-checkmark">✓</div>
                <p>Success! Check your email for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} name="signup" data-netlify="true" method="POST">
                <input type="hidden" name="form-name" value="signup" />

                {/* Honeypot field - hidden from users but bots will fill it */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    opacity: 0
                  }}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="modal-input"
                  style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200 }}
                  disabled={isSubmitting}
                />
                <label className="modal-label" style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200, fontSize: '14px', marginTop: '16px', marginBottom: '8px', color: '#ffffef', display: 'block' }}>
                  Referred by (Optional)
                </label>
                <input
                  type="text"
                  name="referrerXHandle"
                  placeholder="(X handle)"
                  value={referrerXHandle}
                  onChange={(e) => setReferrerXHandle(e.target.value)}
                  className="modal-input"
                  style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200 }}
                  disabled={isSubmitting}
                />

                {/* Turnstile widget - rendered programmatically */}
                <div
                  id="turnstile-widget"
                  style={{ marginTop: '16px', marginBottom: '16px' }}
                />

                {submitStatus === 'error' && errorMessage && (
                  <div className="modal-error">{errorMessage}</div>
                )}
                <button
                  type="submit"
                  className="modal-submit-btn"
                  style={{ fontFamily: 'GeistMono, monospace', fontWeight: 200 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
