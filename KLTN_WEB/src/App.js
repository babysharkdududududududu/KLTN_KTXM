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
import ApproveRoom from './ApproveRoom/ApproveRoom';
import Room from './Rooms/Room';
import { UserProvider } from './Context/Context';
import { WebSocketProvider } from './Context/WebSocketContext';
import RoomInfo from './RoomInfo/RoomInfo';
import Contract from './Contract/Contract';
import Maintenance from './Maintance/Maintenance';
import NotificationBadge from './Context/NotificationBadge';
import Equipment from './Equipment/Equipment';
import DormSubmit from './DormSubmit/DormSubmit';
import Discipline from './Discipline/Discipline';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div style={{ background: "#e7ecf0", height: '100vh', width: '100%' }}>
      {/* Uncomment the cursor components as needed */}
      {/* <AnimCursor /> */}
      {/* <GlowingCursor /> */}
      <UserProvider>
        <WebSocketProvider>
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
              <Route path="/room" element={isLoggedIn ? <Layout onLogout={handleLogout}><Room /></Layout> : <Navigate to="/" />} />
              <Route path="/room-info" element={isLoggedIn ? <Layout onLogout={handleLogout}><RoomInfo /></Layout> : <Navigate to="/" />} />
              <Route path="/maintenance" element={isLoggedIn ? <Layout onLogout={handleLogout}><Maintenance /></Layout> : <Navigate to="/" />} />
              <Route path="/contract" element={isLoggedIn ? <Layout onLogout={handleLogout}><Contract /></Layout> : <Navigate to="/" />} />
              <Route path="/approve-room" element={isLoggedIn ? <Layout onLogout={handleLogout}><ApproveRoom /></Layout> : <Navigate to="/" />} />
              <Route path="/equiment" element={isLoggedIn ? <Layout onLogout={handleLogout}><Equipment /></Layout> : <Navigate to="/" />} />
              <Route path="/dorm-submit" element={isLoggedIn ? <Layout onLogout={handleLogout}><DormSubmit /></Layout> : <Navigate to="/" />} />
              <Route path="/discipline" element={isLoggedIn ? <Layout onLogout={handleLogout}><Discipline /></Layout> : <Navigate to="/" />} />

            </Routes>
          </Router>
        </WebSocketProvider>
      </UserProvider>
    </div>
  );
};

export default App;
