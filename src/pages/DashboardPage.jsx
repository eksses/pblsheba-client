import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  SunHorizon, Sun, Moon, IdentificationCard, 
  ClipboardText, MagnifyingGlass, Leaf, House, ShieldCheck 
} from '@phosphor-icons/react';
import { useAuthStore } from '../store/useAuthStore';
import ShellLayout from '../layouts/ShellLayout';
import StatusBadge from '../components/ui/StatusBadge';
import { requestNotificationPermission } from '../utils/push';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Request notification permission on dashboard load
    requestNotificationPermission();
  }, []);

  const hour = new Date().getHours();
  const [GreetIcon, greeting] = hour < 12
    ? [SunHorizon, 'Good morning']
    : hour < 18
      ? [Sun, 'Good afternoon']
      : [Moon, 'Good evening'];

  if (!user) return null;

  return (
    <div className="inner-page">
      <ShellLayout>
        <div className="page-body fade-up">
          {}
          <div className="profile-hero-card">
            <div className="profile-hero-inner">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-init">{user.name?.[0]?.toUpperCase()}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="profile-greeting">
                  <GreetIcon size={13} weight="fill" color="var(--green)" />
                  {greeting}
                </p>
                <h2 className="profile-name">{user.name}</h2>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {}
          <div className="stat-row">
            <div className="stat-pill accent">
              <p className="stat-label">Status</p>
              <p className="stat-value" style={{ textTransform: 'capitalize' }}>{user.status || 'pending'}</p>
            </div>
            <div className="stat-pill">
              <p className="stat-label">NID</p>
              <p className="stat-value" style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{user.nid || '—'}</p>
            </div>
            <div className="stat-pill">
              <p className="stat-label">Phone</p>
              <p className="stat-value" style={{ fontSize: '0.78rem' }}>{user.phone || '—'}</p>
            </div>
          </div>

          {}
          <span className="section-eyebrow-sm">Quick Actions</span>
          <div className="quick-grid">
            <div className="quick-card" onClick={() => navigate('/profile')}>
              <div className="quick-card-icon">
                <IdentificationCard size={21} color="var(--green)" weight="duotone" />
              </div>
              <div>
                <p className="quick-card-label">My Records</p>
                <p className="quick-card-sub">View &amp; request corrections</p>
              </div>
            </div>
            <div className="quick-card" onClick={() => navigate('/survey')}>
              <div className="quick-card-icon" style={{ background: 'var(--amber-light)', borderColor: 'var(--amber-border)' }}>
                <ClipboardText size={21} color="var(--amber)" weight="duotone" />
              </div>
              <div>
                <p className="quick-card-label">Survey</p>
                <p className="quick-card-sub">Submit socio-economic data</p>
              </div>
            </div>
            <div className="quick-card" onClick={() => navigate('/search')}>
              <div className="quick-card-icon" style={{ background: 'var(--blue-light)', borderColor: 'var(--blue-border)' }}>
                <MagnifyingGlass size={21} color="var(--blue)" weight="duotone" />
              </div>
              <div>
                <p className="quick-card-label">Verify Member</p>
                <p className="quick-card-sub">Search the registry</p>
              </div>
            </div>
          </div>

          {}
          <span className="section-eyebrow-sm">About</span>
          <div className="data-card">
            <div className="data-card-header">
              <Leaf size={13} weight="fill" color="var(--green)" />
              PBL Sheba Somaj
            </div>
            <div className="data-row">
              <span className="data-label"><House size={14} /> Society</span>
              <span className="data-value">PBL Sheba Somaj</span>
            </div>
            <div className="data-row">
              <span className="data-label"><ShieldCheck size={14} /> Platform</span>
              <span className="data-value">Member Registry System</span>
            </div>
          </div>
        </div>
      </ShellLayout>
    </div>
  );
};

export default DashboardPage;
