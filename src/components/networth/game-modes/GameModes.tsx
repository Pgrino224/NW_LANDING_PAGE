import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import Container from '../../responsive-container/Container';
import './GameModes.css';

const GameModes = () => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [isStacked, setIsStacked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dioneVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDioneMouseEnter = () => {
    setHoveredMode('dione');
    if (dioneVideoRef.current) {
      dioneVideoRef.current.play();
    }
  };

  const handleDioneMouseLeave = () => {
    setHoveredMode(null);
    if (dioneVideoRef.current) {
      dioneVideoRef.current.pause();
    }
  };

  return (
    <section id="game-modes" className="game-modes-section">
      <Container>
        <div className="game-modes-header">
          <div className="game-modes-subtitle">[GAMING WITH NETWORTH]</div>
          <h2 className="game-modes-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>3 Modes</h2>
        </div>

        <div className="game-modes-grid">
          <div className="game-mode-box horizontal">
            <img
              src="/game-modes/leda/leda-cards.png"
              alt="LEDA Cards"
              className="leda-image-background"
            />
            <h3 className="game-mode-title">LEDA</h3>
            <p className="game-mode-description">The Ultimate NetWorth Card Game. Outsmart opponents<br />in strategic battles.</p>
          </div>

          <div
            className="game-mode-box vertical"
            onMouseEnter={handleDioneMouseEnter}
            onMouseLeave={handleDioneMouseLeave}
          >
            <video
              ref={dioneVideoRef}
              src={isMobile ? "/game-modes/dione/dione-mobile.mp4" : "/game-modes/dione/dione.mp4"}
              className="game-mode-video"
              loop
              muted
              playsInline
            />
            <h3 className="game-mode-title">DIONE</h3>
            <p className="game-mode-description">The Trade Simulator. Build and manage your investment choices.</p>
          </div>

          <div
            className="game-mode-box vertical"
            onMouseEnter={() => setHoveredMode('themis')}
            onMouseLeave={() => setHoveredMode(null)}
          >
            <div className="themis-cards-container">
              <motion.img
                src="/game-modes/themis/themis-card-1.svg"
                alt="Themis Card 1"
                className="themis-card"
                animate={{
                  y: hoveredMode === 'themis' ? 30 : 0,
                  scale: hoveredMode === 'themis' ? 0.95 : 1,
                  opacity: hoveredMode === 'themis' ? 0.7 : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  zIndex: hoveredMode === 'themis' ? 1 : 2,
                }}
              />
              <motion.img
                src="/game-modes/themis/themis-card-2.svg"
                alt="Themis Card 2"
                className="themis-card"
                animate={{
                  y: hoveredMode === 'themis' ? -30 : 0,
                  scale: hoveredMode === 'themis' ? 1 : 0.95,
                  opacity: hoveredMode === 'themis' ? 1 : 0.7,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  zIndex: hoveredMode === 'themis' ? 2 : 1,
                }}
              />
            </div>
            <h3 className="game-mode-title">THEMIS</h3>
            <p className="game-mode-description">The Prediction Market. Prove your forecasting power.</p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default GameModes;
