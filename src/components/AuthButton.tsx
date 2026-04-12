import { useAuth0 } from '@auth0/auth0-react'

export function AuthButton() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()

  if (isLoading) {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--border)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    )
  }

  if (isAuthenticated && user) {
    const initial = (user.name || user.email || 'U').charAt(0).toUpperCase()
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontStyle: 'italic',
              border: '2px solid var(--primary)',
            }}
          >
            {initial}
          </div>
        )}

        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-2)',
            fontWeight: 500,
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.given_name || user.email?.split('@')[0]}
        </span>

        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          title="Sign out"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--border)',
            background: 'var(--surface-2)',
            color: 'var(--text-3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M10 10l3-3-3-3M13 7H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    )
  }

  // Not authenticated — sign in button
  return (
    <button
      onClick={() => loginWithRedirect()}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--r-pill)',
        border: '1px solid var(--primary)',
        background: 'var(--primary)',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        minHeight: '32px',
      }}
    >
      Sign in
    </button>
  )
}
