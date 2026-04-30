import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ tabs, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredTab, setHoveredTab] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1B4F72 0%, #154360 100%)',
      color: '#fff',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: 64,
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    }}>

      {/* Left side: Brand and Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          paddingRight: 20,
          borderRight: '1px solid rgba(255,255,255,0.15)',
          marginRight: 8,
          paddingTop: 12,
          paddingBottom: 12,
        }}>
          <div style={{
            width: 34,
            height: 34,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>🏠</div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>Smart Hostel</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {tabs.map(t => {
            const isActive = activeTab === t;
            const isHovered = hoveredTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                onMouseEnter={() => setHoveredTab(t)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.12)' : isHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'inherit',
                  borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  opacity: isActive ? 1 : 0.85,
                  letterSpacing: '0.01em',
                }}
              >{t}</button>
            );
          })}
        </div>
      </div>

      {/* CENTER: User Name */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 14,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.9)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{
          width: 26,
          height: 26,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
        {user?.name}
      </div>

      {/* Right side: Role and Logout */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 12,
          opacity: 0.7,
          textTransform: 'capitalize',
          fontWeight: 500,
          background: 'rgba(255,255,255,0.1)',
          padding: '4px 10px',
          borderRadius: 20,
          letterSpacing: '0.02em',
        }}>
          {user?.role?.replace('_', ' ')}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'inherit',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
        >Logout</button>
      </div>
    </div>
  );
};

export default NavBar;
