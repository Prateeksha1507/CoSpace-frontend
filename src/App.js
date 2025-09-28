import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserHome from './screens/users/UserHome';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './screens/LogIn';
import Register from './screens/Register';
import UserRegister from './screens/users/UserRegister';
import OrgRegister from './screens/orgs/OrgRegister';
import Verification from './screens/orgs/Verification';

function App() {
  return (
    <>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/" element={<UserHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/organization" element={<OrgRegister />} />
          <Route path="/register/organisation" element={<OrgRegister />} />
          <Route path="/register/verification" element={<Verification />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </>
  );
}

export default App;
