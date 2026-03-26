import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/loginPage";
import RegisterPage from "./components/pages/registerPage";
import { VerifyEmailPage } from "./components/pages/verifyEmailPage";
import { useAuth } from "./contexts/AuthContext";
import { Spinner } from "./components/ui/spinner";
import { ProfilePage } from "./components/pages/profilePage";
import { ResetPasswordPage } from "./components/pages/resetPasswordPage";
import Feed from "./components/pages/feedPage";
import ZonesPage from "./components/pages/zonesPage";
import ZoneDetails from "./components/pages/zoneDetailsPage";
import EditLostItemPost from "./components/pages/editLostItemPost";
import CreateLostItemPost from "./components/pages/createLostItemPost";
import LostItemDetails from "./components/pages/lostItemDetailsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-email/:token"
        element={
          <PublicRoute>
            <VerifyEmailPage />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/zones" element={<ZonesPage />} />
      <Route path="/zones/:id" element={<ZoneDetails />} />

      <Route path="/create-post" element={<CreateLostItemPost />} />
      <Route path="/:id/edit-post" element={<EditLostItemPost />} />

      <Route path="/:id" element={<LostItemDetails />} />
    </Routes>
  );
};

export default App;
