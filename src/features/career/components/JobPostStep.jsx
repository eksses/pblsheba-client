import React from 'react';
import { Briefcase } from '@phosphor-icons/react';

const JobPostStep = ({ formData, set, t }) => {
  return (
    <div className="section-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
          <Briefcase size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('post_applied_for')}</h2>
      </div>

      <div className="form-group">
        <label className="field-label" htmlFor="postAppliedFor">{t('post_applied_for')} *</label>
        <input 
          id="postAppliedFor" 
          className="field-input" 
          value={formData.postAppliedFor} 
          onChange={e => set('postAppliedFor', e.target.value)} 
          required 
          placeholder="e.g. Sales Officer" 
          autoComplete="off" 
        />
      </div>
      <div className="input-row input-row-2">
        <div className="form-group">
          <label className="field-label" htmlFor="officeNameCode">{t('office_name_code')}</label>
          <input 
            id="officeNameCode" 
            className="field-input" 
            value={formData.officeNameCode} 
            onChange={e => set('officeNameCode', e.target.value)} 
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="roleCode">{t('role_category')} *</label>
          <select 
            id="roleCode" 
            className="field-input" 
            value={formData.roleCode} 
            onChange={e => set('roleCode', e.target.value)}
          >
            {['FA', 'UM', 'BM'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobPostStep;
