import React, { useState } from 'react';
import OutlinedButton from '../OutlinedButton';
import './ConnectWalletButton.css';
import { useWallet } from '../../../context/WalletContext';

const ConnectWalletButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, address, connect, disconnect } = useWallet();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      setIsLoading(true);
      try {
        await connect();
      } catch (error) {
        console.error('Connection error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isConnected && address) {
    return (
      <OutlinedButton
        text={shortenAddress(address)}
        onClick={handleClick}
      />
    );
  }

  return (
    <OutlinedButton
      text={isLoading ? "Connecting..." : "Connect Wallet"}
      onClick={handleClick}
    />
  );
};

export default ConnectWalletButton;
