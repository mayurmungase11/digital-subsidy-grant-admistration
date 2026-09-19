import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const services = [
  { title: 'Explore Subsidy Schemes', text: 'View government subsidy and grant programmes available through the platform.', icon: '▤' },
  { title: 'Apply for a Scheme', text: 'Submit a beneficiary application through a guided digital process.', icon: '✎' },
  { title: 'Track Application', text: 'Follow your application through submission, verification and approval.', icon: '◷' },
  { title: 'Citizen Support', text: 'Get assistance with applications, account information and service guidance.', icon: '?' },
];

export default function PublicDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const roleHome = { ADMIN: '/admin', BENEFICIARY: '/beneficiary', FIELD_OFFICER: '/field-officer', DISTRICT_OFFICER: '/district-officer', FINANCE_OFFICER: '/finance-officer' };

  if (isAuthenticated && roleHome[role]) return <Navigate to={roleHome[role]} replace />;

  const requireLogin = () => navigate('/login');

  return (
    <div className="public-portal">
      <header className="public-header">
        <div className="public-brand">
          <div className="public-brand-mark">DS</div>
          <div><strong>Digital Subsidy &amp; Grant Administration Platform</strong><span>Government digital citizen services</span></div>
        </div>
        <button type="button" className="public-signin" onClick={requireLogin}>Sign in</button>
      </header>

      <div className="public-tricolor" aria-hidden="true"><span></span><span></span><span></span></div>

      <main>
        <section className="public-hero">
          <div>
            <p className="eyebrow">CITIZEN SERVICES PORTAL</p>
            <h1>Digital subsidy and grant services, made simpler.</h1>
            <p className="public-hero-text">Discover schemes, submit applications and track your subsidy or grant journey through one transparent digital platform.</p>
            <div className="public-actions">
              <button type="button" className="hero-primary" onClick={requireLogin}>Access Citizen Services <span>→</span></button>
              <button type="button" className="hero-secondary" onClick={requireLogin}>Track an Application</button>
            </div>
          </div>
          <div className="public-emblem" aria-hidden="true">
            <div className="public-emblem-circle">DS</div>
            <strong>Citizen<br />First</strong>
          </div>
        </section>

        <section className="public-section">
          <div className="public-section-heading">
            <div><p className="eyebrow">DIGITAL SERVICES</p><h2>What can you do here?</h2></div>
            <span>Secure • Transparent • Citizen-centric</span>
          </div>
          <div className="public-service-grid">
            {services.map((service) => (
              <button type="button" className="public-service-card" key={service.title} onClick={requireLogin}>
                <span className="public-service-icon" aria-hidden="true">{service.icon}</span>
                <strong>{service.title}</strong>
                <span>{service.text}</span>
                <b>Continue →</b>
              </button>
            ))}
          </div>
        </section>

        <section className="public-values">
          <div><strong>01</strong><span>Transparent workflow</span><small>Application stages are clearly represented.</small></div>
          <div><strong>02</strong><span>Secure access</span><small>Personal services are available after sign in.</small></div>
          <div><strong>03</strong><span>Citizen focused</span><small>Simple digital access to subsidy services.</small></div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="public-footer-content">
          <div><strong>Digital Subsidy &amp; Grant Administration Platform</strong><span>Citizen-centric • Transparent • Accountable digital services</span></div>
          <div><span>Helpline: 1800-XXX-XXXX</span><span>Support: support@subsidytracker.example</span></div>
        </div>
        <div className="public-footer-bottom">Designed for accessible and transparent public service delivery.</div>
      </footer>
    </div>
  );
}
