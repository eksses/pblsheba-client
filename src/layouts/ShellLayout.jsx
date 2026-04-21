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
      <BottomNav />
    </>
  );
};

export default ShellLayout;
