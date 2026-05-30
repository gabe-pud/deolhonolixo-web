import { useEffect, useState } from "react"
import { urbanGeometryService } from "../../services/urbanGeometryService"

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
  if (typeof day === "number" && day >= 0 && day <= 6) {
    return day
  }

  const normalizedDay = normalizeText(day)
  const matchedDay = dayMatchers.find(({ patterns }) =>
    patterns.some((pattern) => normalizedDay.includes(pattern))
  )

  return matchedDay ? matchedDay.index : undefined
}

const parseCollectionTime = (time) => {
  if (!time) return { hour: 0, minute: 0, label: "--:--" }

  const [hourPart = "0", minutePart = "0"] = String(time).split(":")
  const hour = Number.parseInt(hourPart, 10)
  const minute = Number.parseInt(minutePart, 10)

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 0, minute: 0, label: "--:--" }
  }

  return {
    hour,
    minute,
    label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
  }
}

function calcularProximaColeta(urbanGeometry) {
  if (!urbanGeometry) return { data: "--/--/----", hora: "--:--" }

  const collectionDays = Array.isArray(urbanGeometry.collectionDays) ? urbanGeometry.collectionDays : []
  const normalizedDays = collectionDays
    .map(dayToIndex)
    .filter((day) => day !== undefined)

  if (normalizedDays.length === 0) {
    return { data: "--/--/----", hora: "--:--" }
  }

  const { hour, minute, label } = parseCollectionTime(urbanGeometry.collectionTime)
  const agora = new Date()
  const diaAtual = agora.getDay()
  const horaAtual = agora.getHours()
  const minutoAtual = agora.getMinutes()

  const hojeTemColeta = normalizedDays.includes(diaAtual)
  const horarioAtualEmMinutos = horaAtual * 60 + minutoAtual
  const horarioColetaEmMinutos = hour * 60 + minute

  if (hojeTemColeta && horarioAtualEmMinutos <= horarioColetaEmMinutos) {
    return {
      data: agora.toLocaleDateString("pt-BR"),
      hora: label
    }
  }

  let diasAteProxima = 0
  for (let i = 1; i <= 7; i++) {
    const futuroDia = (diaAtual + i) % 7
    if (normalizedDays.includes(futuroDia)) {
      diasAteProxima = i
      break
    }
  }

  const proximaData = new Date(agora)
  proximaData.setDate(agora.getDate() + diasAteProxima)

  return {
    data: proximaData.toLocaleDateString("pt-BR"),
    hora: label
  }
}

export const CollectionForecast = ({ bairro, urbanGeometry: urbanGeometryProp }) => {
  const [urbanGeometry, setUrbanGeometry] = useState(null)
  const [forecast, setForecast] = useState({ data: "--/--/----", hora: "--:--" })

  useEffect(() => {
    let isActive = true

    const loadUrbanGeometry = async () => {
      if (urbanGeometryProp) {
        setUrbanGeometry(urbanGeometryProp)
        setForecast(calcularProximaColeta(urbanGeometryProp))
        return
      }

      if (!bairro) {
        setUrbanGeometry(null)
        setForecast({ data: "--/--/----", hora: "--:--" })
        return
      }

      try {
        const data = await urbanGeometryService.getUrbanGeometryByName(bairro)

        if (!isActive) {
          return
        }

        setUrbanGeometry(data)
        setForecast(calcularProximaColeta(data))
      } catch {
        if (!isActive) {
          return
        }

        setUrbanGeometry(null)
        setForecast({ data: "--/--/----", hora: "--:--" })
      }
    }

    loadUrbanGeometry()

    return () => {
      isActive = false
    }
  }, [bairro, urbanGeometryProp])

  useEffect(() => {
    if (!urbanGeometry) {
      return
    }

    const atualizar = () => {
      setForecast(calcularProximaColeta(urbanGeometry))
    }

    atualizar()

    const interval = setInterval(atualizar, 60000) // atualiza a cada minuto

    return () => {
      clearInterval(interval)
    }
  }, [urbanGeometry])

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
