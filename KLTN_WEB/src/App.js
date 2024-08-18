import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import TrailingCursor from './AnimCursor/TrailingCursor';
import './App.css';
import Home from './Home/Home';
import Layout from './Layout/Layout';
import Auth from './LoginAndRegister/Auth/Auth';
import Login from './LoginAndRegister/Login/Login';
import Notification from './Notification/Notification';
import Profile from './Profile/Profile';
import Setting from './Setting/Setting';
import Statistical from './Statistical/Statistical';

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
      {/* Uncomment the cursor components as needed */}
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/notification" element={isLoggedIn ? <Layout onLogout={handleLogout}><Notification /></Layout> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
