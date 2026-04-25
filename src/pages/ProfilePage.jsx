import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Phone, IdentificationCard, User, PencilSimple, 
  CheckCircle, DownloadSimple 
} from '@phosphor-icons/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../context/ToastContext';
import ShellLayout from '../layouts/ShellLayout';
import StatusBadge from '../components/ui/StatusBadge';
import Spinner from '../components/ui/Spinner';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const toast = useToast();
  
  const [correction, setCorrection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const idCardRef = useRef(null);

  if (!user) return null;

  const submitCorrection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosClient.patch('/users/request-edit', { 
        requestedChanges: { explanation: correction } 
      });
      setSubmitted(true);
      setCorrection('');
      toast.success(t('correction_submitted') || 'Correction request sent!');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      toast.error('Error submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      toast.success(t('pdf_ready') || 'PDF ID Card is ready!');
    } catch (err) {
      console.error('PDF error', err);
      toast.error('Failed to generate PDF.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="inner-page">
      <ShellLayout>
        <div className="page-body fade-up">
          {}
          <div className="profile-hero-card">
            <div className="profile-hero-inner">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-init">{user.name?.[0]?.toUpperCase()}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 className="profile-name">{user.name}</h2>
                <p style={{ 
                  fontSize: '0.82rem', 
                  color: 'var(--grey-400)', 
                  marginBottom: 8, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 5 
                }}>
                  <Phone size={13} /> {user.phone}
                </p>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <button 
            onClick={handleDownloadPdf} 
            disabled={generatingPdf || user.status !== 'approved'} 
            className="btn btn-outline btn-full" 
            style={{ marginBottom: 20, height: 44 }}
          >
            {generatingPdf ? (
              <><Spinner size={18} /> {t('generating_pdf') || 'Generating PDF...'}</>
            ) : user.status !== 'approved' ? (
              <><IdentificationCard size={18} weight="bold" /> {t('verification_required_id') || 'Verification Required'}</>
            ) : (
              <><DownloadSimple size={18} weight="bold" /> {t('download_id_card') || 'Download ID Card'}</>
            )}
          </button>

          {}
          <span className="section-eyebrow-sm">Identity Records</span>
          <div className="data-card">
            <div className="data-card-header">
              <IdentificationCard size={13} weight="fill" color="var(--green)" />
              Official Information
            </div>
            <div className="data-row">
              <span className="data-label"><User size={13} /> {t('full_name') || 'Full Name'}</span>
              <span className="data-value">{user.name || '—'}</span>
            </div>
            <div className="data-row">
              <span className="data-label"><User size={13} /> {t('father_name') || "Father's Name"}</span>
              <span className="data-value">{user.fatherName || '—'}</span>
            </div>
            <div className="data-row">
              <span className="data-label"><IdentificationCard size={13} /> {t('nid') || 'National ID'}</span>
              <span className="data-value mono">{user.nid || '—'}</span>
            </div>
            <div className="data-row">
              <span className="data-label"><Phone size={13} /> {t('phone') || 'Phone'}</span>
              <span className="data-value mono">{user.phone || '—'}</span>
            </div>
          </div>

          {}
          <span className="section-eyebrow-sm">Corrections</span>
          <div className="action-card">
            <p className="action-card-title">
              <PencilSimple size={15} color="var(--green)" />
              {t('request_correction') || 'Request a Correction'}
            </p>
            <p className="action-card-desc">
              {t('found_mistake') || 'If there is an error in your records, describe it below. Our team will review within 48 hours.'}
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
                  placeholder={t('explain_correction_placeholder') || "Describe the error clearly, e.g. \"My father's name is misspelled, correct spelling: Abdul Karim\""}
                  value={correction}
                  onChange={e => setCorrection(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-outline btn-full" style={{ marginTop: 12, height: 44 }} disabled={submitting}>
                  {submitting ? (
                    <><Spinner size={15} /> Submitting…</>
                  ) : (
                    <><CheckCircle size={15} /> {t('submit_request') || 'Submit Request'}</>
                  )}
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
                  <div className="idc-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'var(--green-dark)' }}>
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
      </ShellLayout>
    </div>
  );
};

export default ProfilePage;
