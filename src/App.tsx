import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./landing/page";
import { Register } from "./register/page";
import { Login } from "./login/page";
import { Stores } from "./stores/page";
import { Maintenance } from "./components/Maintenance";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/page" element={<Stores />} />
      <Route path="/stores/mantenimiento" element={<Maintenance />} />
    </Routes>
  </Router>
);
