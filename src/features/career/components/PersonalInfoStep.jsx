import React from 'react';
import { UserSquare } from '@phosphor-icons/react';

const PersonalInfoStep = ({ formData, set, t }) => {
  return (
    <div className="section-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
          <UserSquare size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('personal_info')}</h2>
      </div>

      <div className="input-row input-row-2">
        <div className="form-group">
          <label className="field-label" htmlFor="nameBn">{t('name_bn')} *</label>
          <input 
            id="nameBn" 
            className="field-input" 
            value={formData.nameBn} 
            onChange={e => set('nameBn', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="nameEn">{t('name_en')} *</label>
          <input 
            id="nameEn" 
            className="field-input" 
            value={formData.nameEn} 
            onChange={e => set('nameEn', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
      </div>
      <div className="input-row input-row-2">
        <div className="form-group">
          <label className="field-label" htmlFor="fatherName">{t('father_name')} *</label>
          <input 
            id="fatherName" 
            className="field-input" 
            value={formData.fatherName} 
            onChange={e => set('fatherName', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="motherName">{t('mother_name')} *</label>
          <input 
            id="motherName" 
            className="field-input" 
            value={formData.motherName} 
            onChange={e => set('motherName', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
      </div>
      <div className="form-group">
        <label className="field-label">{t('present_address')} *</label>
        <textarea 
          className="field-input" 
          value={formData.presentAddress} 
          onChange={e => set('presentAddress', e.target.value)} 
          required 
          rows={2} 
        />
      </div>
      <div className="form-group">
        <label className="field-label">{t('permanent_address')} *</label>
        <textarea 
          className="field-input" 
          value={formData.permanentAddress} 
          onChange={e => set('permanentAddress', e.target.value)} 
          required 
          rows={2} 
        />
      </div>
      <div className="input-row input-row-3">
        <div className="form-group">
          <label className="field-label" htmlFor="dob">{t('dob')} *</label>
          <input 
            id="dob" 
            className="field-input" 
            type="date" 
            value={formData.dob} 
            onChange={e => set('dob', e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="age">{t('age')}</label>
          <input 
            id="age" 
            className="field-input" 
            type="number" 
            inputMode="numeric" 
            value={formData.age} 
            onChange={e => set('age', e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="field-label" htmlFor="nid">{t('nid')} *</label>
          <input 
            id="nid" 
            className="field-input" 
            value={formData.nid} 
            onChange={e => set('nid', e.target.value)} 
            required 
            autoComplete="off" 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
