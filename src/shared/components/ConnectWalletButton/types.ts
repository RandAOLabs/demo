export interface WalletConnectionProps {
  onConnect?: (connected: boolean) => void;
  isConnected?: boolean;
  fixed?: boolean;
  onWalletUpdate?: (wallet: { address: string } | null) => void;
}