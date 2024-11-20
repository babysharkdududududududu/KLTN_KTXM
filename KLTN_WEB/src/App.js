import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import TrailingCursor from './AnimCursor/TrailingCursor';
import './App.css';
import ApproveRoom from './ApproveRoom/ApproveRoom';
import { UserProvider, useUser } from './Context/Context';
import { WebSocketProvider } from './Context/WebSocketContext';
import Contract from './Contract/Contract';
import Discipline from './Discipline/Discipline';
import DormSubmit from './DormSubmit/DormSubmit';
import Equipment from './Equipment/Equipment';
import Home from './Home/Home';
import Layout from './Layout/Layout';
import Auth from './LoginAndRegister/Auth/Auth';
import Login from './LoginAndRegister/Login/Login';
import Maintenance from './Maintance/Maintenance';
import Notification from './Notification/Notification';
import Payment from './Payment/Payment';
import Profile from './Profile/Profile';
import RoomInfo from './RoomInfo/RoomInfo';
import Room from './Rooms/Room';
import Setting from './Setting/Setting';
import Statistical from './Statistical/Statistical';
import SuccessPage from './Payment/Success';
import CreateUser from './UserManagement/CreateUser'
import DormBill from './DormBill/DormBill';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div style={{ backgroundColor: "#e7ecf0", height: '100vh', width: '100%' }}>
      <UserProvider>
        <UserConsumerWrapper isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLoginSuccess={handleLoginSuccess} />
      </UserProvider>
    </div>
  );
};

const UserConsumerWrapper = ({ isLoggedIn, handleLogout, handleLoginSuccess }) => {
  const { setRoleId, setUserId } = useUser();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const mssv = localStorage.getItem('userId');

    setRoleId(role);
    setUserId(mssv);
  }, [setRoleId, setUserId]);

  return (
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
          <Route path="/equipment" element={isLoggedIn ? <Layout onLogout={handleLogout}><Equipment /></Layout> : <Navigate to="/" />} />
          <Route path="/dorm-submit" element={isLoggedIn ? <Layout onLogout={handleLogout}><DormSubmit /></Layout> : <Navigate to="/" />} />
          <Route path="/discipline" element={isLoggedIn ? <Layout onLogout={handleLogout}><Discipline /></Layout> : <Navigate to="/" />} />
          <Route path="/success" element={isLoggedIn ? <Layout onLogout={handleLogout}><SuccessPage /></Layout> : <Navigate to="/" />} />
          <Route path="/payment" element={isLoggedIn ? <Layout onLogout={handleLogout}><Payment /></Layout> : <Navigate to="/" />} />
          <Route path="/create-user" element={isLoggedIn ? <Layout onLogout={handleLogout}><CreateUser /></Layout> : <Navigate to="/" />} />
          <Route path="/dorm-bill" element={isLoggedIn ? <Layout onLogout={handleLogout}><DormBill /></Layout> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
