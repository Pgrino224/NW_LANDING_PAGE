export interface NFTProject {
  id: string;
  image: string;
  title: string;
  year: string;
  type: 'banner' | 'profile';
}

// Generate banner NFTs (NW001-NW098)
const bannerNFTs: NFTProject[] = Array.from({ length: 98 }, (_, i) => {
  const id = `NW${String(i + 1).padStart(3, '0')}`;
  return {
    id,
    image: `/nft-gallery/banner-nft/${id}.webp`,
    title: id,
    year: '2025',
    type: 'banner',
  };
});

// Generate profile NFTs (NW101-NW128)
const profileNFTs: NFTProject[] = Array.from({ length: 28 }, (_, i) => {
  const id = `NW${String(i + 101).padStart(3, '0')}`;
  return {
    id,
    image: `/nft-gallery/profile-nft/${id}.webp`,
    title: id,
    year: '2025',
    type: 'profile',
  };
});

// Combine all NFTs
export const nftProjects: NFTProject[] = [...bannerNFTs, ...profileNFTs];
