import React, { useState, useEffect, useRef } from 'react';
import { FiLock, FiUnlock, FiCheck } from 'react-icons/fi';
import { aoHelpers } from '../../../utils/ao-helpers';
import { useCallback } from 'react';
import { useWallet } from '../../../context/WalletContext';
import './RequestStages.css';

interface RandomRequest {
  request_id: string;
  requester_id: string;
}

interface OpenRequestsResponse {
  challenge_requests?: RandomRequest[];
  output_requests?: RandomRequest[];
}

type Stage = 'commitment' | 'reveal' | 'complete';

interface StageConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const stages: Record<Stage, StageConfig> = {
  commitment: {
    icon: <FiLock className="stage-icon pulse" />,
    title: 'Committing Random Value',
    description: 'Securing your random number request...',
  },
  reveal: {
    icon: <FiUnlock className="stage-icon pulse" />,
    title: 'Revealing Random Value',
    description: 'Generating your random number...',
  },
  complete: {
    icon: <FiCheck className="stage-icon" />,
    title: 'Random Value Generated',
    description: 'Your random number is ready!',
  },
};

interface Props {
  onComplete?: (completionTime: number, value: number, entropy?: number) => void;
  randomValue?: string;
  entropyValue?: string;
}

export const RequestStages: React.FC<Props> = ({ onComplete, randomValue, entropyValue }) => {
  const { address } = useWallet();
  const PROVIDER_IDS = [
    'FHGMYF2z6TK0SMlYEBU6IrvQQiKfvHkVTy34W0TdSk0',
    'swsXCWWBljsRKFFkTl9g0w2_mc0KtEnfkpDLZynVoiE'
  ];
  const [currentStage, setCurrentStage] = useState<Stage>('commitment');
  const [startTime] = useState<number>(() => Date.now());
  const [completionTime, setCompletionTime] = useState<number | null>(() => null);
  const [isAnimating, setIsAnimating] = useState<boolean>(() => false);
  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const stageTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const transitionToStage = useCallback((newStage: Stage) => {
    if (currentStage === newStage) return;
    
    setIsAnimating(true);
    timeoutRef.current = setTimeout(() => {
      setCurrentStage(newStage);
      setIsAnimating(false);
    }, 300); // Match this with CSS animation duration
  }, [currentStage]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stageTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      stageTimeoutsRef.current = [];
    };
  }, []);

  const processData = useCallback(async () => {
    if (processingRef.current || !address) return;
    processingRef.current = true;

    try {
      console.log(`Processing data for wallet ${address}, current stage: ${currentStage}`);
      
      const randclient = await aoHelpers.getRandomClient();
      const providerActivity = await randclient.getAllProviderActivity();
      console.log('Got provider activity:', providerActivity);
      
      let foundInChallenge = false;
      let foundInOutput = false;

      // Filter activity to only our specific providers
      const filteredActivity = providerActivity.filter(activity => 
        PROVIDER_IDS.includes(activity.provider_id)
      );

      // Check each provider's activity
      for (const activity of filteredActivity) {
        console.log(`Checking activity for provider ${activity.provider_id}:`, activity);
        
        // Check challenge requests
        if (activity.active_challenge_requests?.request_ids) {
          for (const requestId of activity.active_challenge_requests.request_ids) {
            // Get request details to check if it's ours
            const response = await randclient.getRandomRequests([requestId]);
            if (response.requests?.some(req => req.requester_id === address)) {
              console.log('Found our request in challenge stage');
              foundInChallenge = true;
              break;
            }
          }
        }
        
        // Check output requests
        if (activity.active_output_requests?.request_ids) {
          for (const requestId of activity.active_output_requests.request_ids) {
            // Get request details
            const response = await randclient.getRandomRequests([requestId]);
            if (response.requests?.some(req => req.requester_id === address)) {
              console.log('Found our request in output stage');
              foundInOutput = true;
              transitionToStage('reveal');
              
              // Check if request is complete
              if (response.requests.some(req => req.random_value !== undefined)) {
                const request = response.requests.find(req => req.random_value !== undefined)!;
                console.log('Found completed request with value:', request.random_value);
                const time = Date.now() - startTime;
                setCompletionTime(time);
                transitionToStage('complete');
                onComplete?.(time, request.random_value, request.random_value); // Using value as entropy for now
                return;
              }
            }
          }
        }
      }
      
      if (!foundInChallenge && !foundInOutput) {
        console.log('No active requests found');
      }
    } catch (error) {
      console.error('Error processing request data:', error);
    } finally {
      processingRef.current = false;
    }
  }, [address, currentStage, startTime, transitionToStage, onComplete]);

  useEffect(() => {
    if (!address) return;
    
    // Initial check
    processData();
    
    // Check more frequently at first, then slow down
    const fastInterval = setInterval(processData, 500);
    
    let slowInterval: NodeJS.Timeout;
    
    // After 10 seconds, switch to slower interval
    const slowdownTimeout = setTimeout(() => {
      clearInterval(fastInterval);
      slowInterval = setInterval(processData, 2000);
    }, 10000);
    
    return () => {
      clearInterval(fastInterval);
      clearTimeout(slowdownTimeout);
      if (slowInterval) clearInterval(slowInterval);
    };
  }, [address, processData]);

  const stageOrder: Stage[] = ['commitment', 'reveal', 'complete'];
  const currentStageIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="request-stages">
      <div className="stages-progress">
        {stageOrder.map((stageName, index) => {
          const isActive = index <= currentStageIndex;
          const stageConfig = stages[stageName];
          
          return (
            <React.Fragment key={stageName}>
              <div className={`stage-point ${isActive ? 'active' : ''}`}>
                <div className="stage-icon-container">
                  {stageConfig.icon}
                </div>
                <div className="stage-info">
                  <div className="stage-title">{stageConfig.title}</div>
                  <div className="stage-description">{stageConfig.description}</div>
                </div>
              </div>
              {index < stageOrder.length - 1 && (
                <div className={`stage-connector ${isActive ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {completionTime && (
        <>
          <div className="completion-time">
            Completed in {(completionTime / 1000).toFixed(1)}s
          </div>
          {currentStage === 'complete' && (
            <>
              {randomValue && (
                <div className={`random-value visible`}>
                  Random Number: {randomValue}
                </div>
              )}
              {entropyValue && (
                <div className={`random-value visible`} style={{ marginTop: '8px' }}>
                  Entropy Value: {entropyValue}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RequestStages;
