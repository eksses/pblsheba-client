import React from 'react';
import { PencilSimple } from '@phosphor-icons/react';
import ImageCapture from '../../../components/ImageCapture';

const AttachmentsDeclarationStep = ({ formData, set, t }) => {
  return (
    <div className="section-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
          <PencilSimple size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('attachments_declaration')}</h2>
      </div>

      <div className="m-grid m-grid-2">
        <div className="form-group">
          <label className="field-label">{t('passport_photo')} *</label>
          <ImageCapture onImageChange={f => set('photo', f)} currentImage={null} />
        </div>
        <div className="form-group">
          <label className="field-label">{t('signature')} *</label>
          <ImageCapture onImageChange={f => set('signature', f)} currentImage={null} />
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {t('signature_hint')}
          </p>
        </div>
      </div>
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        background: 'var(--primary-light)', 
        borderRadius: 12, 
        border: '1px solid var(--primary-border)' 
      }}>
        <label style={{ display: 'flex', gap: 12, cursor: 'pointer' }}>
          <input type="checkbox" required style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
            {t('declaration_text')}
          </span>
        </label>
      </div>
    </div>
  );
};

export default AttachmentsDeclarationStep;
