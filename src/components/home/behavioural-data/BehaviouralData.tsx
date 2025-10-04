import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BehaviouralData.css';

gsap.registerPlugin(ScrollTrigger);

const BehaviouralData = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current;

    // Set initial positions (spread out for 6 cards)
    gsap.set(cards[0], { x: -500, opacity: 0.6 });
    gsap.set(cards[1], { x: -300, opacity: 0.75 });
    gsap.set(cards[2], { x: -100, opacity: 0.85 });
    gsap.set(cards[3], { x: 100, opacity: 0.85 });
    gsap.set(cards[4], { x: 300, opacity: 0.75 });
    gsap.set(cards[5], { x: 500, opacity: 0.6 });

    // Create ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom center',
        scrub: 1,
        pin: true,
      }
    });

    // Animate cards converging to center
    tl.to(cards[0], { x: 0, opacity: 1, duration: 1 })
      .to(cards[1], { x: 0, opacity: 1, duration: 1 }, '<')
      .to(cards[2], { x: 0, opacity: 1, duration: 1 }, '<')
      .to(cards[3], { x: 0, opacity: 1, duration: 1 }, '<')
      .to(cards[4], { x: 0, opacity: 1, duration: 1 }, '<')
      .to(cards[5], { x: 0, opacity: 1, duration: 1 }, '<');

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const cardData = [
    { text: 'Loss Aversion', bgColor: '#ff8480' },
    { text: 'Mental\nAccounting', bgColor: '#12839D' },
    { text: 'Prospect\nTheory', bgColor: '#1a1a1a' },
    { text: 'Hyperbolic\nDiscounting', bgColor: '#40E0D0' },
    { text: 'Overconfidence', bgColor: '#F7931A' },
    { text: 'Herding\nBehavior', bgColor: '#5150F7' }
  ];

  return (
    <section id="data" ref={sectionRef} className="behavioural-data-section">
      <div className="container behavioural-data-container">
        <div className="behavioural-data-header">
          <div className="behavioural-data-header-left">
            <div className="data-subtitle">[DATA]</div>
            <h2 className="data-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>Behavioural Data</h2>
          </div>
          <div className="header-right">
            <p className="data-description">
              Every action you take has intent and consequences. Using 6 Nobel-Awarded behavioural economics models, your trait profile is revealed as you navigate NetWorth.
            </p>
          </div>
        </div>

        <div className="cards-wrapper">
          {cardData.map((card, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="data-card"
              style={{
                zIndex: index === 2 || index === 3 ? 10 : 1,
                backgroundColor: card.bgColor
              }}
            >
              <h3 className="card-title">{card.text}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BehaviouralData;
