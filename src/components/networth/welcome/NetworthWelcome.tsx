import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import Container from '../../responsive-container/Container';
import './NetworthWelcome.css';

function NetworthModel() {
  const { scene } = useGLTF('/logos/networth-logo.glb');
  return <primitive object={scene} scale={2} />;
}

const NetworthWelcome = () => {
  return (
    <section className="networth-welcome-section">
      <Container>
        <div className="networth-welcome-content">
          <div className="networth-welcome-subtitle">LEARNING WITH GAMIFICATION</div>
          <h2 className="networth-welcome-title">WELCOME TO THE SANDBOX</h2>
          
          <div className="networth-model-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                <NetworthModel />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  autoRotate={false}
                />
              </Suspense>
            </Canvas>
          </div>

          <p className="networth-welcome-description">
            Networth is where you meet your financial self, the mirror to your money decisions. We've built the first experimental sandbox where you can explore and understand who you are as an investor.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default NetworthWelcome;
