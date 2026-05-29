import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import { useEffect, useRef } from "react"
import L from "leaflet"
import { bairrosGeoJson } from "../bairrosGeoJson"

function isColetaHoje(props) {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const diasMap = {
    0: "Domingo",
    1: "Segunda",
    2: "Terça",
    3: "Quarta",
    4: "Quinta",
    5: "Sexta",
    6: "Sábado"
  }
  const dias = props?.Dias
  if (!dias) return false
  const diasText = Array.isArray(dias) ? dias.join(" ") : String(dias)
  return diasText.toLowerCase().includes(diasMap[diaSemana].toLowerCase())
}

function formatDias(dias) {
  if (!dias) return "Não informado"
  return Array.isArray(dias) ? dias.join(", ") : String(dias)
}

const normalizeBairro = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

export const Mapa = ({ bairroSelecionado }) => {
  const mapRef = useRef(null)

  const selectedFeature = bairroSelecionado
    ? bairrosGeoJson.features.find(
        (f) => normalizeBairro(f.properties.Bairro) === normalizeBairro(bairroSelecionado)
      )
    : null

  const fitFeatureBounds = (map, feature) => {
    const layer = L.geoJSON(feature)
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50] })
    }
  }

  useEffect(() => {
    if (!selectedFeature || !mapRef.current) return
    fitFeatureBounds(mapRef.current, selectedFeature)
  }, [selectedFeature])

  const selectedGeojson = selectedFeature
    ? { type: "FeatureCollection", features: [selectedFeature] }
    : null

  return (
    <div className="w-full min-h-screen z-1">
      <MapContainer
        center={[-23.9967, -46.4332]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedGeojson && (
          <GeoJSON
            key={bairroSelecionado}
            data={selectedGeojson}
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
              const dias = formatDias(props.Dias)
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
        )}
      </MapContainer>
    </div>
  )
}
