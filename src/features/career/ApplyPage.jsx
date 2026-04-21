import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CaretLeft, SealCheck } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/ui/Spinner';
import GlobalLoading from '../../components/common/GlobalLoading';
import PublicNavbar from '../../layouts/PublicNavbar';

// Modular Step Components
import JobPostStep from './components/JobPostStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import ContactFinancialStep from './components/ContactFinancialStep';
import QualificationNomineeStep from './components/QualificationNomineeStep';
import AttachmentsDeclarationStep from './components/AttachmentsDeclarationStep';

const ApplyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  
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
  }, [navigate, toast]);

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

  const renderStep = () => {
    switch (step) {
      case 1: return <JobPostStep formData={formData} set={set} t={t} />;
      case 2: return <PersonalInfoStep formData={formData} set={set} t={t} />;
      case 3: return <ContactFinancialStep formData={formData} set={set} t={t} />;
      case 4: return <QualificationNomineeStep formData={formData} setEdu={setEdu} set={set} t={t} />;
      case 5: return <AttachmentsDeclarationStep formData={formData} set={set} t={t} />;
      default: return null;
    }
  };

  return (
    <div style={{ background: 'var(--grey-50)', minHeight: '100vh', paddingBottom: 60 }}>
      <PublicNavbar />
      <div className="container" style={{ maxWidth: 700, marginTop: 40 }}>
        <form onSubmit={handleSubmit} style={{ 
          background: 'var(--white)', 
          padding: '40px 30px', 
          margin: '0 auto', 
          borderRadius: 'var(--radius-xl)', 
          boxShadow: 'var(--shadow-sm)', 
          border: '1px solid var(--border)' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>{t('job_application_form')}</h1>
            <p className="text-muted">{t('apply_professional_role')}</p>
            <div className="step-indicator" style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  style={{ 
                    height: 6, 
                    width: step === i ? 40 : 20, 
                    borderRadius: 3, 
                    background: step >= i ? 'var(--primary)' : 'var(--border)', 
                    transition: '0.3s' 
                  }} 
                />
              ))}
            </div>
          </div>

          <div className="fade-up">
            {renderStep()}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
            {step > 1 && (
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: 1 }} 
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <CaretLeft size={18} /> {t('back')}
              </button>
            )}
            {step < 5 ? (
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ flex: 2, height: 48 }} 
                onClick={() => setStep(step + 1)}
              >
                {t('next')} <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2, height: 48 }} 
                disabled={loading}
              >
                {loading ? <Spinner size={20} /> : <SealCheck size={20} weight="fill" />}
                {t('submit_application')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;
