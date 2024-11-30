import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./pages/layout";
import Crearcuenta from "./pages/Crearcuenta";
import Login from "./pages/Login";
import Nuevacontra from "./pages/Nuevacontra";
import Restablecercontra from "./pages/Restablecercontra";
import Bienvenida from "./pages/Bienvenida";
import Criptografia1 from "./pages/Criptografia1";
import Criptografia2 from "./pages/Criptografia2";
import Criptografia3 from "./pages/Criptografia3";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/crear-cuenta" element={<Crearcuenta />} />
          <Route path="/restablecer-contra" element={<Restablecercontra />} />
          <Route path="/nueva-contra" element={<Nuevacontra />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/criptografia1" element={<Criptografia1 />} />
          <Route path="/criptografia2" element={<Criptografia2 />} />
          <Route path="/criptografia3" element={<Criptografia3 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
