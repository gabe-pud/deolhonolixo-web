import { useEffect, useState } from "react"
import { urbanGeometryService } from "../../services/urbanGeometryService"

const formatBairroName = (name) => {
  if (!name) return ""

  return String(name)
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const formatCollectionDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return "Não informado"
  }

  return days.join(", ")
}

export const ColetaLixoInfo = ({ bairro, urbanGeometry: urbanGeometryProp }) => {
  const [urbanGeometry, setUrbanGeometry] = useState(urbanGeometryProp || null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    let ativo = true

    const carregarUrbanGeometry = async () => {
      if (urbanGeometryProp) {
        setUrbanGeometry(urbanGeometryProp)
        setErro("")
        return
      }

      if (!bairro) {
        setUrbanGeometry(null)
        setErro("")
        return
      }

      setCarregando(true)
      setErro("")

      try {
        const data = await urbanGeometryService.getUrbanGeometryByName(bairro)

        if (!ativo) {
          return
        }

        setUrbanGeometry(data)
      } catch {
        if (!ativo) {
          return
        }

        setUrbanGeometry(null)
        setErro("Não foi possível carregar as informações da coleta.")
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregarUrbanGeometry()

    return () => {
      ativo = false
    }
  }, [bairro, urbanGeometryProp])

  if (carregando) {
    return <p className="text-center mt-4">Buscando informações da coleta...</p>
  }

  if (erro) {
    return <p className="text-center mt-4 text-red-500">{erro}</p>
  }

  if (!urbanGeometry) {
    return null
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 max-w-[500px] mx-auto">
      <h2 className="text-2xl font-bold text-[#7083D9] mb-4">
        {formatBairroName(urbanGeometry.name || bairro)}
      </h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          <strong>📅 Dias:</strong> {formatCollectionDays(urbanGeometry.collectionDays)}
        </p>
        <p className="text-gray-700">
          <strong>⏰ Período:</strong> {urbanGeometry.collectionPeriod || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>🕒 Horário:</strong> {urbanGeometry.collectionTime || "Não informado"}
        </p>
      </div>
    </div>
  )
}
