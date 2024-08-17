import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home/Home';
import Layout from './Layout/Layout';

import Setting from './Setting/Setting';
import Statistical from './Statistical/Statistical';
import AnimCursor from './AnimCursor/AnimCursor';
import GlowingCursor from './AnimCursor/GlowingCursor';
import TrailingCursor from './AnimCursor/TrailingCursor';
import Login from './LoginAndRegister/Login/Login';
import Profile from './Profile/Profile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {/* <AnimCursor /> */}
      {/* <GlowingCursor /> */}
      <TrailingCursor />
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Layout onLogout={handleLogout}><Home /></Layout> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/settings" element={isLoggedIn ? <Layout onLogout={handleLogout}><Setting /></Layout> : <Navigate to="/" />} />
          <Route path="/home" element={isLoggedIn ? <Layout onLogout={handleLogout}><Home /></Layout> : <Navigate to="/" />} />
          <Route path="/statistical" element={isLoggedIn ? <Layout onLogout={handleLogout}><Statistical /></Layout> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Layout onLogout={handleLogout}><Profile /></Layout> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>

  );
};

export default App;
