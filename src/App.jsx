import { Aside } from "./components/Aside"
import { Container } from "./components/Container"
import { Mapa } from "./components/Mapa"
import { useState } from "react"
import 'leaflet/dist/leaflet.css';

function App() {
  const [bairroSelecionado, setBairroSelecionado] = useState("")

  return (
    <div className="min-h-screen">
      <Container>
        <Aside
          bairroSelecionado={bairroSelecionado}
          setBairroSelecionado={setBairroSelecionado}
        />
        <Mapa bairroSelecionado={bairroSelecionado} />
      </Container>
    </div>
  )
}

export default App
