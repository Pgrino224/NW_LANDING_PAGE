import { useRef } from 'react';
import Container from '../../responsive-container/Container';
import UnicornScene from 'unicornstudio-react';
import Spline from '@splinetool/react-spline';
import './LearnWithSyncr.css';

const LearnWithSyncr = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section id="learnwithsyncr" className="learn-with-syncr-section">
      <Container>
        <div className="learn-with-syncr-content">
          <div className="learn-header">
            <p className="learn-subtitle">[GAMIFIED LEARNING]</p>
            <h2 className="learn-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>Learn with<br/>Syncr</h2>
          </div>

          <div className="learn-bento-grid">
            {/* Box E: Leda Card - 550x700 */}
            <div className="learn-bento-box bento-e">
              <div className="unicorn-wrapper">
                <UnicornScene key="learn-syncr-scene" projectId="u3my9Ux89xfdLPltmn02" />
              </div>
            </div>

            {/* Box A: 300x300 */}
            <div className="learn-bento-box bento-a">
              <span className="bento-a-title">TRAITS</span>
              <div className="bento-a-list">
                <span>CURIOSITY</span>
                <span>RESILIENCE</span>
                <span>ADAPTABILITY</span>
                <span>CREATIVITY</span>
                <span>COLLABORATION</span>
                <span>CRITICAL THINKING</span>
                <span>COMMUNICATION</span>
                <span>EMPATHY</span>
                <span>LEADERSHIP</span>
                <span>PERSISTENCE</span>
              </div>
            </div>

            {/* Box B: 550x250 */}
            <div className="learn-bento-box bento-b">
              <span className="bento-b-label">EXPERIENTIAL LEARNING</span>
              <span className="bento-b-stat">75%</span>
              <span className="bento-b-description">RETENTION OVER PASSIVE METHODS</span>
            </div>

            {/* Box C: 550x250 */}
            <div className="learn-bento-box bento-c">
              <div className="bento-c-content">
                <span className="bento-c-title">MULTI DIMENSIONAL</span>
                <span className="bento-c-subtitle">PLATFORM SYNCED</span>
              </div>
            </div>

            {/* Box D: 300x300 */}
            <div
              className="learn-bento-box bento-d"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                className="bento-d-video"
                loop
                muted
                playsInline
              >
                <source src="/syncr-bento/infinity.mp4" type="video/mp4" />
              </video>
              <span className="bento-d-text">UNLIMITED STRATEGIC DEPTH</span>
            </div>

            {/* Box F: Below D - 550x700 */}
            <div className="learn-bento-box bento-f">
              <div className="spline-wrapper">
                <Spline scene="https://prod.spline.design/tcI9lr5TCYEf9AyH/scene.splinecode" />
              </div>
              <div className="bento-f-text">
                <span className="bento-f-line1">ADAPTIVE</span>
                <span className="bento-f-line2">LEARNING</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LearnWithSyncr;
