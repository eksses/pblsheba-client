import React from 'react';
import { useTranslation } from 'react-i18next';
import ShellLayout from '../layouts/ShellLayout';
import SurveyForm from '../features/survey/SurveyForm';

const SurveyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="inner-page">
      <ShellLayout>
        <div className="page-body fade-up">
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--grey-900)', marginBottom: 12 }}>
            {t('survey') || 'Socio-Economic Survey'}
          </h1>
          
          <SurveyForm />
        </div>
      </ShellLayout>
    </div>
  );
};

export default SurveyPage;
