import { useEffect, useState } from "react"

const horariosColeta = {
  manhaSegQuaSex: {
    bairros: ["Aviação", "Boqueirão", "Tupi", "Canto do Forte", "Guilhermina", "Sítio do Campo", "aviacao", "boqueirao", "tupi", "canto do forte", "guilhermina", "sitio do campo"],
    horaInicio: 8,
    horaFim: 12,
    dias: [1, 3, 5] // segunda, quarta, sexta
  },
  tardeSegQuaSex: {
    bairros: ["Solemar", "Esmeralda", "Flórida", "Melvi", "Princesa", "Ribeirópolis", "Samambaia", "Cidade da Criança", "Sítio do Campo", "solemar", "esmeralda", "florida", "melvi", "princesa", "ribeiropolis", "samambaia", "cidade da crianca", "sitio do campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [1, 3, 5]
  },
  manhaTerQui: {
    bairros: ["Caiçara", "Maracanã", "Mirim", "Ocian", "Real", "caicara", "maracana", "mirim", "ocian", "real"],
    horaInicio: 8,
    horaFim: 12,
    dias: [2, 4] // terça, quinta
  },
  tardeTerQui: {
    bairros: ["Anhanguera", "Antártica", "Glória", "Nova Mirim", "Quietude", "Santa Marina", "Tupiry", "Vila Sônia", "Sítio do Campo", "anhanguera", "antartica", "gloria", "nova mirim", "quietude", "santa marina", "tupiry", "vila sonia", "sitio do campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [2, 4]
  }
}

function calcularTempoRestante(bairro) {
  if (!bairro) return "--:--:--"

  const agora = new Date()
  const diaSemana = agora.getDay() // 0=domingo, 1=segunda...
  const horaAtual = agora.getHours()
  const minutoAtual = agora.getMinutes()
  const segundoAtual = agora.getSeconds()

  const grupo = Object.values(horariosColeta).find(g => g.bairros.includes(bairro))
  if (!grupo) return "--:--:--"

  // Verifica se hoje é dia de coleta
  if (grupo.dias.includes(diaSemana)) {
    // Se já está dentro do período da coleta
    if (horaAtual >= grupo.horaInicio && horaAtual <= grupo.horaFim) {
      return "00:00:00"
    }
    // Se ainda não começou hoje
    if (horaAtual < grupo.horaInicio) {
      const agoraEmSegundos = horaAtual * 3600 + minutoAtual * 60 + segundoAtual
      const inicioEmSegundos = grupo.horaInicio * 3600
      const diffSeg = inicioEmSegundos - agoraEmSegundos
      const horas = Math.floor(diffSeg / 3600)
      const minutos = Math.floor((diffSeg % 3600) / 60)
      const segundos = diffSeg % 60
      return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
    }
  }

  // Caso contrário, calcular para o próximo dia de coleta
  let diasAteProxima = 0
  for (let i = 1; i <= 7; i++) {
    const futuroDia = (diaSemana + i) % 7
    if (grupo.dias.includes(futuroDia)) {
      diasAteProxima = i
      break
    }
  }

  const agoraEmSegundos = horaAtual * 3600 + minutoAtual * 60 + segundoAtual
  const inicioEmSegundos = grupo.horaInicio * 3600
  const diffSeg = diasAteProxima * 24 * 3600 + inicioEmSegundos - agoraEmSegundos
  const horas = Math.floor(diffSeg / 3600)
  const minutos = Math.floor((diffSeg % 3600) / 60)
  const segundos = diffSeg % 60
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
}

export const Time = ({ bairro }) => {
  const [tempo, setTempo] = useState("00:00:00")

  useEffect(() => {
    const atualizar = () => setTempo(calcularTempoRestante(bairro))
    atualizar()
    const interval = setInterval(atualizar, 1000) // atualiza a cada segundo
    return () => clearInterval(interval)
  }, [bairro])

  return (
    <p className="text-center font-bold p-0 m-0 text-[96px] text-[#7083D9] tracking-tight">
      {tempo}
    </p>
  )
}
