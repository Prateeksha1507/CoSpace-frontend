import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import UserHome from './screens/users/UserHome';
import OrgHome from './screens/orgs/OrgHome';
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
import ChatsPage from './screens/ChatsPage';
import EventDetails from './screens/EventDetails';
import MyProfile from './screens/users/MyProfile';

import ProtectedRoute from "./routes/ProtectedRoute"
import UserProfilePage from './screens/UserProfile';
import EditEvent from './screens/orgs/EditEvent';
import AppToastContainer from './components/ToastContainer';
import SearchResults from './screens/SearchResults';
import Layout from './components/Layout';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* All routes share Header + Footer from Layout */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute allowed={[""]}>
                  <UserHome />
                </ProtectedRoute>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/organization" element={<OrgRegister />} />
            <Route path="/register/organisation" element={<OrgRegister />} />
            <Route path="/register/verification" element={<Verification />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Public info */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/details/eventid/*" element={<NotificationsPage />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/profile/user/:id" element={<UserProfilePage />} />
            <Route path="/profile/org/:id" element={<OrgProfile />} />

            {/* Authenticated pages */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <ChatsPage />
                </ProtectedRoute>
              }
            />

            {/* User-only */}
            <Route
              path="/user/home"
              element={
                <ProtectedRoute allowed={["user"]}>
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute allowed={["user"]} redirectToDashboard>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            {/* Org-only */}
            <Route
              path="/org/home"
              element={
                <ProtectedRoute allowed={["org"]}>
                  <OrgHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowed={["org"]}>
                  <OrgDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute allowed={["org"]}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-event/:eventId"
              element={
                <ProtectedRoute allowed={["org"]}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <AppToastContainer />
    </>
  );
}


export default App;
