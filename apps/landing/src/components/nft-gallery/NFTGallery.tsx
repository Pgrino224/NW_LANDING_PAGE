import { useEffect, useRef } from 'react';
import { nftProjects } from './nft-data';
import './NFTGallery.css';

const NFTGallery = () => {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Split NFTs into 4 rows
    const rowSpeeds = [0.3, 0.5, 0.4, 0.6]; // Different speeds for parallax effect
    let animationFrameId: number;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let draggedRowIndex = -1;
    let lastDragTime = 0;
    let lastDragX = 0;
    let velocity = 0;
    let momentumAnimationId: number;
    let dragRAFId: number;
    let pendingDragX = 0;
    let hasPendingDrag = false;

    // Store positions as numbers (one for each row)
    const rowPositions = [0, 0, 0, 0];

    // Calculate one set width with mixed card sizes (do this once, not per frame)
    const bannerCardWidth = 608; // 600px + 8px gap
    const profileCardWidth = 208; // 200px + 8px gap
    const bannerCount = 98;
    const profileCount = 28;
    const oneSetWidth = (bannerCardWidth * bannerCount) + (profileCardWidth * profileCount);

    const animate = () => {
      if (!isPaused) {
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          const speed = rowSpeeds[index];

          // Get the track (inner container that we'll transform)
          const track = row.firstElementChild as HTMLElement;
          if (!track) return;

          // Move left using stored position
          rowPositions[index] -= speed;

          // Reset seamlessly when one set scrolls completely off
          while (rowPositions[index] <= -oneSetWidth) {
            rowPositions[index] += oneSetWidth;
          }

          // Apply transform using translate3d for GPU acceleration
          track.style.transform = `translate3d(${rowPositions[index]}px, 0, 0)`;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const applyMomentum = () => {
      if (draggedRowIndex === -1 || Math.abs(velocity) < 0.1) {
        velocity = 0;
        isPaused = false;
        draggedRowIndex = -1;
        return;
      }

      const row = rowRefs.current[draggedRowIndex];
      if (!row) return;

      const track = row.firstElementChild as HTMLElement;
      if (!track) return;

      // Apply velocity using stored position
      rowPositions[draggedRowIndex] += velocity;

      // Apply transform using translate3d for GPU acceleration
      track.style.transform = `translate3d(${rowPositions[draggedRowIndex]}px, 0, 0)`;

      velocity *= 0.95; // Deceleration factor

      momentumAnimationId = requestAnimationFrame(applyMomentum);
    };

    // RAF-throttled drag update
    const updateDragPosition = () => {
      if (!hasPendingDrag || draggedRowIndex === -1) return;

      const row = rowRefs.current[draggedRowIndex];
      if (!row) return;

      const track = row.firstElementChild as HTMLElement;
      if (!track) return;

      // Update position using stored value
      rowPositions[draggedRowIndex] += pendingDragX;

      // Apply transform using translate3d for GPU acceleration
      track.style.transform = `translate3d(${rowPositions[draggedRowIndex]}px, 0, 0)`;

      // Reset pending state
      pendingDragX = 0;
      hasPendingDrag = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('.carousel-row') as HTMLElement;
      if (!row) return;

      isDragging = true;
      isPaused = true;
      startX = e.clientX;
      lastDragX = e.clientX;
      lastDragTime = performance.now();
      velocity = 0;
      draggedRowIndex = rowRefs.current.indexOf(row as HTMLDivElement);
      document.body.style.cursor = 'grabbing';

      // Cancel any ongoing momentum animation
      if (momentumAnimationId) {
        cancelAnimationFrame(momentumAnimationId);
      }

      // Cancel any pending drag RAF
      if (dragRAFId) {
        cancelAnimationFrame(dragRAFId);
      }

      // Add dragging class to disable transitions during drag
      const track = row.firstElementChild as HTMLElement;
      if (track) track.classList.add('dragging');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || draggedRowIndex === -1) return;

      const currentTime = performance.now();
      const deltaX = e.clientX - startX;
      const deltaTime = currentTime - lastDragTime;

      // Calculate velocity for momentum
      if (deltaTime > 0) {
        velocity = (e.clientX - lastDragX) / deltaTime * 16; // Normalize to 60fps
      }

      // Store pending drag instead of applying immediately
      pendingDragX = deltaX;
      hasPendingDrag = true;

      startX = e.clientX;
      lastDragX = e.clientX;
      lastDragTime = currentTime;

      // Schedule RAF update if not already scheduled
      if (!dragRAFId) {
        dragRAFId = requestAnimationFrame(() => {
          updateDragPosition();
          dragRAFId = 0;
        });
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      const row = draggedRowIndex >= 0 ? rowRefs.current[draggedRowIndex] : null;
      if (row) {
        const track = row.firstElementChild as HTMLElement;
        if (track) track.classList.remove('dragging');
      }

      isDragging = false;
      document.body.style.cursor = '';

      // Apply momentum scrolling
      if (Math.abs(velocity) > 0.5) {
        applyMomentum();
      } else {
        draggedRowIndex = -1;
        isPaused = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('.carousel-row') as HTMLElement;
      if (!row) return;

      isDragging = true;
      isPaused = true;
      startX = e.touches[0].clientX;
      lastDragX = e.touches[0].clientX;
      lastDragTime = performance.now();
      velocity = 0;
      draggedRowIndex = rowRefs.current.indexOf(row as HTMLDivElement);

      // Cancel any ongoing momentum animation
      if (momentumAnimationId) {
        cancelAnimationFrame(momentumAnimationId);
      }

      // Cancel any pending drag RAF
      if (dragRAFId) {
        cancelAnimationFrame(dragRAFId);
      }

      // Add dragging class to disable transitions during drag
      const track = row.firstElementChild as HTMLElement;
      if (track) track.classList.add('dragging');
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || draggedRowIndex === -1) return;

      const currentTime = performance.now();
      const deltaX = e.touches[0].clientX - startX;
      const deltaTime = currentTime - lastDragTime;

      // Calculate velocity for momentum
      if (deltaTime > 0) {
        velocity = (e.touches[0].clientX - lastDragX) / deltaTime * 16; // Normalize to 60fps
      }

      // Store pending drag instead of applying immediately
      pendingDragX = deltaX;
      hasPendingDrag = true;

      startX = e.touches[0].clientX;
      lastDragX = e.touches[0].clientX;
      lastDragTime = currentTime;

      // Schedule RAF update if not already scheduled
      if (!dragRAFId) {
        dragRAFId = requestAnimationFrame(() => {
          updateDragPosition();
          dragRAFId = 0;
        });
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;

      const row = draggedRowIndex >= 0 ? rowRefs.current[draggedRowIndex] : null;
      if (row) {
        const track = row.firstElementChild as HTMLElement;
        if (track) track.classList.remove('dragging');
      }

      isDragging = false;

      // Apply momentum scrolling
      if (Math.abs(velocity) > 0.5) {
        applyMomentum();
      } else {
        draggedRowIndex = -1;
        isPaused = false;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (momentumAnimationId) {
        cancelAnimationFrame(momentumAnimationId);
      }
      if (dragRAFId) {
        cancelAnimationFrame(dragRAFId);
      }
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Each row shows ALL 126 NFTs, just starting at different positions for variety
  const rows = [
    nftProjects,
    [...nftProjects.slice(32), ...nftProjects.slice(0, 32)], // Rotate by 32
    [...nftProjects.slice(63), ...nftProjects.slice(0, 63)], // Rotate by 63
    [...nftProjects.slice(95), ...nftProjects.slice(0, 95)], // Rotate by 95
  ];

  return (
    <div className="nft-gallery-container">
      <div className="nft-carousel">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="carousel-row"
            ref={(el) => { rowRefs.current[rowIndex] = el; }}
          >
            <div className="carousel-track">
              {/* Duplicate content many times so content is always visible */}
              {Array(10).fill(row).flat().map((nft, index) => (
                <div key={`${nft.id}-${index}`} className={`nft-card ${nft.type}`}>
                  <img src={nft.image} alt={nft.id} className="nft-image" />
                  <div className="nft-overlay">
                    <span className="nft-id">{nft.id}</span>
                    <span className="nft-year">{nft.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="vignette-overlay" />
    </div>
  );
};

export default NFTGallery;
