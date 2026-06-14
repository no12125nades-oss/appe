import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Rankings from './pages/Rankings'
import Matches from './pages/Matches'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'
import { SocialLinks } from './components/SocialLinks'
import { useState } from 'react'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const openLogin = () => { setAuthTab('login'); setAuthOpen(true); };
  const openRegister = () => { setAuthTab('register'); setAuthOpen(true); };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#121212] transition-colors duration-300">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Home onLoginClick={openLogin} />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <SocialLinks />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </div>
  )
}
