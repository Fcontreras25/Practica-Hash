import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Crearcuenta from "./Crearcuenta"
import Login from "./Login"
import Nuevacontra from "./Nuevacontra"
import Restablecercontra from "./Restablecercontra"
import Bienvenida from "./Bienvenida";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/crear-cuenta" element={<Crearcuenta />}/>
          <Route path="/restablecer-contra" element={<Restablecercontra />}/>
          <Route path="/nueva-contra" element={<Nuevacontra />}/>
          <Route path="/bienvenida" element={<Bienvenida />}/>
         
      </Routes>
      
   </Router>
  )
}

export default App
