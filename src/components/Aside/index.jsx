import { Alert } from "../Alert"
import { Footer } from "../Footer"
import { CollectionForecast } from "../CollectionForecast"
import { Time } from "../Time"
import { LatestCollections } from "../LatestCollections"
import { Dropdown } from "../Dropdown"


export const Aside = ({ bairroSelecionado, setBairroSelecionado }) => {
  return (
    <aside className="w-[555px] min-h-screen flex flex-col relative z-50 shadow-[10px_0px_10px_-3px_rgba(0,0,0,0.3)]">
      {/* O Dropdown avisa qual bairro foi clicado */}
      <Dropdown onSelect={(nome) => setBairroSelecionado(nome)} />

      <p className="text-center text-[32px] mt-[24px] font-semibold mb-0 pb-0 tracking-tight">
        A coleta chegará no bairro em:
      </p>
      <Time bairro={bairroSelecionado} />
      <CollectionForecast bairro={bairroSelecionado} />
      <Alert />
      <LatestCollections bairro={bairroSelecionado} />
      <Footer />
    </aside>
  )
}

