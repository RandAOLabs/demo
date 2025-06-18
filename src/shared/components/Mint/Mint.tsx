import React, { useCallback, useState } from 'react';
import { FaucetClient } from 'ao-js-sdk';
import './Mint.css';
import { useWallet } from '../../../context/WalletContext';
import { useToken } from '../../../context/TokenContext';

const Mint: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { refreshBalance } = useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleFaucetExchange = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      const faucetClient = await FaucetClient.autoConfiguration();
      const success = await faucetClient.useFaucet();
      console.log('Faucet exchange result:', success);
      
      if (success) {
        setSuccess(true);
        // Note: Since actual txId isn't available, we'll use timestamp as reference
        setTxHash(`faucet-${Date.now()}`);
      } else {
        throw new Error('Faucet request failed');
      }
      await refreshBalance();
    } catch (error) {
      console.error('Error using faucet:', error);
      setError('Failed to exchange tokens. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [refreshBalance]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="faucet-container">
      <div className="faucet-card">
        <div className="faucet-info">
          <h2>RNG Test Token Faucet</h2>
          <p>
            Exchange AO tokens for RNG test tokens to:
          </p>
          <ul>
            <li>Become a RandAO provider</li>
            <li>Request random values for testing</li>
          </ul>
          
          <div className="exchange-rate">
            <div className="token-exchange">
              <span className="token-amount">0.1 AO</span>
              <span className="exchange-arrow">→</span>
              <span className="token-amount">10,000 RNG</span>
            </div>
          </div>
        </div>

        <button 
          className={`faucet-button ${isLoading ? 'loading' : ''}`}
          onClick={handleFaucetExchange}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Exchange 0.1 AO for 10,000 RNG Tokens'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <h3>Success! You've received 10,000 RNG Test Tokens</h3>
            {txHash && (
              <p className="tx-hash">
                Transaction: <span>{txHash}</span>
              </p>
            )}
            <p>You can now use these tokens to become a provider or request random values.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mint;
