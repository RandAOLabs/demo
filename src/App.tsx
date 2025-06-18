import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {  Analytics, Loading } from './shared/components'
import { createRoute } from './utils/routing'
import Home from './pages/Home/Home'
import { WalletProvider } from './context/WalletContext'
import { TokenProvider } from './context/TokenContext'

// Create route with automatic eager loading
const About = createRoute(() => import('./pages/About/About'))

function App() {
  return (
    <WalletProvider>
      <TokenProvider>
        <BrowserRouter>
          <Analytics>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Suspense>
          </Analytics>
        </BrowserRouter>
      </TokenProvider>
    </WalletProvider>
  )
}

export default App
