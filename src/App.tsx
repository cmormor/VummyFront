import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./app/auth/ProtectedRoute";
import { Landing } from "./app/landing/page";
import { Register } from "./app/auth/register/page";
import { Login } from "./app/auth/login/page";
import { Stores } from "./app/stores/page";
import { Maintenance } from "./components/Maintenance";
import { NotFound } from "./app/not-found";
import { Clothes } from "./app/stores/clothes/page";
import { Settings } from "./app/settings/page";
import { Clothe } from "./app/stores/clothes/[id]/page";
import { ShoppingCart } from "./app/shopping-cart/page";
import { Orders } from "./app/orders/page";
import { ResetPassword } from "./app/auth/login/ResetPassword";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
        path="/clothes/:clotheId"
        element={
          <ProtectedRoute>
            <Clothe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shoppingcart"
        element={
          <ProtectedRoute>
            <ShoppingCart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
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
        path="/stores/maintenance"
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
