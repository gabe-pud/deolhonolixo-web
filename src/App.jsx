import { Aside } from "./components/Aside"
import { Container } from "./components/Container"
import { Mapa } from "./components/Mapa"
import { MenuHamburguer } from "./components/MenuHamburguer"

import { Login } from "./components/Login"
import { Register } from "./components/Register"

import { Admin } from "./components/Admin"
import { PrivateRoute } from "./components/PrivateRoute"

import { AuthProvider } from "./context/AuthContext"

import { useState } from "react"

import { MapaCompleto } from "./components/MapaCompleto"

import 'leaflet/dist/leaflet.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

function App() {
  const [bairroSelecionado, setBairroSelecionado] = useState("")

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">

          <Routes>

            {/* Tela principal */}
            <Route
              path="/"
              element={
                <Container>
                  <Aside
                    bairroSelecionado={bairroSelecionado}
                    setBairroSelecionado={setBairroSelecionado}
                  />

                  <Mapa bairroSelecionado={bairroSelecionado} />

                  <MenuHamburguer />
                </Container>
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* Registro */}
            <Route
              path="/register"
              element={<Register />}
            />

            {/* Painel Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />

            <Route
              path="/mapa"
              element={<MapaCompleto />}
            />

          </Routes>

        </div>
      </Router>
    </AuthProvider>
  )
}

export default App