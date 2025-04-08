import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./landing/page";
import { Register } from "./register/page";
import { WelcomePage } from "./landing/welcomePage";
import { Login } from "./login/page";
import { Stores } from "./stores/page";

export const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/page" element={<Stores />} />
    </Routes>
  </Router>
);
