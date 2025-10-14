import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Container from '../components/responsive-container/Container';
import NFTGallery from '../components/nft-gallery/NFTGallery';
import './nft.css';

const NFT = () => {
  return (
    <>
      <Header />
      <div className="nft-page">
        <Container>
          <div className="nft-header">
            <div className="nft-subtitle">[GALLERY]</div>
            <h2 className="nft-title">NFT Collection</h2>
          </div>
        </Container>
        <NFTGallery />
      </div>
      <Footer />
    </>
  );
};

export default NFT;
