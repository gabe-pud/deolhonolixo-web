import { Aside } from "./components/Aside"
import { Container } from "./components/Container"
import { Mapa } from "./components/Mapa"
import { MenuHamburguer } from "./components/MenuHamburguer"
import { useState } from "react"
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Login } from "./components/Login"

function App() {
  const [bairroSelecionado, setBairroSelecionado] = useState("")

  return (
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

          {/* Tela de login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
