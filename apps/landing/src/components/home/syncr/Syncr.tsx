import UnicornScene from 'unicornstudio-react';
import Container from '../../responsive-container/Container';
import './Syncr.css';

const Syncr = () => {
  return (
    <section id="syncr" className="syncr-section">
      <div className="syncr-background">
        <UnicornScene key="syncr-scene" projectId="VjkQKNvBrImwb13EiwWE" />
      </div>
      <div className="syncr-vignette-top"></div>
      <div className="syncr-vignette-bottom"></div>
      <Container>
        <div className="syncr-header">
          <div className="syncr-subtitle">[SYNCR]</div>

          <div className="syncr-title-group">
            <div className="syncr-title-main">Syncr</div>
            <div className="syncr-title-sub">is Acepyr's Native AI-Infrastructure</div>
          </div>
        </div>

        <p className="syncr-description">
          Your adaptive companion that learns with you and allows you to develop real expertise in market dynamics and financial strategy.
        </p>
      </Container>
    </section>
  );
};

export default Syncr;
