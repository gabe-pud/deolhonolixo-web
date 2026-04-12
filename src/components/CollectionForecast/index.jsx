import { useEffect, useState } from "react"

const horariosColeta = {
  manhaSegQuaSex: {
    bairros: ["Aviação", "Boqueirão", "Tupi", "Canto do Forte", "Guilhermina", "Sítio do Campo"],
    horaInicio: 8,
    horaFim: 12,
    dias: [1, 3, 5] // segunda, quarta, sexta
  },
  tardeSegQuaSex: {
    bairros: ["Solemar", "Esmeralda", "Flórida", "Melvi", "Princesa", "Ribeirópolis", "Samambaia", "Cidade da Criança", "Sítio do Campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [1, 3, 5]
  },
  manhaTerQui: {
    bairros: ["Caiçara", "Maracanã", "Mirim", "Ocian", "Real"],
    horaInicio: 8,
    horaFim: 12,
    dias: [2, 4] // terça, quinta
  },
  tardeTerQui: {
    bairros: ["Anhanguera", "Antártica", "Glória", "Nova Mirim", "Quietude", "Santa Marina", "Tupiry", "Vila Sônia", "Sítio do Campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [2, 4]
  }
}

function calcularProximaColeta(bairro) {
  if (!bairro) return { data: "--/--/----", hora: "--:--" }

  const agora = new Date()
  const diaSemana = agora.getDay() // 0=domingo, 1=segunda...
  const horaAtual = agora.getHours()

  const grupo = Object.values(horariosColeta).find(g => g.bairros.includes(bairro))
  if (!grupo) return { data: "--/--/----", hora: "--:--" }

  // Se hoje é dia de coleta
  if (grupo.dias.includes(diaSemana)) {
    // Se está dentro do período da coleta
    if (horaAtual >= grupo.horaInicio && horaAtual <= grupo.horaFim) {
      return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: `${String(grupo.horaInicio).padStart(2, "0")}:00`
      }
    }
    // Se ainda não começou hoje
    if (horaAtual < grupo.horaInicio) {
      return {
        data: agora.toLocaleDateString("pt-BR"),
        hora: `${String(grupo.horaInicio).padStart(2, "0")}:00`
      }
    }
  }

  // Caso contrário, calcular próximo dia válido
  let diasAteProxima = 0
  for (let i = 1; i <= 7; i++) {
    const futuroDia = (diaSemana + i) % 7
    if (grupo.dias.includes(futuroDia)) {
      diasAteProxima = i
      break
    }
  }

  const proximaData = new Date(agora)
  proximaData.setDate(agora.getDate() + diasAteProxima)

  return {
    data: proximaData.toLocaleDateString("pt-BR"),
    hora: `${String(grupo.horaInicio).padStart(2, "0")}:00`
  }
}

export const CollectionForecast = ({ bairro }) => {
  const [forecast, setForecast] = useState({ data: "--/--/----", hora: "--:--" })

  useEffect(() => {
    const atualizar = () => setForecast(calcularProximaColeta(bairro))
    atualizar()
    const interval = setInterval(atualizar, 60000) // atualiza a cada minuto
    return () => clearInterval(interval)
  }, [bairro])

  return (
    <div className="bg-[#7083D9] rounded-[14px] flex flex-col gap-[22px] ml-[28px] mr-[28px] text-white p-[24px] text-[30px] shadow-[10px_10px_10px_-3px_rgba(0,0,0,0.3)] tracking-tight">
      <div className="flex justify-between">
        <p className="font-bold">Próxima Coleta:</p>
        <p>{forecast.data}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-bold">Horário Previsto:</p>
        <p>{forecast.hora}</p>
      </div>
    </div>
  )
}
