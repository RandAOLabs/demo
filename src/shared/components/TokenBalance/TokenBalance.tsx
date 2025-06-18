import React, { useEffect } from 'react';
import { DisplayBox } from '../DisplayBox';
import { useToken } from '../../../context/TokenContext';

export const TokenBalance: React.FC = () => {
  const { balance, refreshBalance } = useToken();

  useEffect(() => {
    refreshBalance();
    // Poll balance every 10 seconds
    const interval = setInterval(refreshBalance, 10000);
    return () => clearInterval(interval);
  }, [refreshBalance]);

  if (balance <= 0) return null;

  return <DisplayBox label="$RAO TEST TOKEN" value={balance} />;
};
