import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getNavigationItems, getRoleConfig } from '../../config/navigation.js';

export default function AppLayout() {
  const { email, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const roleConfig = getRoleConfig(role);
  const navigationItems = getNavigationItems(role);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <button
        type="button"
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        aria-label="Close navigation"
        onClick={closeSidebar}
      />

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">DS</div>
          <div>
            <strong>Digital Subsidy &amp; Grant</strong>
            <span>Administration Platform</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {Object.entries(navigationItems.reduce((groups, item) => {
            const key = item.section || 'MAIN';
            (groups[key] ||= []).push(item);
            return groups;
          }, {})).map(([section, items]) => (
            <div className="nav-group" key={section}>
              <p className="nav-section-title">{section}</p>
              {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-role">{roleConfig?.label || role}</div>
          <button type="button" className="logout-button" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-header">
          <button
            type="button"
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="header-title">
            <span>Digital Subsidy &amp; Grant Administration Platform</span>
            <strong>{roleConfig?.label || 'Portal'}</strong>
          </div>

          <button
            type="button"
            className={`header-user ${role === 'BENEFICIARY' ? 'clickable' : ''}`}
            onClick={() => role === 'BENEFICIARY' && navigate('/beneficiary/profile')}
            aria-label={role === 'BENEFICIARY' ? 'Open my profile' : 'Signed-in account'}
          >
            <div className="user-avatar" aria-hidden="true">
              {(email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="user-details">
              <strong>{email}</strong>
              <span>{roleConfig?.label || role}</span>
            </div>
            {role === 'BENEFICIARY' && <span className="profile-chevron" aria-hidden="true">›</span>}
          </button>

        </header>

        <main className="app-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <div className="footer-tricolor" aria-hidden="true"><span></span><span></span><span></span></div>
          <div className="footer-content">
            <div><strong>Digital Subsidy &amp; Grant Administration Platform</strong><span>Secure • Transparent • Accountable digital services</span></div>
            <div className="footer-support"><span>Helpline: 1800-XXX-XXXX</span><span>Support: support@subsidytracker.example</span></div>
          </div>
          <div className="footer-bottom">Designed for accessible and transparent public service delivery.</div>
        </footer>
      </div>
    </div>
  );
}
