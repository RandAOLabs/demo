import { 
  ConnectWalletButton, 
  Mint, 
  Topbar, 
  TokenBalance, 
  RandomNumberGenerator, 
  SocialLinks,
  Announcement 
} from '../../shared/components'
import { useWallet } from '../../context/WalletContext'
import './Home.css'

const Home = () => {
  const { isConnected } = useWallet()

  return (
    <div className="app-container">
      <Announcement message="This application is currently under active development. All tokens are for testing purposes only and hold no monetary value. Some features may be unstable. Some users may experience delays due to high network traffic." />
      <Topbar />
      <div className="content-container">
        {!isConnected ? (
          <ConnectWalletButton />
        ) : (
          <div className="connected-content">
            <div className="mint-section">
              <Mint />
              <TokenBalance />
            </div>
            <div className="rng-section">
              <RandomNumberGenerator />
            </div>
          </div>
        )}
      </div>
      <SocialLinks />
    </div>
  )
}

export default Home
