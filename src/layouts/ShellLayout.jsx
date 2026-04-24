import React from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const ShellLayout = ({ children }) => {
  return (
    <>
      <TopBar />
      <main className="shell-main">
        {children}
      </main>
      <div
        className="dev-watermark"
        style={{
          position: 'fixed',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '0.6rem',
          color: '#000',
          opacity: 0.05,
          pointerEvents: 'none',
          zIndex: 0,
          userSelect: 'none'
        }}
      >
        Developed by Samir Bhuiyan | shamirbhuiyan2@gmail.com
      </div>
      <BottomNav />
    </>
  );
};

export default ShellLayout;
