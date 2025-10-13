import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../api/authAPI";
import { verify } from "../api/authAPI";

/**
 * Usage:
 * <ProtectedRoute allowed={["org"]}><OrgDashboard/></ProtectedRoute>
 * <ProtectedRoute allowed={["user"]}><UserHome/></ProtectedRoute>
 * <ProtectedRoute><Settings/></ProtectedRoute> // any logged-in type
 */
export default function ProtectedRoute({ children, allowed, redirectToDashboard = false}) {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = getToken();
      if (!token) { if (alive) setState({ loading: false, user: null }); return; }
      const { user } = await verify(); // returns { user } or { user: null }
      if (alive) setState({ loading: false, user });
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) return null; //Or some loader stuffz

  if (!state.user) return <Navigate to="/login" replace />;

  if (redirectToDashboard && state.user.type == "org")  return <Navigate to="/dashboard" replace />;
  
  if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(state.user.type)) {
    const home = state.user.type === "org" ? "/org/home" : "/user/home";
    return <Navigate to={home} replace />;
  }
  return children;
}
