import React from 'react';

const BADGE_COLORS = {
  'Open':              { bg:'#fffbeb', color:'#92400e', border:'#fcd34d' },
  'In Progress':       { bg:'#eff6ff', color:'#1e40af', border:'#93c5fd' },
  'Resolved':          { bg:'#ecfdf5', color:'#065f46', border:'#6ee7b7' },
  'available':         { bg:'#ecfdf5', color:'#065f46', border:'#6ee7b7' },
  'occupied':          { bg:'#eff6ff', color:'#1e40af', border:'#93c5fd' },
  'maintenance':       { bg:'#fffbeb', color:'#92400e', border:'#fcd34d' },
  'High':              { bg:'#fef2f2', color:'#991b1b', border:'#fca5a5' },
  'Medium':            { bg:'#fffbeb', color:'#92400e', border:'#fcd34d' },
  'Low':               { bg:'#ecfdf5', color:'#065f46', border:'#6ee7b7' },
};

export const Badge = ({ status }) => {
  const c = BADGE_COLORS[status] || { bg:'#f1f5f9', color:'#475569', border:'#cbd5e1' };
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
      textTransform: status === status.toLowerCase() ? 'capitalize' : 'none',
    }}>{status}</span>
  );
};

// ── Button ─────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, type='button', color='#1B4F72',
  small=false, danger=false, outline=false, disabled=false, style={} }) => (
  <button type={type} onClick={onClick} disabled={disabled} style={{
    background: danger ? '#dc2626' : outline ? 'transparent' : color,
    color: outline ? '#374151' : '#fff',
    border: outline ? '1.5px solid #e2e8f0' : 'none',
    padding: small ? '6px 14px' : '10px 22px',
    borderRadius: 'var(--radius)',
    fontSize: small ? 12 : 14,
    fontWeight: 600,
    letterSpacing: '0.01em',
    boxShadow: outline ? 'none' : '0 1px 2px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
    ...style,
  }}>{children}</button>
);

// ── Card ───────────────────────────────────────────────────────────
export const Card = ({ children, style={} }) => (
  <div style={{
    background: '#fff',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
    animation: 'fadeIn 0.3s ease',
    ...style,
  }}>{children}</div>
);

// ── StatCard ───────────────────────────────────────────────────────
export const StatCard = ({ label, value, color='#1B4F72' }) => (
  <div style={{
    background: '#fff',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    flex: 1,
    minWidth: 120,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    cursor: 'default',
    animation: 'fadeIn 0.35s ease',
    position: 'relative',
    overflow: 'hidden',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: color,
      borderRadius: '12px 12px 0 0',
      opacity: 0.8,
    }} />
    <div style={{
      fontSize: 12,
      color: '#64748b',
      marginBottom: 8,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>{label}</div>
    <div style={{
      fontSize: 28,
      fontWeight: 700,
      color: color,
      lineHeight: 1.1,
    }}>{value}</div>
  </div>
);

// ── Section ────────────────────────────────────────────────────────
export const Section = ({ title, children }) => (
  <div style={{
    padding: '28px 28px 20px',
    maxWidth: 1200,
    margin: '0 auto',
    animation: 'fadeIn 0.3s ease',
  }}>
    <h2 style={{
      fontSize: 20,
      fontWeight: 700,
      margin: '0 0 24px',
      color: '#1e293b',
      letterSpacing: '-0.01em',
    }}>{title}</h2>
    {children}
  </div>
);

// ── Spinner ────────────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  }}>
    <div style={{
      width: 36,
      height: 36,
      border: '3px solid #e2e8f0',
      borderTop: '3px solid #1B4F72',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  </div>
);

// ── Table wrapper ──────────────────────────────────────────────────
export const TableWrap = ({ headers, children }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
          {headers.map(h => (
            <th key={h} style={{
              textAlign: 'left',
              padding: '10px 14px',
              color: '#64748b',
              fontWeight: 600,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

// ── Table row ──────────────────────────────────────────────────────
export const TR = ({ children }) => (
  <tr
    style={{
      borderBottom: '1px solid #f1f5f9',
      transition: 'background 0.15s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >{children}</tr>
);

export const TD = ({ children, style={} }) => (
  <td style={{
    padding: '12px 14px',
    color: '#334155',
    ...style,
  }}>{children}</td>
);
