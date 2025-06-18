import React from 'react';
import ConnectWalletButton from '../ConnectWalletButton';
import './Topbar.css';
import { useWallet } from '../../../context/WalletContext';

export const Topbar: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="topbar">
      <a href="https://randao.permagate.io" target="_blank" rel="noopener noreferrer" className="logo-link">
        <img src="/favicon.ico" alt="Logo" className="topbar-logo" />
      </a>
      {isConnected && (
        <div className="walletSection">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  );
};
