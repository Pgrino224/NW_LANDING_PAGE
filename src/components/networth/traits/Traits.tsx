import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '../../responsive-container/Container';
import './Traits.css';

gsap.registerPlugin(ScrollTrigger);

const Traits = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const traitRefs = useRef<HTMLDivElement[]>([]);
  const iconSectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const traitsData = [
    {
      name: 'ANALYSIS',
      definition: 'The discipline to break down complex information, identify patterns, and make logic-driven decisions',
      icon: '/traits/analysis.svg'
    },
    {
      name: 'INNOVATION',
      definition: 'The courage and insight to see opportunities where others see risks, and to question consensus views',
      icon: '/traits/innovation.svg'
    },
    {
      name: 'PRESERVATION',
      definition: 'Prioritizing survival and sustainability over short-term gains. Understanding that keeping money is harder than making money',
      icon: '/traits/preservation.svg'
    },
    {
      name: 'RESILIENCE',
      definition: 'The ability to stay calm under pressure, avoid emotional overreactions, and recover quickly from setbacks',
      icon: '/traits/resilience.svg'
    },
    {
      name: 'CONFIDENCE',
      definition: 'Trusting one\'s judgement enough to act decisively when conviction is high, without tipping into arrogance',
      icon: '/traits/confidence.svg'
    },
    {
      name: 'VERSATILITY',
      definition: 'The mindset to evolve through experience, using feedback loops to refine strategies in dynamic environments',
      icon: '/traits/versatility.svg'
    },
    {
      name: 'VISION',
      definition: 'Seeing how individual decisions fit into a larger system and anticipating how trends and parts interact',
      icon: '/traits/vision.svg'
    },
    {
      name: 'EXECUTION',
      definition: 'Turning plans into outcomes by taking thoughtful action rather than waiting for perfect conditions',
      icon: '/traits/execution.svg'
    },
    {
      name: 'SPIRIT',
      definition: 'Understanding your own strengths, weaknesses, and tendencies to align strategy with personal psychology',
      icon: '/traits/spirit.svg'
    },
    {
      name: 'INTEGRITY',
      definition: 'Ethical decision-making, principle adherence, and fairness in allocations',
      icon: '/traits/integrity.svg'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const traits = traitRefs.current;
    const iconSection = iconSectionRef.current;

    // Set first trait as active by default
    if (traits[0]) {
      traits[0].classList.add('active');
    }

    // Delay ScrollTrigger creation to ensure Lenis is ready
    const timer = setTimeout(() => {
      // Pin the icon section
      const lastTrait = traits[traits.length - 1];
      ScrollTrigger.create({
        trigger: section,
        start: 'top top-=20vh',
        endTrigger: lastTrait,
        end: 'bottom center',
        pin: iconSection,
        pinReparent: true,
        pinSpacing: false,
      });

      // Create scroll triggers for each trait
      traits.forEach((trait, index) => {
        ScrollTrigger.create({
          trigger: trait,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setActiveIndex(index);
            traits.forEach(t => t.classList.remove('active'));
            trait.classList.add('active');
          },
          onEnterBack: () => {
            setActiveIndex(index);
            traits.forEach(t => t.classList.remove('active'));
            trait.classList.add('active');
          },
          markers: false,
        });
      });

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="traits" ref={sectionRef} className="traits-section">
      <Container>
        <div className="traits-header">
          <div className="traits-subtitle">[FINANCIAL PERSONALITIES]</div>
          <h2 className="traits-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>The Ten Traits</h2>
          <p className="traits-description">10 Core financial traits that define your personality</p>
        </div>

        <div className="traits-content">
          <div ref={iconSectionRef} className="traits-icon-section">
            <p className="traits-definition">{traitsData[activeIndex].definition}</p>
          </div>

          <div className="traits-list">
            {traitsData.map((trait, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) traitRefs.current[index] = el;
                }}
                className="trait-item"
              >
                <span className="trait-name" style={{ fontFamily: 'GeistMono, monospace', fontWeight: 700 }}>{trait.name}</span>
              </div>
            ))}
          </div>

          <div className="traits-accordion">
            {traitsData.map((trait, index) => (
              <div
                key={index}
                className={`accordion-item ${expandedIndex === index ? 'expanded' : ''}`}
              >
                <button
                  className="accordion-header"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <span className="accordion-trait-name" style={{ fontFamily: 'GeistMono, monospace', fontWeight: 700 }}>{trait.name}</span>
                  <span className="accordion-icon">{expandedIndex === index ? '−' : '+'}</span>
                </button>
                <div className="accordion-content">
                  <div className="accordion-inner">
                    <p className="accordion-definition">{trait.definition}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Traits;
