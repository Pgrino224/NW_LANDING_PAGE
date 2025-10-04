import Header from '../components/header/Header';
import NetworthHero from '../components/networth/hero/NetworthHero';
import GameModes from '../components/networth/game-modes/GameModes';
import Token from '../components/networth/token/Token';
import LearnWithSyncr from '../components/networth/learn-with-syncr/LearnWithSyncr';
import Traits from '../components/networth/traits/Traits';
import Footer from '../components/footer/Footer';

const NetWorth = () => {
  return (
    <>
      <Header />
      <NetworthHero />
      <GameModes />
      <Token />
      <LearnWithSyncr />
      <Traits />
      <Footer />
    </>
  );
};

export default NetWorth;
