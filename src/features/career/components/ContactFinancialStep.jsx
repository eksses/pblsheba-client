import React from 'react';
import { Phone } from '@phosphor-icons/react';

const ContactFinancialStep = ({ formData, set, t }) => {
  return (
    <div className="section-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
          <Phone size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('contact_financial')}</h2>
      </div>

      <div className="input-row input-row-2">
        <div className="form-group">
          <label className="field-label" htmlFor="mobile">{t('phone')} *</label>
          <input 
            id="mobile" 
            className="field-input" 
            type="text" 
            inputMode="tel" 
            value={formData.mobile} 
            onChange={e => set('mobile', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="email">{t('email')} Address</label>
          <input 
            id="email" 
            className="field-input" 
            type="email" 
            value={formData.email} 
            onChange={e => set('email', e.target.value)} 
            autoComplete="off" 
          />
        </div>
      </div>
      <p style={{ fontWeight: 700, margin: '10px 0', borderTop: '1px solid var(--border)', paddingTop: 15 }}>
        {t('mobile_banking')}
      </p>
      <div className="input-row input-row-2">
        <div className="form-group">
          <label className="field-label">{t('banking_type')}</label>
          <select 
            className="field-input" 
            value={formData.mobileBankingType} 
            onChange={e => set('mobileBankingType', e.target.value)}
          >
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
    </div>
  );
};

export default ContactFinancialStep;
