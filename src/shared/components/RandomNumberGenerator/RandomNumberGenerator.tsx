import React, { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { DisplayBox } from '../DisplayBox';
import { InputBox } from '../InputBox';
import OutlinedButton from '../OutlinedButton';
import RequestStages from '../RequestStages';
import { aoHelpers } from '../../../utils/ao-helpers';
import './RandomNumberGenerator.css';

export const RandomNumberGenerator: React.FC = () => {
  const { isConnected } = useWallet();
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<string | null>(() => null);
  const [entropy, setEntropy] = useState<string | null>(() => null);
  const [error, setError] = useState<string | null>(() => null);
  // We don't need to track requestId anymore since we'll find our request by wallet address
  const { address } = useWallet();
  const [completionTime, setCompletionTime] = useState<number | null>(() => null);

  const handleGenerate = async () => {
    try {
      console.log('Starting random number generation...');
      setError(null);
      setResult(null);
      setCompletionTime(null);
      
      const PROVIDER_IDS = [
        'FHGMYF2z6TK0SMlYEBU6IrvQQiKfvHkVTy34W0TdSk0',
        'swsXCWWBljsRKFFkTl9g0w2_mc0KtEnfkpDLZynVoiE'
      ];
      
      const randclient = await aoHelpers.getRandomClient();
      console.log('Creating request with range:', min, '-', max);
      await randclient.createRequest(
        PROVIDER_IDS,
        undefined, // Default number of inputs
        undefined // No callback ID needed
      );
      
      console.log('Request created, monitoring for updates...');
    } catch (error) {
      console.error('Error generating random number:', error);
      setError('Failed to generate random number. Please try again.');
    }
  };

  const handleRequestComplete = async (time: number, value: number, entropy?: number) => {
    try {
      console.log('Request complete with value:', value);
      setResult(value.toString());
      setCompletionTime(time);
      
      if (entropy !== undefined) {
        console.log('Setting entropy:', entropy);
        setEntropy(entropy.toString());
      }
    } catch (error) {
      // Only show error for actual API failures
      if (error instanceof Error && error.message !== 'Random value not yet available') {
        console.error('Error getting random value:', error);
        setError('Failed to retrieve random number. Please try again.');
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="random-number-generator">
      <h2>Random Number Generator</h2>
      <div className="input-section">
        <InputBox
          label="Min"
          value={min}
          onChange={setMin}
          type="number"
        />
        <InputBox
          label="Max"
          value={max}
          onChange={setMax}
          type="number"
        />
        <OutlinedButton
          text="GENERATE"
          onClick={handleGenerate}
          disabled={false} // Allow new requests anytime
        />
      </div>

      <RequestStages 
        onComplete={handleRequestComplete}
        randomValue={result}
        entropyValue={entropy}
      />


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
