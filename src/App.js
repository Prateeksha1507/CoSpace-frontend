import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserHome from './screens/users/UserHome';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/" element={<UserHome />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </>
  );
}

export default App;
