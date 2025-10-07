import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '../../responsive-container/Container';
import './Token.css';

gsap.registerPlugin(ScrollTrigger);

const Token = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tokenRefs = useRef<HTMLDivElement[]>([]);
  const visualRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const tokens = tokenRefs.current;
    const visuals = visualRefs.current;

    // Set initial colors
    gsap.set(section, { backgroundColor: '#ffffef', color: '#000000' });

    // Pin the section
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: '.token-container',
      pinSpacing: false,
    });

    // Set first token and visual as active by default
    if (tokens[0]) {
      tokens[0].classList.add('active');
    }
    if (visuals[0]) {
      gsap.set(visuals[0], { opacity: 1, rotateY: 0, scale: 1 });
    }

    // Hide other visuals initially
    visuals.forEach((visual, i) => {
      if (i !== 0) {
        gsap.set(visual, { opacity: 0, rotateY: -90 });
      }
    });

    let currentIndex = 0;

    // Animate tokens based on scroll
    tokens.forEach((token, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: `top top-=${index * 33.33}%`,
        end: `top top-=${(index + 1) * 33.33}%`,
        onEnter: () => {
          tokens.forEach(t => t.classList.remove('active'));
          token.classList.add('active');

          // Change background and text colors based on index
          if (index === 0) {
            gsap.to(section, { backgroundColor: '#ffffef', color: '#000000', duration: 0.5 });
          } else if (index === 1) {
            gsap.to(section, { backgroundColor: '#ff8480', color: '#ffffef', duration: 0.5 });
          } else {
            gsap.to(section, { backgroundColor: '#000000', color: '#ffffef', duration: 0.5 });
          }

          // Animate visuals
          if (currentIndex !== index) {
            const timeline = gsap.timeline();

            // Flip out current visual
            timeline.to(visuals[currentIndex], {
              rotateY: 90,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in'
            });

            // Flip in new visual
            timeline.fromTo(visuals[index],
              { rotateY: -90, opacity: 0 },
              { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
              '-=0.1'
            );

            currentIndex = index;
          }
        },
        onEnterBack: () => {
          tokens.forEach(t => t.classList.remove('active'));
          token.classList.add('active');

          // Change background and text colors based on index
          if (index === 0) {
            gsap.to(section, { backgroundColor: '#ffffef', color: '#000000', duration: 0.5 });
          } else if (index === 1) {
            gsap.to(section, { backgroundColor: '#ff8480', color: '#ffffef', duration: 0.5 });
          } else {
            gsap.to(section, { backgroundColor: '#000000', color: '#ffffef', duration: 0.5 });
          }

          // Animate visuals
          if (currentIndex !== index) {
            const timeline = gsap.timeline();

            // Flip out current visual
            timeline.to(visuals[currentIndex], {
              rotateY: 90,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in'
            });

            // Flip in new visual
            timeline.fromTo(visuals[index],
              { rotateY: -90, opacity: 0 },
              { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
              '-=0.1'
            );

            currentIndex = index;
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const tokenData = [
    { number: '01', name: 'NetWorth', description: 'NetWorth is the ultimate currency that resembles your financial skills.', visual: 'networth.png' },
    { number: '02', name: 'Influence', description: 'Influence is the social currency, measuring one\'s ability to connect with the world.', visual: 'influence.png' },
    { number: '03', name: 'Resonance', description: 'Resonance is the currency that allows one to upgrade their traits and abilities.', visual: 'resonance.png' }
  ];

  return (
    <section id="token" ref={sectionRef} className="token-section">
      <div className="token-container">
        <Container>
          <div className="token-content-wrapper">
            <div className="token-header">
              <h2 className="token-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>The Token<br />Economy</h2>
              <p className="token-subtitle">[THE TRIAD]</p>
            </div>

            <div className="token-visuals-wrapper">
              {tokenData.map((token, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) visualRefs.current[index] = el;
                  }}
                  className="token-visual-card"
                >
                  <img src={`/tokens/${token.visual}`} alt={token.name} />
                </div>
              ))}
            </div>

            <div className="token-list-wrapper">
              {tokenData.map((token, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) tokenRefs.current[index] = el;
                  }}
                  className="token-item"
                >
                  <div className="token-number-name">
                    <span className="token-number">{token.number}</span>
                    <span className="token-name">{token.name}</span>
                  </div>
                  <p className="token-description">{token.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Token;
