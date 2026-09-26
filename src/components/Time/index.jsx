import { useEffect, useState } from "react"

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

const dayMatchers = [
  { index: 0, patterns: ["domingo", "dom"] },
  { index: 1, patterns: ["segunda", "seg"] },
  { index: 2, patterns: ["terca", "ter"] },
  { index: 3, patterns: ["quarta", "qua"] },
  { index: 4, patterns: ["quinta", "qui"] },
  { index: 5, patterns: ["sexta", "sex"] },
  { index: 6, patterns: ["sabado", "sab"] }
]

const dayToIndex = (day) => {
  if (typeof day === "number" && day >= 0 && day <= 6) return day

  const normalizedDay = normalizeText(day)
  const matchedDay = dayMatchers.find(({ patterns }) =>
    patterns.some((pattern) => normalizedDay.includes(pattern))
  )

  return matchedDay?.index
}

function calcularTempoRestante(urbanGeometry) {
  if (!urbanGeometry) return "--:--:--"

  const diasDeColeta = (urbanGeometry.collectionDays || [])
    .map(dayToIndex)
    .filter((day) => day !== undefined)
  const [hora = "", minuto = ""] = String(urbanGeometry.collectionTime || "").split(":")
  const horaColeta = Number.parseInt(hora, 10)
  const minutoColeta = Number.parseInt(minuto, 10)

  if (!diasDeColeta.length || Number.isNaN(horaColeta) || Number.isNaN(minutoColeta)) {
    return "--:--:--"
  }

  const agora = new Date()
  const inicioHoje = new Date(agora)
  inicioHoje.setHours(horaColeta, minutoColeta, 0, 0)

  if (diasDeColeta.includes(agora.getDay()) && agora <= inicioHoje) {
    return formatarDuracao(inicioHoje - agora)
  }

  for (let diasAteProxima = 1; diasAteProxima <= 7; diasAteProxima++) {
    const proximoDia = (agora.getDay() + diasAteProxima) % 7
    if (diasDeColeta.includes(proximoDia)) {
      const proximaColeta = new Date(inicioHoje)
      proximaColeta.setDate(inicioHoje.getDate() + diasAteProxima)
      return formatarDuracao(proximaColeta - agora)
    }
  }

  return "--:--:--"
}

function formatarDuracao(diferencaEmMilissegundos) {
  const totalSegundos = Math.max(0, Math.floor(diferencaEmMilissegundos / 1000))
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
}

export const Time = ({ urbanGeometry }) => {
  const [tempo, setTempo] = useState("--:--:--")

  useEffect(() => {
    const atualizar = () => setTempo(calcularTempoRestante(urbanGeometry))
    atualizar()
    const interval = setInterval(atualizar, 1000) // atualiza a cada segundo
    return () => clearInterval(interval)
  }, [urbanGeometry])

  return (
    <p className="text-center font-bold p-0 m-0 text-[96px] text-[#7083D9] tracking-tight">
      {tempo}
    </p>
  )
}
