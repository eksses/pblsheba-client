import React, { useState, useEffect, useRef, Component, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, UserPlus, SignIn, MagnifyingGlass, CaretLeft, Phone, LockKey,
  UserSquare, ShieldCheck, Handshake, IdentificationCard, SignOut,
  CheckCircle, House, PencilSimple, Warning, Spinner, User,
  SunHorizon, Sun, Moon, ArrowRight, CheckFat, SealCheck, DownloadSimple,
  ClipboardText, Briefcase
} from '@phosphor-icons/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import axiosClient from './api/axiosClient';
import { useAuthStore } from './store/useAuthStore';
import ImageCapture from './components/ImageCapture';
import './i18n';
import { createPortal } from 'react-dom';

const ToastContext = createPortal(null, document.body); 
const useToast = () => {
  const context = window.__pbl_toast;
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const add = (type, message) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => remove(id), type === 'error' ? 6000 : 3500);
  };
  const remove = (id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, removing: true } : x));
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 200);
  };
  window.__pbl_toast = {
    success: (m) => add('success', m),
    error: (m) => add('error', m),
    info: (m) => add('info', m)
  };
  return (
    <>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type} ${t.removing ? 'removing' : ''}`} onClick={() => remove(t.id)}>
              <div className="toast-icon">
                {t.type === 'success' && <CheckCircle weight="bold" />}
                {t.type === 'error' && <Warning weight="bold" />}
                {t.type === 'info' && <SignIn weight="bold" />}
              </div>
              <div className="toast-content">{t.message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, type = 'danger' }) => {
  if (!open) return null;
  return createPortal(
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal-content">
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: type === 'danger' ? 'var(--red-50)' : 'var(--blue-50)', color: type === 'danger' ? 'var(--red-600)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            {type === 'danger' ? <Warning size={32} weight="duotone" /> : <ShieldCheck size={32} weight="duotone" />}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: 8 }}>{title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost" style={{ flex: 1, borderRadius: 0, height: 56, fontWeight: 700 }} onClick={onCancel}>Cancel</button>
          <button className={`btn btn-${type === 'danger' ? 'danger' : 'primary'}`} style={{ flex: 1, borderRadius: 0, height: 56, fontWeight: 700 }} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const GlobalLoading = ({ open, text }) => {
  if (!open) return null;
  return createPortal(
    <div className="global-loading-overlay">
      <Spinner size={40} className="spin" weight="bold" color="var(--primary)" />
      <div className="loading-text">{text || 'Processing...'}</div>
    </div>,
    document.body
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="fade-up" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:20, textAlign:'center' }}>
      <div style={{ fontSize:'6rem', fontWeight:900, color:'var(--grey-200)', marginBottom:-20 }}>404</div>
      <House size={120} weight="duotone" color="var(--primary)" style={{ opacity:0.1, marginBottom:30 }} />
      <h1 style={{ fontSize:'2rem', fontWeight:900, marginBottom:10 }}>Page Not Found</h1>
      <p className="text-muted" style={{ maxWidth:400, marginBottom:30 }}>The page you are looking for might have been removed or is temporarily unavailable.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:20, textAlign:'center' }}>
          <Warning size={64} color="var(--red-500)" weight="duotone" style={{ marginBottom:20 }} />
          <h1 style={{ fontSize:'1.5rem', fontWeight:900 }}>Something went wrong</h1>
          <p className="text-muted" style={{ marginBottom:20 }}>The application encountered an unexpected error.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}


const StatusBadge = ({ status }) => {
  const map = { approved: 'badge-green', pending: 'badge-amber', rejected: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-amber'}`}>{status || 'pending'}</span>;
};

const LangToggle = () => {
  const { i18n } = useTranslation();
  useEffect(() => { document.body.setAttribute('lang', i18n.language); }, [i18n.language]);
  const toggle = (l) => { i18n.changeLanguage(l); localStorage.setItem('pbl_lang', l); document.body.setAttribute('lang', l); };
  return (
    <div className="lang-toggle">
      {['en', 'bn'].map(l => (
        <button key={l} className={`lang-btn ${i18n.language === l ? 'active' : ''}`}
          onClick={() => toggle(l)}
          style={{ fontFamily: l === 'bn' ? 'var(--font-bn)' : 'inherit' }}>
          {l === 'en' ? 'EN' : 'বাং'}
        </button>
      ))}
    </div>
  );
};


const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ display:'flex', alignItems:'center', gap:10 }}>
        <img src="/logo.png" alt="PBL Sheba" style={{ width:32, height:32, borderRadius:8 }} />
        <span style={{ fontWeight:900, fontSize:'1.2rem', letterSpacing:'-0.02em' }}>PBL Sheba</span>
      </div>
      <div className="navbar-actions">
        <LangToggle />
        {isAuthenticated ? (
          <Link to="/" className="btn btn-primary btn-sm">Dashboard</Link>
        ) : (
          <>
            <Link to="/login"    className="navbar-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register <ArrowRight size={14} weight="bold" /></Link>
          </>
        )}
      </div>
    </nav>
  );
};


const Shell = () => {
  const { logout } = useAuthStore();
  const { i18n } = useTranslation();
  const navigate  = useNavigate();
  const location  = useLocation();
  const toggle = (l) => { i18n.changeLanguage(l); localStorage.setItem('pbl_lang', l); document.body.setAttribute('lang', l); };
  const at = (path) => location.pathname === path;

  return (
    <>
      {}
      <div className="inner-topbar">
        <div className="inner-topbar-brand" style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src="/logo.png" alt="Logo" style={{ width:28, height:28, borderRadius:6 }} />
          PBL Sheba
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div className="desktop-only-flex" style={{ gap:2 }}>
            {[['/', 'Home', <House size={15}/>], ['/search', 'Search', <MagnifyingGlass size={15}/>], ['/survey', 'Survey', <ClipboardText size={15}/>], ['/profile', 'Profile', <User size={15}/>]].map(([p, label, icon]) => (
              <button key={p} onClick={() => navigate(p)} className="navbar-link" style={{ fontSize:'0.85rem', color: at(p) ? 'var(--green)' : undefined, gap:5 }}>
                {icon} {label}
              </button>
            ))}
          </div>
          <LangToggle />
          <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }} style={{ padding:'0 10px', color:'var(--grey-400)' }} title="Sign out">
            <SignOut size={18} />
          </button>
        </div>
      </div>

      {}
      <nav className="bottom-nav">
        {[['/','Home', House], ['/search','Search', MagnifyingGlass], ['/survey','Survey', ClipboardText], ['/profile','Profile', User]].map(([path, label, Icon]) => (
          <button key={path} onClick={() => navigate(path)} className={`bottom-nav-item${at(path) ? ' active' : ''}`}>
            <Icon size={22} weight={at(path) ? 'fill' : 'regular'} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
};


const HomePage = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState({ name: '', fatherName: '', nid: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axiosClient.get('/public/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const hasInput = q.name.trim() || q.fatherName.trim() || q.nid.trim();
    if (!hasInput) { setResults(null); return; }
    const timer = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams();
      if (q.name.trim())       p.append('name', q.name.trim());
      if (q.fatherName.trim()) p.append('fatherName', q.fatherName.trim());
      if (q.nid.trim())        p.append('nid', q.nid.trim());
      axiosClient.get(`/public/search?${p}`)
        .then(({ data }) => setResults(data)).catch(() => setResults([])).finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div style={{ background:'var(--grey-50)', minHeight:'100vh' }}>
      <Navbar />

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

        <div className="search-card">
          <div style={{ position:'relative', marginBottom:12 }}>
            <MagnifyingGlass size={18} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--grey-400)', pointerEvents:'none' }} />
            <input
              type="text"
              className="field-input"
              style={{ paddingLeft:40, height:50, fontSize:'1rem' }}
              placeholder="Search by full name…"
              value={q.name}
              onChange={e => setQ({ ...q, name: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="input-row input-row-2">
            <div>
              <label className="field-label">{t('search_father') || "Father's name"}</label>
              <input type="text" className="field-input" placeholder="—" value={q.fatherName} onChange={e => setQ({ ...q, fatherName: e.target.value })} />
            </div>
            <div>
              <label className="field-label">{t('search_nid') || 'National ID'}</label>
              <input type="text" className="field-input" placeholder="—" value={q.nid} onChange={e => setQ({ ...q, nid: e.target.value })} />
            </div>
          </div>
        </div>

        {}
        {loading && [1,2].map(i => <div key={i} className="shimmer" style={{ height:66, marginBottom:8, opacity: 1 - i*0.3 }} />)}
        {!loading && results && results.length > 0 && (
          <div>
            <p style={{ fontSize:'0.74rem', fontWeight:800, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <CheckCircle size={13} weight="fill" /> {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            {results.map(u => (
              <div className="result-item" key={u._id}>
                {u.imageUrl
                  ? <img src={u.imageUrl} alt={u.name} className="result-avatar" />
                  : <div className="result-avatar-init">{u.name?.[0]?.toUpperCase()}</div>}
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="result-name">{u.name}</div>
                  {u.fatherName && <div className="result-sub">Father: {u.fatherName}</div>}
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </div>
        )}
        {!loading && results && results.length === 0 && (
          <div className="empty-hint">
            <MagnifyingGlass size={36} color="var(--grey-300)" />
            <p style={{ fontWeight:700, color:'var(--grey-500)', marginTop:8 }}>No members found</p>
            <p>Try a different name or check the spelling.</p>
          </div>
        )}
        {!results && !loading && (
          <div className="empty-hint">
            <MagnifyingGlass size={36} color="var(--grey-300)" />
            <p style={{ marginTop:8 }}>Type a name to search the member registry</p>
          </div>
        )}
      </div>

      {}
      <section className="features">
        <div style={{ textAlign:'center', maxWidth:500, margin:'0 auto 32px' }}>
          <p className="section-eyebrow" style={{ justifyContent:'center' }}>Why PBL Sheba</p>
          <h2 style={{ fontSize:'1.5rem', color:'var(--grey-900)', marginBottom:8 }}>Built for your community</h2>
          <p style={{ color:'var(--grey-400)', fontSize:'0.88rem' }}>Simple, secure, and transparent — everything your society needs in one place.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: <UserPlus size={22} color="var(--green)" weight="duotone" />, title:'Easy Registration', desc:'Submit your NID and photo — approved by admin, no paperwork.' },
            { icon: <ShieldCheck size={22} color="var(--green)" weight="duotone" />, title:'Identity Verified', desc:'Admin-reviewed membership with a clear, visible approval status.' },
            { icon: <Handshake size={22} color="var(--green)" weight="duotone" />, title:'Community Aid', desc:'Access member services and welfare benefits with your verified account.' },
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


const LoginPage = () => {
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const login    = useAuthStore(s => s.login);
  const [phone, setPhone]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/login', { phone, password });
      login(data, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect phone or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page fade-up">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => navigate(-1)}><CaretLeft size={15} weight="bold" /> Back</button>
        <div style={{ marginLeft:'auto' }}><LangToggle /></div>
      </div>
      <div className="auth-body">
        <div className="auth-card">
          <div className="auth-logo" style={{ background:'none', width:'auto', height:'auto' }}>
            <img src="/logo.png" alt="PBL Sheba" style={{ width:48, height:48, borderRadius:12 }} />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in with your registered phone number and password.</p>

          {error && (
            <div className="alert-error">
              <Warning size={16} weight="fill" style={{ flexShrink:0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Phone Number</label>
              <div className="input-icon-wrap">
                <Phone size={16} />
                <input type="tel" className="field-input" placeholder="017-XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required autoFocus />
              </div>
            </div>
            <div className="field-group" style={{ marginBottom:24 }}>
              <label className="field-label">Password</label>
              <div className="input-icon-wrap">
                <LockKey size={16} />
                <input type="password" className="field-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height:48 }}>
              {loading
                ? <Spinner size={18} style={{ animation:'spin 1s linear infinite' }} />
                : <><SignIn size={17} /> Sign In</>}
            </button>
          </form>

          <div className="auth-divider" />
          <p className="auth-footer-text">
            Don't have an account?{' '}
            <span className="auth-footer-link" onClick={() => navigate('/register')}>Register here</span>
          </p>
        </div>
      </div>
    </div>
  );
};


const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', fatherName:'', dob:'1990-01-01', nid:'', phone:'',
    paymentNumber:'', password:'', paymentMethod:'', trxId:'', image:null
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    axiosClient.get('/public/settings').then(r => {
      setSettings(r.data);
      if (r.data?.paymentMethods?.length > 0) set('paymentMethod', r.data.paymentMethods[0].name);
    }).catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.trxId) return toast.error('Transaction ID is required.');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      await axiosClient.post('/auth/register', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(t('registration_success') || 'Submitted! Await admin approval.');
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const gw = settings?.paymentMethods?.find(p => p.name === form.paymentMethod);
  const gwColor = gw?.themeColor || 'var(--green)';

  return (
    <div className="auth-page fade-up">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => step > 1 ? setStep(s => s-1) : navigate(-1)}>
          <CaretLeft size={15} weight="bold" /> {step > 1 ? 'Back' : 'Home'}
        </button>
        <div style={{ marginLeft:'auto' }}><LangToggle /></div>
      </div>
      <div className="auth-body">
        <div className="auth-card">
          <div className="step-bar">
            <div className="step-dot done">1</div>
            <div className={`step-line ${step >= 2 ? 'done' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : 'todo'}`}>2</div>
          </div>

          {step === 1 && (
            <>
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-sub">Fill in your details as they appear on your NID card.</p>

              {[
                ['Full Name *', 'name', 'text', 'As per NID card', null],
                ["Father's Name", 'fatherName', 'text', "Father's / husband's name", null],
                ['National ID *', 'nid', 'text', 'NID number', null],
              ].map(([label, key, type, ph]) => (
                <div className="field-group" key={key}>
                  <label className="field-label">{label}</label>
                  <input type={type} className="field-input" placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}

              <div className="field-group">
                <label className="field-label">Phone Number *</label>
                <div className="input-icon-wrap">
                  <Phone size={16} />
                  <input type="text" inputMode="tel" className="field-input" placeholder="017-XXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} required />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Password *</label>
                <div className="input-icon-wrap">
                  <LockKey size={16} />
                  <input type="password" className="field-input" placeholder="Choose a password" value={form.password} onChange={e => set('password', e.target.value)} required />
                </div>
              </div>
              <div className="field-group" style={{ marginBottom:24 }}>
                <label className="field-label">Profile Photo *</label>
                <ImageCapture onImageChange={(file) => set('image', file)} currentImage={null} />
              </div>
              <div className="form-spacer" />
              <div className="fixed-actions">
                <button className="btn btn-primary btn-full" style={{ height:48 }}
                  onClick={() => { if (!form.name||!form.phone||!form.nid||!form.password||!form.image) return toast.error('Complete all required fields.'); setStep(2); }}>
                  Continue <ArrowRight size={17} weight="bold" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="auth-title">Complete Payment</h1>
              <p className="auth-sub">Send the registration fee via your preferred method and enter the transaction ID.</p>

              {!settings ? (
                <p style={{ color:'var(--grey-400)', textAlign:'center', padding:'24px 0', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Spinner size={16} style={{ animation:'spin 1s linear infinite' }} /> Loading…
                </p>
              ) : (
                <>
                  <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                    {settings.paymentMethods?.map(pm => (
                      <div key={pm.name} className={`pm-card ${form.paymentMethod===pm.name?'selected':''}`}
                        onClick={() => set('paymentMethod', pm.name)}
                        style={{ borderColor: form.paymentMethod===pm.name ? pm.themeColor||'var(--green)' : undefined }}>
                        <img src={pm.logoUrl || 'https://via.placeholder.com/40'} alt={pm.name} style={{ width: 40, height: 40, borderRadius: 8 }} />
                        <span>{pm.name}</span>
                      </div>
                    ))}
                  </div>
                  {gw && (
                    <div className="payment-info-box">
                      <p className="payment-info-amount">{settings.registrationFee} ৳</p>
                      <p className="payment-info-row"><strong>Send to:</strong> {gw.number}</p>
                      {gw.instructions && <p className="payment-info-row"><strong>Note:</strong> {gw.instructions}</p>}
                    </div>
                  )}
                  <div className="field-group">
                    <label className="field-label">Your {form.paymentMethod||'payment'} number *</label>
                    <div className="input-icon-wrap">
                      <Phone size={16} />
                      <input type="tel" className="field-input" placeholder="017-XXXXXXXX" value={form.paymentNumber} onChange={e => set('paymentNumber', e.target.value)} />
                    </div>
                  </div>
                  <div className="field-group" style={{ marginBottom:24 }}>
                    <label className="field-label">Transaction ID (TrxID) *</label>
                    <input type="text" className="field-input" placeholder="e.g. 7H9B3K2X" value={form.trxId} onChange={e => set('trxId', e.target.value)} required />
                  </div>
                  <div className="form-spacer" />
                  <div className="fixed-actions">
                    <button className="btn btn-primary btn-full" style={{ height:48, background:gwColor }} onClick={submit}>
                      <CheckFat size={17} weight="bold" /> Submit Registration
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};


const SurveyPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', fathersName: '', wardNo: '', farmAnimals: '', farmableLand: '',
    houseType: 'tin_shed', familyMembers: '', gender: 'male', childrenBoy: '',
    childrenGirl: '', monthlyIncome: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/surveys', form);
      setSuccess(true);
      setForm({
        name: '', fathersName: '', wardNo: '', farmAnimals: '', farmableLand: '',
        houseType: 'tin_shed', familyMembers: '', gender: 'male', childrenBoy: '',
        childrenGirl: '', monthlyIncome: '', phone: ''
      });
      setTimeout(() => setSuccess(false), 3000);
      toast.success(t('success_survey'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inner-page">
      <Shell />
      <div className="page-body fade-up">
        <h1 style={{ fontSize:'1.35rem', fontWeight:800, color:'var(--grey-900)', marginBottom:12 }}>
          {t('survey') || 'Socio-Economic Survey'}
        </h1>
        
        <div className="data-card" style={{ padding: 20 }}>
          {success && (
            <div className="alert-success" style={{ marginBottom: 20 }}>
              <CheckCircle size={18} weight="fill" /> {t('success_survey')}
            </div>
          )}

          <p style={{ fontSize: '0.85rem', color: 'var(--grey-500)', marginBottom: 20 }}>
            Please provide accurate information for the society's welfare programs.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="field-label-sm">{t('name_label')} *</label>
              <input className="field-input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="field-label-sm">{t('fathers_husband_label')}</label>
              <input className="field-input" value={form.fathersName} onChange={e => set('fathersName', e.target.value)} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="form-group">
                <label className="field-label-sm">{t('ward_label')} *</label>
                <input className="field-input" value={form.wardNo} onChange={e => set('wardNo', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="field-label-sm">{t('phone_label')} *</label>
                <input className="field-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="form-group">
                <label className="field-label-sm">{t('house_type_label')}</label>
                <select className="field-input" value={form.houseType} onChange={e => set('houseType', e.target.value)}>
                  <option value="tin_shed">{t('tin_shed')}</option>
                  <option value="brick_built">{t('brick_built')}</option>
                  <option value="mud_house">{t('mud_house')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="field-label-sm">{t('gender_label')}</label>
                <select className="field-input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="form-group">
                <label className="field-label-sm">{t('family_members_label')}</label>
                <input className="field-input" type="number" value={form.familyMembers} onChange={e => set('familyMembers', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label-sm">{t('income_label')}</label>
                <input className="field-input" type="number" value={form.monthlyIncome} onChange={e => set('monthlyIncome', e.target.value)} />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="form-group">
                <label className="field-label-sm">{t('children_boy_label')}</label>
                <input className="field-input" type="number" value={form.childrenBoy} onChange={e => set('childrenBoy', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label-sm">{t('children_girl_label')}</label>
                <input className="field-input" type="number" value={form.childrenGirl} onChange={e => set('childrenGirl', e.target.value)} />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="form-group">
                <label className="field-label-sm">{t('farm_animals_label')}</label>
                <input className="field-input" value={form.farmAnimals} onChange={e => set('farmAnimals', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label-sm">{t('farmable_land_label')}</label>
                <input className="field-input" value={form.farmableLand} onChange={e => set('farmableLand', e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ height: 48, marginTop: 10 }} disabled={loading}>
              {loading ? (
                <><Spinner size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</>
              ) : (
                <><ClipboardText size={18} weight="bold" /> {t('submit_survey')}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate  = useNavigate();

  const hour = new Date().getHours();
  const [GreetIcon, greeting] = hour < 12
    ? [SunHorizon, 'Good morning']
    : hour < 18
      ? [Sun, 'Good afternoon']
      : [Moon, 'Good evening'];

  return (
    <div className="inner-page">
      <Shell />
      <div className="page-body fade-up">

        {}
        <div className="profile-hero-card">
          <div className="profile-hero-inner">
            {user.imageUrl
              ? <img src={user.imageUrl} alt={user.name} className="profile-avatar-img" />
              : <div className="profile-avatar-init">{user.name?.[0]?.toUpperCase()}</div>}
            <div style={{ flex:1, minWidth:0 }}>
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
            <p className="stat-value" style={{ textTransform:'capitalize' }}>{user.status || 'pending'}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-label">NID</p>
            <p className="stat-value" style={{ fontFamily:'monospace', fontSize:'0.78rem' }}>{user.nid || '—'}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-label">Phone</p>
            <p className="stat-value" style={{ fontSize:'0.78rem' }}>{user.phone || '—'}</p>
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
            <div className="quick-card-icon" style={{ background:'var(--amber-light)', borderColor:'var(--amber-border)' }}>
              <ClipboardText size={21} color="var(--amber)" weight="duotone" />
            </div>
            <div>
              <p className="quick-card-label">Survey</p>
              <p className="quick-card-sub">Submit socio-economic data</p>
            </div>
          </div>
          <div className="quick-card" onClick={() => navigate('/search')}>
            <div className="quick-card-icon" style={{ background:'var(--blue-light)', borderColor:'var(--blue-border)' }}>
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
    </div>
  );
};


const SearchPage = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState({ name:'', fatherName:'', nid:'' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const hasInput = q.name.trim() || q.fatherName.trim() || q.nid.trim();
    if (!hasInput) { setResults([]); setSearched(false); return; }
    setSearched(true);
    const timer = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams();
      if (q.name.trim())       p.append('name', q.name.trim());
      if (q.fatherName.trim()) p.append('fatherName', q.fatherName.trim());
      if (q.nid.trim())        p.append('nid', q.nid.trim());
      axiosClient.get(`/users/search?${p}`)
        .then(({ data }) => setResults(data)).catch(() => setResults([])).finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="inner-page">
      <Shell />
      <div className="page-body fade-up">
        <h1 style={{ fontSize:'1.35rem', fontWeight:800, color:'var(--grey-900)', marginBottom:4 }}>
          {t('search_members') || 'Member Search'}
        </h1>
        <p style={{ fontSize:'0.875rem', color:'var(--grey-400)', marginBottom:20 }}>
          Verify approved members from the society registry.
        </p>

        {}
        <div style={{ position:'relative', marginBottom:10 }}>
          <MagnifyingGlass size={18} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--grey-400)', pointerEvents:'none' }} />
          <input
            type="text"
            className="field-input"
            style={{ paddingLeft:42, height:52, fontSize:'1rem', borderRadius:'var(--radius-lg)', borderTop:'3px solid var(--green)' }}
            placeholder="Search by name…"
            value={q.name}
            onChange={e => setQ({ ...q, name: e.target.value })}
            autoFocus
          />
        </div>

        {}
        <div className="input-row input-row-2" style={{ marginBottom:24 }}>
          <input type="text" className="field-input" placeholder="Father's name" value={q.fatherName} onChange={e => setQ({ ...q, fatherName: e.target.value })} style={{ fontSize:'0.875rem' }} />
          <input type="text" className="field-input" placeholder="NID number" value={q.nid} onChange={e => setQ({ ...q, nid: e.target.value })} style={{ fontSize:'0.875rem' }} />
        </div>

        {loading && [1,2,3].map(i => <div key={i} className="shimmer" style={{ height:66, marginBottom:8, opacity: 1 - i*0.25 }} />)}
        {!loading && searched && results.length === 0 && (
          <div className="empty-hint">
            <MagnifyingGlass size={36} color="var(--grey-300)" />
            <p style={{ fontWeight:700, color:'var(--grey-500)', marginTop:8 }}>No members found</p>
            <p>Try a different name or adjust your search.</p>
          </div>
        )}
        {!loading && !searched && (
          <div className="empty-hint" style={{ paddingTop:12 }}>
            <MagnifyingGlass size={36} color="var(--grey-300)" />
            <p style={{ marginTop:8 }}>Start typing to search the registry</p>
          </div>
        )}
        {!loading && searched && results.length > 0 && (
          <>
            <p style={{ fontSize:'0.72rem', fontWeight:800, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <CheckCircle size={13} weight="fill" /> {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map(u => (
              <div className="result-item" key={u._id}>
                {u.imageUrl
                  ? <img src={u.imageUrl} alt={u.name} className="result-avatar" />
                  : <div className="result-avatar-init">{u.name?.[0]?.toUpperCase()}</div>}
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="result-name">{u.name}</div>
                  {u.fatherName && <div className="result-sub">Father: {u.fatherName}</div>}
                </div>
                <StatusBadge status={u.status} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};


const ProfilePage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [correction, setCorrection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const idCardRef = useRef(null);

  if (!user) return null;

  const submitCorrection = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await axiosClient.patch('/users/request-edit', { requestedChanges: { explanation: correction } });
      setSubmitted(true); setCorrection('');
      toast.success(t('correction_submitted') || 'Correction request sent!');
      setTimeout(() => setSubmitted(false), 5000);
    } catch { toast.error('Error submitting. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const handleDownloadPdf = async () => {
    if (!idCardRef.current) return;
    setGeneratingPdf(true);
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [400, canvas.height * (400 / canvas.width)]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 400, canvas.height * (400 / canvas.width));
      pdf.save(`${user.name.replace(/\s+/g, '_')}_ID_Card.pdf`);
      toast.success(t('pdf_ready'));
    } catch (err) {
      console.error('PDF error', err);
      toast.error('Failed to generate PDF.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="inner-page">
      <Shell />
      <div className="page-body fade-up">

        {}
        <div className="profile-hero-card">
          <div className="profile-hero-inner">
            {user.imageUrl
              ? <img src={user.imageUrl} alt={user.name} className="profile-avatar-img" />
              : <div className="profile-avatar-init">{user.name?.[0]?.toUpperCase()}</div>}
            <div style={{ flex:1, minWidth:0 }}>
              <h2 className="profile-name">{user.name}</h2>
              <p style={{ fontSize:'0.82rem', color:'var(--grey-400)', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
                <Phone size={13} /> {user.phone}
              </p>
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <button onClick={handleDownloadPdf} disabled={generatingPdf} className="btn btn-outline btn-full" style={{ marginBottom: 20, height: 44 }}>
           {generatingPdf ? <><Spinner size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating PDF...</> : <><DownloadSimple size={18} weight="bold" /> Download ID Card</>}
        </button>

        {}
        <span className="section-eyebrow-sm">Identity Records</span>
        <div className="data-card">
          <div className="data-card-header">
            <IdentificationCard size={13} weight="fill" color="var(--green)" />
            Official Information
          </div>
          <div className="data-row">
            <span className="data-label"><User size={13} /> {t('full_name')||'Full Name'}</span>
            <span className="data-value">{user.name||'—'}</span>
          </div>
          <div className="data-row">
            <span className="data-label"><User size={13} /> {t('father_name')||"Father's Name"}</span>
            <span className="data-value">{user.fatherName||'—'}</span>
          </div>
          <div className="data-row">
            <span className="data-label"><IdentificationCard size={13} /> {t('nid')||'National ID'}</span>
            <span className="data-value mono">{user.nid||'—'}</span>
          </div>
          <div className="data-row">
            <span className="data-label"><Phone size={13} /> {t('phone')||'Phone'}</span>
            <span className="data-value mono">{user.phone||'—'}</span>
          </div>
        </div>

        {}
        <span className="section-eyebrow-sm">Corrections</span>
        <div className="action-card">
          <p className="action-card-title">
            <PencilSimple size={15} color="var(--green)" />
            {t('request_correction')||'Request a Correction'}
          </p>
          <p className="action-card-desc">
            {t('found_mistake')||'If there is an error in your records, describe it below. Our team will review within 48 hours.'}
          </p>

          {submitted ? (
            <div className="alert-success">
              <CheckCircle size={16} weight="fill" /> Request submitted successfully!
            </div>
          ) : (
            <form onSubmit={submitCorrection}>
              <textarea
                className="field-textarea"
                rows={3}
                placeholder={t('explain_correction_placeholder')||"Describe the error clearly, e.g. \"My father's name is misspelled, correct spelling: Abdul Karim\""}
                value={correction}
                onChange={e => setCorrection(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-outline btn-full" style={{ marginTop:12, height:44 }} disabled={submitting}>
                {submitting
                  ? <><Spinner size={15} style={{ animation:'spin 1s linear infinite' }} /> Submitting…</>
                  : <><CheckCircle size={15} /> {t('submit_request')||'Submit Request'}</>}
              </button>
            </form>
          )}
        </div>

        {}
        <div className="idc-hide">
          <div ref={idCardRef} className="id-card-export">
            <div className="idc-header">
              <div className="idc-title">PBL Sheba Somaj</div>
              <div className="idc-subtitle">Member ID Card</div>
            </div>
            <div className="idc-body">
              {user.imageUrl ? (
                <img src={user.imageUrl} className="idc-avatar" crossOrigin="anonymous" alt="" />
              ) : (
                <div className="idc-avatar" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', fontWeight:'bold', color:'var(--green-dark)' }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="idc-name">{user.name}</div>
              <div className="idc-status">{user.status} Member</div>
              
              <div className="idc-details">
                <div className="idc-row">
                  <div className="idc-label">Member ID</div>
                  <div className="idc-value">{user._id.slice(-8).toUpperCase()}</div>
                </div>
                <div className="idc-row">
                  <div className="idc-label">National ID</div>
                  <div className="idc-value">{user.nid || '—'}</div>
                </div>
                {user.fatherName && (
                <div className="idc-row">
                  <div className="idc-label">Father </div>
                  <div className="idc-value">{user.fatherName}</div>
                </div>
                )}
                <div className="idc-row">
                  <div className="idc-label">Phone</div>
                  <div className="idc-value">{user.phone || '—'}</div>
                </div>
              </div>
              <div className="idc-footer">
                This is a digitally verified identity card.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════
   JOB APPLICATION PAGE (ApplyPage)
═══════════════════════════════════════════ */
const Section = memo(({ title, icon: Icon, children, step: s, currentStep }) => {
  if (currentStep !== s) return null;
  return (
    <div className="section-container">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ padding:10, borderRadius:12, background:'var(--primary)', color:'white' }}>
          <Icon size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
});

const ApplyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    postAppliedFor: '', officeNameCode: '', roleCode: 'SO',
    nameBn: '', nameEn: '', fatherName: '', motherName: '',
    presentAddress: '', permanentAddress: '', dob: '', age: '', religion: '', 
    nid: '', nationality: 'Bangladeshi', profession: '', maritalStatus: '', spouseName: '',
    mobile: '', email: '', bankName: '', branch: '', routingNo: '',
    mobileBankingType: 'bKash', mobileBankingNumber: '',
    nomineeName: '', nomineeAddress: '', nomineeRelationship: '', nomineeMobile: '',
    education: [
      { examName: 'SSC/Equiv', subject: '', result: '', passingYear: '', board: '' },
      { examName: 'HSC/Equiv', subject: '', result: '', passingYear: '', board: '' },
      { examName: 'Bachelor', subject: '', result: '', passingYear: '', board: '' },
      { examName: 'Master\'s', subject: '', result: '', passingYear: '', board: '' }
    ],
    photo: null,
    signature: null
  });


  useEffect(() => {
    axiosClient.get('/public/settings').then(r => {
      setSettings(r.data);
      if (r.data && r.data.jobApplicationsEnabled === false) {
        toast.info('Job applications are currently closed.');
        navigate('/');
      }
    }).catch(() => {});
  }, []);

  const set = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));
  const setEdu = (i, f, v) => {
    const next = [...formData.education];
    next[i][f] = v;
    set('education', next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo || !formData.signature) {
      toast.error('Photo and Signature are required!');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'education') {
          fd.append(key, JSON.stringify(formData[key]));
        } else if (key === 'photo' || key === 'signature') {
          if (formData[key]) fd.append(key, formData[key]);
        } else {
          fd.append(key, formData[key]);
        }
      });

      await axiosClient.post('/public/career/apply', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <GlobalLoading open={true} text="Checking application status..." />;

  return (
    <div style={{ background:'var(--grey-50)', minHeight:'100vh', paddingBottom:60 }}>
      <Navbar />
      <div className="container" style={{ maxWidth:700, marginTop:40 }}>
        <form onSubmit={handleSubmit} style={{ background:'var(--white)', padding:'40px 30px', margin:'0 auto', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)' }}>
          <div style={{ textAlign:'center', marginBottom:30 }}>
            <h1 style={{ fontSize:'1.8rem', fontWeight:900, marginBottom:8 }}>{t('job_application_form')}</h1>
            <p className="text-muted">{t('apply_professional_role')}</p>
            <div className="step-indicator" style={{ display:'flex', gap:6, justifyContent:'center', marginTop:20 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ height:6, width: step === i ? 40 : 20, borderRadius:3, background: step >= i ? 'var(--primary)' : 'var(--border)', transition:'0.3s' }} />
              ))}
            </div>
          </div>

          {}
          <Section step={1} currentStep={step} title={t('post_applied_for')} icon={Briefcase}>
            <div className="form-group">
              <label className="field-label" htmlFor="postAppliedFor">{t('post_applied_for')} *</label>
              <input id="postAppliedFor" className="field-input" value={formData.postAppliedFor} onChange={e => set('postAppliedFor', e.target.value)} required placeholder="e.g. Sales Officer" autoComplete="off" />
            </div>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label" htmlFor="officeNameCode">{t('office_name_code')}</label>
                <input id="officeNameCode" className="field-input" value={formData.officeNameCode} onChange={e => set('officeNameCode', e.target.value)} autoComplete="off" />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="roleCode">{t('role_category')} *</label>
                <select id="roleCode" className="field-input" value={formData.roleCode} onChange={e => set('roleCode', e.target.value)}>
                  {['SO', 'ASM', 'RSM', 'DSM', 'NSM', 'D.CMO'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {}
          <Section step={2} currentStep={step} title={t('personal_info')} icon={UserSquare}>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label" htmlFor="nameBn">{t('name_bn')} *</label>
                <input id="nameBn" className="field-input" value={formData.nameBn} onChange={e => set('nameBn', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="nameEn">{t('name_en')} *</label>
                <input id="nameEn" className="field-input" value={formData.nameEn} onChange={e => set('nameEn', e.target.value)} required autoComplete="off" />
              </div>
            </div>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label" htmlFor="fatherName">{t('father_name')} *</label>
                <input id="fatherName" className="field-input" value={formData.fatherName} onChange={e => set('fatherName', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="motherName">{t('mother_name')} *</label>
                <input id="motherName" className="field-input" value={formData.motherName} onChange={e => set('motherName', e.target.value)} required autoComplete="off" />
              </div>
            </div>
            <div className="form-group">
              <label className="field-label">{t('present_address')} *</label>
              <textarea className="field-input" value={formData.presentAddress} onChange={e => set('presentAddress', e.target.value)} required rows={2} />
            </div>
            <div className="form-group">
              <label className="field-label">{t('permanent_address')} *</label>
              <textarea className="field-input" value={formData.permanentAddress} onChange={e => set('permanentAddress', e.target.value)} required rows={2} />
            </div>
            <div className="input-row input-row-3">
              <div className="form-group">
                <label className="field-label" htmlFor="dob">{t('dob')} *</label>
                <input id="dob" className="field-input" type="date" value={formData.dob} onChange={e => set('dob', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="age">{t('age')}</label>
                <input id="age" className="field-input" type="number" inputMode="numeric" value={formData.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="nid">{t('nid')} *</label>
                <input id="nid" className="field-input" value={formData.nid} onChange={e => set('nid', e.target.value)} required autoComplete="off" />
              </div>
            </div>
          </Section>

          {}
          <Section step={3} currentStep={step} title={t('contact_financial')} icon={Phone}>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label" htmlFor="mobile">{t('phone')} *</label>
                <input id="mobile" className="field-input" type="text" inputMode="tel" value={formData.mobile} onChange={e => set('mobile', e.target.value)} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label className="field-label" htmlFor="email">{t('email')} Address</label>
                <input id="email" className="field-input" type="email" value={formData.email} onChange={e => set('email', e.target.value)} autoComplete="off" />
              </div>
            </div>
            <p style={{ fontWeight:700, margin:'10px 0', borderTop:'1px solid var(--border)', paddingTop:15 }}>{t('bank_account_any')}</p>
            <div className="input-row input-row-3">
              <div className="form-group">
                <label className="field-label">{t('bank_name')}</label>
                <input className="field-input" value={formData.bankName} onChange={e => set('bankName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label">{t('branch')}</label>
                <input className="field-input" value={formData.branch} onChange={e => set('branch', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label">{t('routing_no')}</label>
                <input className="field-input" value={formData.routingNo} onChange={e => set('routingNo', e.target.value)} />
              </div>
            </div>
            <p style={{ fontWeight:700, margin:'10px 0', borderTop:'1px solid var(--border)', paddingTop:15 }}>{t('mobile_banking')}</p>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label">{t('banking_type')}</label>
                <select className="field-input" value={formData.mobileBankingType} onChange={e => set('mobileBankingType', e.target.value)}>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>
              <div className="form-group">
                <label className="field-label">{t('account_number')}</label>
                <input className="field-input" value={formData.mobileBankingNumber} onChange={e => set('mobileBankingNumber', e.target.value)} />
              </div>
            </div>
          </Section>

          {}
          <Section step={4} currentStep={step} title={t('qualification_nominee')} icon={IdentificationCard}>
            <p style={{ fontWeight:700, marginBottom:10 }}>{t('educational_qualifications')}</p>
            <div className="education-table-wrapper" style={{ overflowX:'auto', marginBottom:20 }}>
              <table style={{ width:'100%', minWidth:500, borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--grey-100)', textAlign:'left' }}>
                    <th style={{ padding:8, border:'1px solid var(--border)', fontSize:'0.75rem' }}>{t('exam')}</th>
                    <th style={{ padding:8, border:'1px solid var(--border)', fontSize:'0.75rem' }}>{t('group_subject')}</th>
                    <th style={{ padding:8, border:'1px solid var(--border)', fontSize:'0.75rem' }}>{t('gpa_result')}</th>
                    <th style={{ padding:8, border:'1px solid var(--border)', fontSize:'0.75rem' }}>{t('year')}</th>
                    <th style={{ padding:8, border:'1px solid var(--border)', fontSize:'0.75rem' }}>{t('board')}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.education.map((edu, i) => (
                    <tr key={i}>
                      <td style={{ padding:0, border:'1px solid var(--border)' }}><input disabled value={edu.examName} className="field-input" style={{ border:'none', background:'var(--grey-50)', fontSize:12 }} /></td>
                      <td style={{ padding:0, border:'1px solid var(--border)' }}><input value={edu.subject} onChange={e => setEdu(i, 'subject', e.target.value)} className="field-input" style={{ border:'none', fontSize:12 }} /></td>
                      <td style={{ padding:0, border:'1px solid var(--border)' }}><input value={edu.result} onChange={e => setEdu(i, 'result', e.target.value)} className="field-input" style={{ border:'none', fontSize:12 }} /></td>
                      <td style={{ padding:0, border:'1px solid var(--border)' }}><input value={edu.passingYear} onChange={e => setEdu(i, 'passingYear', e.target.value)} className="field-input" style={{ border:'none', fontSize:12 }} /></td>
                      <td style={{ padding:0, border:'1px solid var(--border)' }}><input value={edu.board} onChange={e => setEdu(i, 'board', e.target.value)} className="field-input" style={{ border:'none', fontSize:12 }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontWeight:700, margin:'10px 0', borderTop:'1px solid var(--border)', paddingTop:15 }}>{t('nominee_info')}</p>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label">{t('nominee_name')} *</label>
                <input className="field-input" value={formData.nomineeName} onChange={e => set('nomineeName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="field-label">{t('relationship')} *</label>
                <input className="field-input" value={formData.nomineeRelationship} onChange={e => set('nomineeRelationship', e.target.value)} required />
              </div>
            </div>
            <div className="input-row input-row-2">
              <div className="form-group">
                <label className="field-label">{t('nominee_mobile')}</label>
                <input className="field-input" value={formData.nomineeMobile} onChange={e => set('nomineeMobile', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="field-label">{t('nominee_address')}</label>
                <input className="field-input" value={formData.nomineeAddress} onChange={e => set('nomineeAddress', e.target.value)} />
              </div>
            </div>
          </Section>

          {}
          <Section step={5} currentStep={step} title={t('attachments_declaration')} icon={PencilSimple}>
            <div className="m-grid m-grid-2">
              <div className="form-group">
                <label className="field-label">{t('passport_photo')} *</label>
                <ImageCapture onImageChange={f => set('photo', f)} currentImage={null} />
              </div>
              <div className="form-group">
                <label className="field-label">{t('signature')} *</label>
                <ImageCapture onImageChange={f => set('signature', f)} currentImage={null} />
                <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:4 }}>{t('signature_hint')}</p>
              </div>
            </div>
            <div style={{ marginTop:24, padding:16, background:'var(--primary-light)', borderRadius:12, border:'1px solid var(--primary-border)' }}>
              <label style={{ display:'flex', gap:12, cursor:'pointer' }}>
                <input type="checkbox" required style={{ width:20, height:20, accentColor:'var(--primary)' }} />
                <span style={{ fontSize:'0.85rem', lineHeight:1.4 }}>
                  {t('declaration_text')}
                </span>
              </label>
            </div>
          </Section>

          <div style={{ display:'flex', gap:10, marginTop:30 }}>
            {step > 1 && (
              <button type="button" className="btn btn-outline" style={{ flex:1 }} onClick={() => setStep(step - 1)}>
                <CaretLeft size={18} /> {t('back')}
              </button>
            )}
            {step < 5 ? (
              <button type="button" className="btn btn-primary" style={{ flex:2, height:48 }} onClick={() => setStep(step + 1)}>
                {t('next')} <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ flex:2, height:48 }} disabled={loading}>
                {loading ? <Spinner size={20} style={{animation:'spin 1s linear infinite'}} /> : <SealCheck size={20} weight="fill" />}
                {t('submit_application')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};


const ForcePasswordReset = () => {
  const [pw, setPw] = useState('');
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.patch('/users/change-password', { newPassword: pw });
      toast.success('Password updated! Please sign in again.');
      useAuthStore.getState().logout();
      navigate('/login');
    } catch { toast.error('Error. Please try again.'); }
  };
  return (
    <div className="auth-page fade-up">
      <div className="auth-body" style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div className="auth-card">
          <div className="auth-logo"><ShieldCheck size={22} weight="fill" color="white" /></div>
          <h1 className="auth-title">{t('set_new_password')}</h1>
          <p className="auth-sub">{t('permanent_password_desc')}</p>
          <form onSubmit={submit}>
            <div className="field-group" style={{ marginBottom:20 }}>
              <label className="field-label">{t('new_password_label')}</label>
              <div className="input-icon-wrap">
                <LockKey size={16} />
                <input type="password" className="field-input" placeholder="Choose a secure password" value={pw} onChange={e => setPw(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" style={{ height:48 }}>
              <CheckFat size={17} weight="bold" /> Save Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.firstLogin && user?.role !== 'member') {
    return (
      <Router>
        <Routes><Route path="*" element={<ForcePasswordReset />} /></Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/"         element={isAuthenticated ? <DashboardPage /> : <HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/apply"    element={<ApplyPage />} />
        <Route path="/search"   element={<SearchPage />} />
        <Route path="/survey"   element={<SurveyPage />} />
        <Route path="/profile"  element={<ProfilePage />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </Router>
  );
}
