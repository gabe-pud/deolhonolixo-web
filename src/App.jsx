import { Aside } from "./components/Aside"
import { Container } from "./components/Container"
import { Mapa } from "./components/Mapa"

function App() {

  return (
    <div className="min-h-screen">
      <Container>
        <Aside />
        <Mapa/>
      </Container>
    </div>
  )
}

export default App
