import React from 'react';
import { useTranslation } from 'react-i18next';
import ShellLayout from '../layouts/ShellLayout';
import MemberSearch from '../features/search/MemberSearch';

const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <div className="inner-page">
      <ShellLayout>
        <div className="page-body fade-up">
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--grey-900)', marginBottom: 4 }}>
            {t('search_members') || 'Member Search'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--grey-400)', marginBottom: 20 }}>
            Verify approved members from the society registry.
          </p>

          <MemberSearch isPublic={false} />
        </div>
      </ShellLayout>
    </div>
  );
};

export default SearchPage;
