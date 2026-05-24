import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoute = ({ children }) => {

  const { user, loading } = useAuth();

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#0B0F19]">

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4 mx-auto"></div>

          <p className="text-slate-400">
            Loading...
          </p>

        </div>

      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // NOT VERIFIED
  if (!user.verified) {
    return (
      <Navigate
        to={`/verify-email?email=${user.email}`}
        replace
      />
    );
  }

  // VERIFIED USER
  return children;
};