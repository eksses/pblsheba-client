import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CaretLeft, Phone, LockKey, ArrowRight, CheckFat, Spinner } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import LangToggle from '../../components/common/LangToggle';
import ImageCapture from '../../components/ImageCapture';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', fatherName: '', dob: '1990-01-01', nid: '', phone: '',
    paymentNumber: '', password: '', paymentMethod: '', trxId: '', image: null
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    axiosClient.get('/public/settings').then(r => {
      setSettings(r.data);
      if (r.data?.paymentMethods?.length > 0) {
        set('paymentMethod', r.data.paymentMethods[0].name);
      }
    }).catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.trxId) return toast.error('Transaction ID is required.');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (form[k] !== null) fd.append(k, form[k]);
      });
      await axiosClient.post('/auth/register', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      toast.success(t('registration_success') || 'Submitted! Await admin approval.');
      navigate('/');
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Registration failed.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const gw = settings?.paymentMethods?.find(p => p.name === form.paymentMethod);
  const gwColor = gw?.themeColor || 'var(--green)';

  return (
    <div className="auth-page fade-up">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}>
          <CaretLeft size={15} weight="bold" /> {step > 1 ? 'Back' : 'Home'}
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <LangToggle />
        </div>
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
                { label: 'Full Name *', key: 'name', type: 'text', ph: 'As per NID card' },
                { label: "Father's Name", key: 'fatherName', type: 'text', ph: "Father's / husband's name" },
                { label: 'National ID *', key: 'nid', type: 'text', ph: 'NID number' },
              ].map(({ label, key, type, ph }) => (
                <div className="field-group" key={key}>
                  <label className="field-label">{label}</label>
                  <input 
                    type={type} 
                    className="field-input" 
                    placeholder={ph} 
                    value={form[key]} 
                    onChange={e => set(key, e.target.value)} 
                  />
                </div>
              ))}

              <div className="field-group">
                <label className="field-label">Phone Number *</label>
                <div className="input-icon-wrap">
                  <Phone size={16} />
                  <input 
                    type="text" 
                    inputMode="tel" 
                    className="field-input" 
                    placeholder="017-XXXXXXXX" 
                    value={form.phone} 
                    onChange={e => set('phone', e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Password *</label>
                <div className="input-icon-wrap">
                  <LockKey size={16} />
                  <input 
                    type="password" 
                    className="field-input" 
                    placeholder="Choose a password" 
                    value={form.password} 
                    onChange={e => set('password', e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="field-group" style={{ marginBottom: 24 }}>
                <label className="field-label">Profile Photo *</label>
                <ImageCapture onImageChange={(file) => set('image', file)} currentImage={null} />
              </div>
              <div className="form-spacer" />
              <div className="fixed-actions">
                <button 
                  className="btn btn-primary btn-full" 
                  style={{ height: 48 }}
                  onClick={() => { 
                    if (!form.name || !form.phone || !form.nid || !form.password || !form.image) {
                      return toast.error('Complete all required fields.'); 
                    }
                    setStep(2); 
                  }}
                >
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
                <p style={{ color: 'var(--grey-400)', textAlign: 'center', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Spinner size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading…
                </p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    {settings.paymentMethods?.map(pm => (
                      <div 
                        key={pm.name} 
                        className={`pm-card ${form.paymentMethod === pm.name ? 'selected' : ''}`}
                        onClick={() => set('paymentMethod', pm.name)}
                        style={{ borderColor: form.paymentMethod === pm.name ? pm.themeColor || 'var(--green)' : undefined }}
                      >
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
                    <label className="field-label">Your {form.paymentMethod || 'payment'} number *</label>
                    <div className="input-icon-wrap">
                      <Phone size={16} />
                      <input 
                        type="tel" 
                        className="field-input" 
                        placeholder="017-XXXXXXXX" 
                        value={form.paymentNumber} 
                        onChange={e => set('paymentNumber', e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="field-group" style={{ marginBottom: 24 }}>
                    <label className="field-label">Transaction ID (TrxID) *</label>
                    <input 
                      type="text" 
                      className="field-input" 
                      placeholder="e.g. 7H9B3K2X" 
                      value={form.trxId} 
                      onChange={e => set('trxId', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-spacer" />
                  <div className="fixed-actions">
                    <button 
                      className="btn btn-primary btn-full" 
                      style={{ height: 48, background: gwColor }} 
                      onClick={submit}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <CheckFat size={17} weight="bold" /> Submit Registration
                        </>
                      )}
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

export default Register;
