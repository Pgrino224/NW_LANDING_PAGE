import { useNavigate } from 'react-router-dom'
import './ProfilePreviewModal.css'

interface ProfilePreviewModalProps {
  userId: string
  username: string
  title?: string
  profilePic?: string
  banner?: string
  networth?: number
  influence?: number
  resonance?: number
  onClose: () => void
  position?: { x: number; y: number }
}

export default function ProfilePreviewModal({
  userId,
  username,
  title = 'Master Trader',
  profilePic,
  banner,
  networth = 15000,
  influence = 8500,
  resonance = 12000,
  onClose,
  position
}: ProfilePreviewModalProps) {
  const navigate = useNavigate()

  const handleViewFullProfile = () => {
    navigate(`/zone/${username}`)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="profile-preview-backdrop" onClick={handleBackdropClick}>
      <div
        className="profile-preview-modal"
        style={position ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
      >
        {/* Banner */}
        <div className="profile-preview-banner">
          {banner && <img src={banner} alt="banner" />}
        </div>

        {/* Profile Info */}
        <div className="profile-preview-content">
          {/* Profile Picture */}
          <div className="profile-preview-pic">
            {profilePic && <img src={profilePic} alt={username} />}
          </div>

          {/* User Info */}
          <div className="profile-preview-info">
            <h3 className="profile-preview-username">{username}</h3>
            <p className="profile-preview-title">{title}</p>
          </div>

          {/* Token Balances */}
          <div className="profile-preview-tokens">
            <div className="profile-preview-token-item">
              <img src="/shared/token-logos/webp/networth.webp" alt="NetWorth" className="token-icon" />
              <span className="token-value">{networth.toLocaleString()}</span>
            </div>
            <div className="profile-preview-token-item">
              <img src="/shared/token-logos/webp/influence.webp" alt="Influence" className="token-icon" />
              <span className="token-value">{influence.toLocaleString()}</span>
            </div>
            <div className="profile-preview-token-item">
              <img src="/shared/token-logos/webp/resonance.webp" alt="Resonance" className="token-icon" />
              <span className="token-value">{resonance.toLocaleString()}</span>
            </div>
          </div>

          {/* View Full Profile Button */}
          <button
            className="profile-preview-view-btn"
            onClick={handleViewFullProfile}
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  )
}
