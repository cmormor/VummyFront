import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";
import { Landing } from "./app/landing/page";
import { Register } from "./app/auth/register/page";
import { Login } from "./app/auth/login/page";
import { Stores } from "./app/stores/page";
import { Maintenance } from "./components/Maintenance";
import { NotFound } from "./app/not-found";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/page"
        element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores/mantenimiento"
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
