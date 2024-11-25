import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./Layout";
import Crearcuenta from "./Crearcuenta";
import Login from "./Login";
import Nuevacontra from "./Nuevacontra";
import Restablecercontra from "./Restablecercontra";
import Bienvenida from "./Bienvenida";
import Criptografia1 from "./Criptografia1";
import Criptografia2 from "./Criptografia2";
import Criptografia3 from "./Criptografia3";

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
