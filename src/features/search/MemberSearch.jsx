import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass, CheckCircle } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/ui/StatusBadge';

const MemberSearch = ({ isPublic = false }) => {
  const { t } = useTranslation();
  const [q, setQ] = useState({ name: '', fatherName: '', nid: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasInput = q.name.trim() || q.fatherName.trim() || q.nid.trim();
    if (!hasInput) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams();
      if (q.name.trim()) p.append('name', q.name.trim());
      if (q.fatherName.trim()) p.append('fatherName', q.fatherName.trim());
      if (q.nid.trim()) p.append('nid', q.nid.trim());

      const endpoint = isPublic ? '/public/search' : '/users/search';

      axiosClient.get(`${endpoint}?${p}`)
        .then(({ data }) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [q, isPublic]);

  return (
    <div className="member-search-feature">
      <div className="search-card" style={{ 
        background: 'var(--white)', 
        padding: 24, 
        borderRadius: 'var(--radius-xl)', 
        border: '1px solid var(--border)',
        marginBottom: 20
      }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <MagnifyingGlass 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--grey-400)', 
              pointerEvents: 'none' 
            }} 
          />
          <input
            type="text"
            className="field-input"
            style={{ paddingLeft: 40, height: 50, fontSize: '1rem' }}
            placeholder={t('search_name_placeholder') || "Search by full name…"}
            value={q.name}
            onChange={e => setQ({ ...q, name: e.target.value })}
            autoComplete="off"
          />
        </div>
        <div className="input-row input-row-2">
          <div>
            <label className="field-label">{t('search_father') || "Father's name"}</label>
            <input 
              type="text" 
              className="field-input" 
              placeholder="—" 
              value={q.fatherName} 
              onChange={e => setQ({ ...q, fatherName: e.target.value })} 
            />
          </div>
          <div>
            <label className="field-label">{t('search_nid') || 'National ID'}</label>
            <input 
              type="text" 
              className="field-input" 
              placeholder="—" 
              value={q.nid} 
              onChange={e => setQ({ ...q, nid: e.target.value })} 
            />
          </div>
        </div>
      </div>

      {}
      {loading && [1, 2].map(i => (
        <div key={i} className="shimmer" style={{ height: 66, marginBottom: 8, opacity: 1 - i * 0.3 }} />
      ))}
      
      {!loading && results && results.length > 0 && (
        <div className="fade-up">
          <p style={{ 
            fontSize: '0.74rem', 
            fontWeight: 800, 
            color: 'var(--green)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: 10, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6 
          }}>
            <CheckCircle size={13} weight="fill" /> {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          {results.map(u => (
            <div className="result-item" key={u._id}>
              {u.imageUrl ? (
                <img src={u.imageUrl} alt={u.name} className="result-avatar" />
              ) : (
                <div className="result-avatar-init">{u.name?.[0]?.toUpperCase()}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="result-name">{u.name}</div>
                {u.fatherName && <div className="result-sub">Father: {u.fatherName}</div>}
              </div>
              <StatusBadge status={u.status} />
            </div>
          ))}
        </div>
      )}

      {!loading && results && results.length === 0 && (
        <div className="empty-hint fade-up">
          <MagnifyingGlass size={36} color="var(--grey-300)" />
          <p style={{ fontWeight: 700, color: 'var(--grey-500)', marginTop: 8 }}>No members found</p>
          <p>Try a different name or check the spelling.</p>
        </div>
      )}

      {!results && !loading && (
        <div className="empty-hint" style={{ opacity: 0.5 }}>
          <MagnifyingGlass size={36} color="var(--grey-300)" />
          <p style={{ marginTop: 8 }}>Type a name to search the member registry</p>
        </div>
      )}
    </div>
  );
};

export default MemberSearch;
