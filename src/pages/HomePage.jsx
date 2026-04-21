import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  SealCheck, UserPlus, SignIn, Handshake, 
  CheckFat, ShieldCheck, SunHorizon, Sun, Moon 
} from '@phosphor-icons/react';
import axiosClient from '../api/axiosClient';
import PublicNavbar from '../layouts/PublicNavbar';
import MemberSearch from '../features/search/MemberSearch';

const HomePage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axiosClient.get('/public/settings')
      .then(r => setSettings(r.data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: 'var(--grey-50)', minHeight: '100vh' }}>
      <PublicNavbar />

      {}
      <section className="hero fade-up">
        <div className="hero-badge">
          <SealCheck size={13} weight="fill" />
          Trusted community platform
        </div>
        <h1>
          {t('brand_name')} — <span className="accent">Member</span> Registry
        </h1>
        <p className="hero-desc">
          {t('welcome') || 'A secure digital platform for PBL Sheba Somaj members to register, get verified, and stay connected.'}
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            <UserPlus size={20} weight="bold" />
            {t('start_registration')}
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            <SignIn size={20} />
            {t('sign_in')}
          </Link>
          {settings?.jobApplicationsEnabled !== false && (
            <Link to="/apply" className="btn btn-ghost btn-lg" style={{ border: '2px dashed var(--green-border)', color: 'var(--green-text)' }}>
              <Handshake size={20} />
              {t('join_us') || 'Join Us'}
            </Link>
          )}
        </div>
      </section>

      {}
      <div className="trust-strip">
        <div className="trust-item"><CheckFat size={15} weight="fill" /> Verified member records</div>
        <div className="trust-item"><ShieldCheck size={15} weight="fill" /> Secure &amp; private data</div>
        <div className="trust-item"><Handshake size={15} weight="fill" /> Community welfare</div>
      </div>

      {}
      <div className="public-search-section">
        <p className="section-eyebrow">Public Verification</p>
        <h2 className="section-title">{t('verify_public_records') || 'Verify a Member'}</h2>
        <p className="section-desc">Search the registry to confirm any member's status — no login needed.</p>

        <MemberSearch isPublic={true} />
      </div>

      {}
      <section className="features">
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto 32px' }}>
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>Why PBL Sheba</p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--grey-900)', marginBottom: 8 }}>Built for your community</h2>
          <p style={{ color: 'var(--grey-400)', fontSize: '0.88rem' }}>Simple, secure, and transparent — everything your society needs in one place.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: <UserPlus size={22} color="var(--green)" weight="duotone" />, title: 'Easy Registration', desc: 'Submit your NID and photo — approved by admin, no paperwork.' },
            { icon: <ShieldCheck size={22} color="var(--green)" weight="duotone" />, title: 'Identity Verified', desc: 'Admin-reviewed membership with a clear, visible approval status.' },
            { icon: <Handshake size={22} color="var(--green)" weight="duotone" />, title: 'Community Aid', desc: 'Access member services and welfare benefits with your verified account.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <p className="feature-title">{f.title}</p>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="scroll-spacer" />
    </div>
  );
};

export default HomePage;
