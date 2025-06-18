import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {RNGToken} from 'ao-js-sdk'
interface TokenContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);

  const refreshBalance = useCallback(async () => {
    try {
      const tokenClient = RNGToken.autoConfiguration();
      const newBalance = await tokenClient.balance();
      setBalance(Number(newBalance));
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  }, []);

  return (
    <TokenContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
