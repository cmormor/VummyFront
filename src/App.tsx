import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { WelcomePage } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Page } from "./pages/Page";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/page" element={<Page />} />
    </Routes>
  </Router>
);
