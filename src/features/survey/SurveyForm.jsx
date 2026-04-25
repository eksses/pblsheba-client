import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ClipboardText } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/ui/Spinner';

const SurveyForm = () => {
  const { t } = useTranslation();
  const toast = useToast();
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
    <div className="data-card" style={{ padding: 20 }}>
      {success && (
        <div className="alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle size={18} weight="fill" /> {t('success_survey')}
        </div>
      )}

      <p style={{ fontSize: '0.85rem', color: 'var(--grey-500)', marginBottom: 20 }}>
        {t('survey_description', 'Please provide accurate information for the society\'s welfare programs.')}
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
            <><Spinner size={18} /> {t('saving')}</>
          ) : (
            <><ClipboardText size={18} weight="bold" /> {t('submit_survey')}</>
          )}
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
