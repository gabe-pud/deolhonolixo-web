import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import { useEffect, useRef } from "react"

// Exemplo de GeoJSON simplificado (cada bairro teria suas coordenadas reais)
const bairrosGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        Bairro: "Canto do Forte",
        Dias: ["Segunda", "Quarta", "Sexta"],
        Período: "Manhã",
        Horário: "08h"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-46.4124, -24.0053],
            [-46.4120, -24.0050],
            [-46.4115, -24.0055],
            [-46.4124, -24.0053]
          ]
        ]
      }
    },
    // ... adicionar os outros bairros
  ]
}

// Função para verificar se o bairro tem coleta hoje
function isColetaHoje(props) {
  const hoje = new Date()
  const diaSemana = hoje.getDay() // 0=domingo, 1=segunda...
  const diasMap = {
    0: "Domingo",
    1: "Segunda",
    2: "Terça",
    3: "Quarta",
    4: "Quinta",
    5: "Sexta",
    6: "Sábado"
  }
  return props.Dias.includes(diasMap[diaSemana])
}

export const Mapa = ({ bairroSelecionado }) => {
  const mapRef = useRef()

  // Centralizar no bairro selecionado
  useEffect(() => {
    if (!bairroSelecionado || !mapRef.current) return

    const map = mapRef.current
    const feature = bairrosGeoJson.features.find(
      (f) => f.properties.Bairro === bairroSelecionado
    )

    if (feature) {
      const layer = L.geoJSON(feature)
      map.fitBounds(layer.getBounds(), { padding: [50, 50] })
    }
  }, [bairroSelecionado])

  return (
    <div className="w-full min-h-screen z-[1]">
      <MapContainer
        center={[-24.0053, -46.4124]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={bairrosGeoJson}
          style={(feature) => {
            const ativo = isColetaHoje(feature.properties)
            return {
              color: ativo ? "#7083D9" : "#A6A6A6",
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.3,
              fillColor: ativo ? "#7083D9" : "#A6A6A6"
            }
          }}
          onEachFeature={(feature, layer) => {
            const props = feature.properties
            const dias = props.Dias.join(", ")
            const popupContent = `
              <div>
                <b>${props.Bairro}</b><br>
                <strong>Dias:</strong> ${dias}<br>
                <strong>Período:</strong> ${props.Período}<br>
                <strong>Horário:</strong> ${props.Horário}
              </div>
            `
            layer.bindPopup(popupContent)
          }}
        />
      </MapContainer>
    </div>
  )
}
