import Container from '../../responsive-container/Container';
import './Team.css';

const Team = () => {
  return (
    <section id="company" className="team-section">
      <Container>
        <div className="team-header">
          <div className="team-subtitle">[COMPANY]</div>
          <h2 className="team-title" style={{ fontFamily: 'Geist Mono, monospace', fontWeight: 400 }}>Meet the Founders</h2>
        </div>

        <div className="separator-line"></div>

        {/* Founder 1: Luis Lee */}
        <div className="founder-block">
          <div className="founder-content">
            <div className="founder-name-row">
              <div className="founder-role-wrapper">
                <span className="founder-role">FOUNDER</span>
                <span className="founder-position">CEO</span>
              </div>
              <div>
                <h3 className="founder-name">LUIS LEE</h3>
              </div>
            </div>
            <div className="founder-info-wrapper">
              <p className="founder-description">
                Luis Lee is the visionary behind Acepyr, driving innovation in AI-powered financial education and personal wealth management.
              </p>
              <div className="founder-links">
                <a href="https://x.com/lui5lee" target="_blank" rel="noopener noreferrer" className="x-button" aria-label="Luis Lee on X">
                  <svg viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="mailto:ceo@acepyr.com" className="founder-email">ceo@acepyr.com</a>
              </div>
            </div>
          </div>
          <div className="founder-image-card">
            <img src="/team/luis.webp" alt="Luis Lee" />
          </div>
        </div>

        <div className="separator-line"></div>

        {/* Founder 2: Brandon Kim */}
        <div className="founder-block">
          <div className="founder-content">
            <div className="founder-name-row">
              <div className="founder-role-wrapper">
                <span className="founder-role">COFOUNDER</span>
                <span className="founder-position">COO</span>
              </div>
              <div>
                <h3 className="founder-name">BRANDON KIM</h3>
              </div>
            </div>
            <div className="founder-info-wrapper">
              <p className="founder-description">
                Brandon Kim serves as COO, bringing operational excellence and strategic leadership to build Acepyr's platform and community.
              </p>
              <div className="founder-links">
                <a href="https://x.com/pgrino224" target="_blank" rel="noopener noreferrer" className="x-button" aria-label="Brandon Kim on X">
                  <svg viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="mailto:coo@acepyr.com" className="founder-email">coo@acepyr.com</a>
              </div>
            </div>
          </div>
          <div className="founder-image-card">
            <img src="/team/brandon.webp" alt="Brandon Kim" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Team;
