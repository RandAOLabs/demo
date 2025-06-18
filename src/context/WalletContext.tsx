import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const checkWalletConnection = useCallback(async () => {
    if (window.arweaveWallet) {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        if (address) {
          setIsConnected(true);
          setAddress(address);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }, []);

  const connect = async () => {
    if (window.arweaveWallet) {
      try {
        await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
        await checkWalletConnection();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
