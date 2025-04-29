import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";
import { Landing } from "./app/landing/page";
import { Register } from "./app/auth/register/page";
import { Login } from "./app/auth/login/page";
import { Stores } from "./app/stores/page";
import { Maintenance } from "./components/Maintenance";
import { NotFound } from "./app/not-found";
import { Clothes } from "./app/stores/clothes/page";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores/:storeId/clothes"
        element={
          <ProtectedRoute>
            <Clothes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores/maintenance"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);
