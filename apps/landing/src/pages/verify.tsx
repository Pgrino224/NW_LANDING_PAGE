import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Call the Netlify function to verify the email
    fetch(`/.netlify/functions/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch(err => {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        border: '1px solid #333'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #FF8480',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h1 style={{ color: '#ffffff', marginBottom: '10px' }}>Verifying your email...</h1>
            <p style={{ color: '#999' }}>Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#FF8480',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              ✓
            </div>
            <h1 style={{ color: '#ffffff', marginBottom: '10px' }}>Email Verified!</h1>
            <p style={{ color: '#999', marginBottom: '30px' }}>{message}</p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#FF8480',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Return to Home
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px',
              color: 'white'
            }}>
              ✗
            </div>
            <h1 style={{ color: '#ffffff', marginBottom: '10px' }}>Verification Failed</h1>
            <p style={{ color: '#999', marginBottom: '30px' }}>{message}</p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#FF8480',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Return to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
