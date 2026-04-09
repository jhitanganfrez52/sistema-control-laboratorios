import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Aux from "./pages/Auxi";

import LoginAdmin from "./pages/LoginForm";
import LoginAux from "./pages/LoginAux";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🟦 ADMIN */}
        <Route path="/" element={<Home />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/admin" element={<Admin />} />

        {/* 🟩 AUXILIAR */}
        <Route path="/login-aux" element={<LoginAux />} />
        <Route path="/aux" element={<Aux />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;