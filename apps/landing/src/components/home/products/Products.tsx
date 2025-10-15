import Container from '../../responsive-container/Container';
import Spline from '@splinetool/react-spline';
import UnicornScene from 'unicornstudio-react';
import './Products.css';

const Products = () => {

  return (
    <section id="products" className="products-section">
      <Container>
        <div className="products-header">
          <p className="products-label">[PRODUCTS]</p>
          <h2 className="products-title">Experience Finance</h2>
        </div>
        <div className="products-content">
          <div className="bento-grid">
            <div className="bento-card networth-card">
              <div className="networth-background"></div>
              <h3 className="bento-title">NetWorth</h3>
              <p className="bento-description">Our sandbox. Experiment with different strategies, compete against others.</p>
            </div>
            <div className="bento-card syncr-card">
              <div className="syncr-unicorn-background">
                <UnicornScene projectId="F3a8TBLyfIuuIY7kkHVV" />
              </div>
              <h3 className="bento-title">Syncr</h3>
              <p className="bento-description">Your cosmic guide to help you explore NetWorth and prevail against competition.</p>
            </div>
            <div className="bento-card behavioural-data-card">
              <div className="spline-background">
                <Spline scene="https://prod.spline.design/GVh0A8XXv68utREJ/scene.splinecode" />
              </div>
              <div className="behavioural-data-content">
                <h3 className="bento-title">Traits</h3>
                <p className="bento-description">Discover your 10-trait distribution and recognize your behavioural biases.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Products;
