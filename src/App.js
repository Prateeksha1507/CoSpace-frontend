import "./App.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout"; // keep eager so header/footer appear right away
import AppToastContainer from "./components/ToastContainer";
import { OverlaySpinner } from "./components/LoadingSpinner"; // fallback spinner

/** Lazy pages (code-split) */
const UserHome = lazy(() => import("./screens/users/UserHome"));
const OrgHome = lazy(() => import("./screens/orgs/OrgHome"));
const Login = lazy(() => import("./screens/LogIn"));
const Register = lazy(() => import("./screens/Register"));
const UserRegister = lazy(() => import("./screens/users/UserRegister"));
const OrgRegister = lazy(() => import("./screens/orgs/OrgRegister"));
const Verification = lazy(() => import("./screens/orgs/Verification"));
const AboutPage = lazy(() => import("./screens/About"));
const PrivacyPolicy = lazy(() => import("./screens/Policy"));
const TermsAndConditions = lazy(() => import("./screens/Terms"));
const ContactPage = lazy(() => import("./screens/Contact"));
const NotificationsPage = lazy(() => import("./screens/NotificationPage"));
const Settings = lazy(() => import("./screens/Settings"));
const CreateEvent = lazy(() => import("./screens/orgs/CreateEvent"));
const OrgDashboard = lazy(() => import("./screens/orgs/OrgDashboard"));
const OrgProfile = lazy(() => import("./screens/OrgProfile"));
const ChatsPage = lazy(() => import("./screens/ChatsPage"));
const EventDetails = lazy(() => import("./screens/EventDetails"));
const MyProfile = lazy(() => import("./screens/users/MyProfile"));
const UserProfilePage = lazy(() => import("./screens/UserProfile"));
const EditEvent = lazy(() => import("./screens/orgs/EditEvent"));
const SearchResults = lazy(() => import("./screens/SearchResults"));

function App() {
  return (
    <>
      <BrowserRouter>
        {/* Suspense wraps all routes so fallback shows on any page load */}
        <Suspense fallback={<OverlaySpinner label="Loading page…" />}>
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
        </Suspense>
      </BrowserRouter>

      <AppToastContainer />
    </>
  );
}

export default App;
