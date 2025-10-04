import Header from '../components/header/Header';
import HeroSection from '../components/home/hero/HeroSection';
import Products from '../components/home/products/Products';
import NavigateNetworth from '../components/home/navigate-networth/NavigateNetworth';
import Syncr from '../components/home/syncr/Syncr';
import BehaviouralData from '../components/home/behavioural-data/BehaviouralData';
import Team from '../components/home/team/Team';
import Footer from '../components/footer/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Products />
      <NavigateNetworth />
      <Syncr />
      <BehaviouralData />
      <Team />
      <Footer />
    </>
  );
};

export default Home;
