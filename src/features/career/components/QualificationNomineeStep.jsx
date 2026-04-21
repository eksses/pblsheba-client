import React from 'react';
import { IdentificationCard } from '@phosphor-icons/react';

const QualificationNomineeStep = ({ formData, setEdu, set, t }) => {
  return (
    <div className="section-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: 10, borderRadius: 12, background: 'var(--primary)', color: 'white' }}>
          <IdentificationCard size={24} weight="duotone" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('qualification_nominee')}</h2>
      </div>

      <p style={{ fontWeight: 700, marginBottom: 10 }}>{t('educational_qualifications')}</p>
      <div className="education-table-wrapper" style={{ overflowX: 'auto', marginBottom: 20 }}>
        <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--grey-100)', textAlign: 'left' }}>
              <th style={{ padding: 8, border: '1px solid var(--border)', fontSize: '0.75rem' }}>{t('exam')}</th>
              <th style={{ padding: 8, border: '1px solid var(--border)', fontSize: '0.75rem' }}>{t('group_subject')}</th>
              <th style={{ padding: 8, border: '1px solid var(--border)', fontSize: '0.75rem' }}>{t('gpa_result')}</th>
              <th style={{ padding: 8, border: '1px solid var(--border)', fontSize: '0.75rem' }}>{t('year')}</th>
              <th style={{ padding: 8, border: '1px solid var(--border)', fontSize: '0.75rem' }}>{t('board')}</th>
            </tr>
          </thead>
          <tbody>
            {formData.education.map((edu, i) => (
              <tr key={i}>
                <td style={{ padding: 0, border: '1px solid var(--border)' }}>
                  <input 
                    disabled 
                    value={edu.examName} 
                    className="field-input" 
                    style={{ border: 'none', background: 'var(--grey-50)', fontSize: 12 }} 
                  />
                </td>
                <td style={{ padding: 0, border: '1px solid var(--border)' }}>
                  <input 
                    value={edu.subject} 
                    onChange={e => setEdu(i, 'subject', e.target.value)} 
                    className="field-input" 
                    style={{ border: 'none', fontSize: 12 }} 
                  />
                </td>
                <td style={{ padding: 0, border: '1px solid var(--border)' }}>
                  <input 
                    value={edu.result} 
                    onChange={e => setEdu(i, 'result', e.target.value)} 
                    className="field-input" 
                    style={{ border: 'none', fontSize: 12 }} 
                  />
                </td>
                <td style={{ padding: 0, border: '1px solid var(--border)' }}>
                  <input 
                    value={edu.passingYear} 
                    onChange={e => setEdu(i, 'passingYear', e.target.value)} 
                    className="field-input" 
                    style={{ border: 'none', fontSize: 12 }} 
                  />
                </td>
                <td style={{ padding: 0, border: '1px solid var(--border)' }}>
                  <input 
                    value={edu.board} 
                    onChange={e => setEdu(i, 'board', e.target.value)} 
                    className="field-input" 
                    style={{ border: 'none', fontSize: 12 }} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontWeight: 700, margin: '10px 0', borderTop: '1px solid var(--border)', paddingTop: 15 }}>
        {t('nominee_info')}
      </p>
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
    </div>
  );
};

export default QualificationNomineeStep;
