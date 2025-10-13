import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserHome from './screens/users/UserHome';
import OrgHome from './screens/orgs/OrgHome';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './screens/LogIn';
import Register from './screens/Register';
import UserRegister from './screens/users/UserRegister';
import OrgRegister from './screens/orgs/OrgRegister';
import Verification from './screens/orgs/Verification';
import AboutPage from './screens/About';
import PrivacyPolicy from './screens/Policy';
import TermsAndConditions from './screens/Terms';
import ContactPage from './screens/Contact';
import NotificationsPage from './screens/NotificationPage';
import Settings from './screens/Settings';
import CreateEvent from './screens/orgs/CreateEvent';
import OrgDashboard from './screens/orgs/OrgDashboard';
import OrgProfile from './screens/OrgProfile';
import UserProfile from './screens/UserProfile';
import ChatsPage from './screens/ChatsPage';
import EventDetails from './screens/EventDetails';
import MyProfile from './screens/users/MyProfile';

import ProtectedRoute from "./routes/ProtectedRoute"
import UserProfilePage from './screens/UserProfile';

function App() {
  return (
    <>
      <BrowserRouter>
      <Header loggedIn={true}/>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute allowed={[""]}>
              <UserHome />
            </ProtectedRoute>
            } />
          {/* Auth stuffs, avaulable for all */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/organization" element={<OrgRegister />} />
          <Route path="/register/organisation" element={<OrgRegister />} />
          <Route path="/register/verification" element={<Verification />} />

          {/* Product detai;s, avaulable for all */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* General info, same for all users, not necessarily logged in */}
          <Route path="/details/eventid/*" element={<NotificationsPage />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="profile/user/:id" element={<UserProfilePage />} />
          <Route path="/profile/org/:id" element={<OrgProfile />} />

          {/* Info specif to user/orgs */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/chats" element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          } />

          {/* Only for users */}
          <Route path="/user/home" element={
            <ProtectedRoute allowed={["user"]}>
              <UserHome />
            </ProtectedRoute>
          } />
          <Route path="/my-profile" element={
            <ProtectedRoute allowed={["user"]} redirectToDashboard={true}>
              <MyProfile />
            </ProtectedRoute>
          } />

          {/* Only for orgs */}
          <Route path="/org/home" element={
            <ProtectedRoute allowed={["org"]}>
              <OrgHome />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowed={["org"]}>
              <OrgDashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute allowed={["org"]}>
              <CreateEvent />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
