import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { urbanGeometryService } from "../../services/urbanGeometryService"

const normalizeText = (value = "") =>
  String(value)
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
  if (!time) return { hour: 0, minute: 0 }

  const [hourPart = "0", minutePart = "0"] = String(time).split(":")
  const hour = Number.parseInt(hourPart, 10)
  const minute = Number.parseInt(minutePart, 10)

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 0, minute: 0 }
  }

  return { hour, minute }
}

function isColetaHoje(props, urbanGeometrySelecionada) {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const horaAtualEmMinutos = hoje.getHours() * 60 + hoje.getMinutes()

  const collectionDays = urbanGeometrySelecionada?.collectionDays || props?.Dias || []
  const normalizedDays = (Array.isArray(collectionDays) ? collectionDays : [collectionDays])
    .map(dayToIndex)
    .filter((day) => day !== undefined)

  if (normalizedDays.length === 0) return false

  const collectionTime = urbanGeometrySelecionada?.collectionTime || props?.Horário
  const { hour, minute } = parseCollectionTime(collectionTime)
  const collectionTimeInMinutes = hour * 60 + minute

  return normalizedDays.includes(diaSemana) && horaAtualEmMinutos <= collectionTimeInMinutes
}

function formatDias(dias) {
  if (!dias) return "Não informado"
  return Array.isArray(dias) ? dias.join(", ") : String(dias)
}

const parseGeometry = (geometryValue) => {
  if (!geometryValue) return null

  if (typeof geometryValue === "string") {
    try {
      return JSON.parse(geometryValue)
    } catch {
      return null
    }
  }

  return geometryValue
}

const isCoordinatePair = (value) =>
  Array.isArray(value) &&
  value.length >= 2 &&
  Number.isFinite(Number(value[0])) &&
  Number.isFinite(Number(value[1]))

const closeRingIfNeeded = (ring) => {
  if (!Array.isArray(ring) || ring.length < 3) {
    return ring
  }

  const first = ring[0]
  const last = ring[ring.length - 1]

  if (!isCoordinatePair(first) || !isCoordinatePair(last)) {
    return ring
  }

  const isClosed = Number(first[0]) === Number(last[0]) && Number(first[1]) === Number(last[1])

  return isClosed ? ring : [...ring, first]
}

const toGeoJsonGeometry = (rawGeometry) => {
  if (!rawGeometry) return null

  if (rawGeometry.type && rawGeometry.coordinates) {
    return rawGeometry
  }

  if (!Array.isArray(rawGeometry) || rawGeometry.length === 0) {
    return null
  }

  if (isCoordinatePair(rawGeometry[0])) {
    return {
      type: "Polygon",
      coordinates: [closeRingIfNeeded(rawGeometry)]
    }
  }

  if (Array.isArray(rawGeometry[0]) && isCoordinatePair(rawGeometry[0][0])) {
    return {
      type: "Polygon",
      coordinates: rawGeometry.map(closeRingIfNeeded)
    }
  }

  return null
}

const buildFeatureFromUrbanGeometry = (urbanGeometry) => {
  if (!urbanGeometry) return null

  const parsedGeometry = parseGeometry(urbanGeometry.geometry)
  const geometry = toGeoJsonGeometry(parsedGeometry)

  if (!geometry) return null

  if (geometry.type === "Feature") {
    return {
      ...geometry,
      properties: {
        ...(geometry.properties || {}),
        Bairro: urbanGeometry.name,
        Dias: urbanGeometry.collectionDays,
        Período: urbanGeometry.collectionPeriod,
        Horário: urbanGeometry.collectionTime
      }
    }
  }

  return {
    type: "Feature",
    geometry,
    properties: {
      Bairro: urbanGeometry.name,
      Dias: urbanGeometry.collectionDays,
      Período: urbanGeometry.collectionPeriod,
      Horário: urbanGeometry.collectionTime
    }
  }
}

export const Mapa = ({ bairroSelecionado, urbanGeometrySelecionada }) => {
  const mapRef = useRef(null)
  const [fallbackUrbanGeometry, setFallbackUrbanGeometry] = useState(null)

  const isMatchingBairro = (urbanGeometry) => {
    if (!urbanGeometry || !bairroSelecionado) return false
    return normalizeText(urbanGeometry.name) === normalizeText(bairroSelecionado)
  }

  useEffect(() => {
    let isActive = true

    setFallbackUrbanGeometry(null)

    const loadUrbanGeometry = async () => {
      if (urbanGeometrySelecionada || !bairroSelecionado) {
        return
      }

      try {
        const data = await urbanGeometryService.getUrbanGeometryByName(bairroSelecionado)
        if (isActive && isMatchingBairro(data)) {
          setFallbackUrbanGeometry(data)
        }
      } catch {
        if (isActive) {
          setFallbackUrbanGeometry(null)
        }
      }
    }

    loadUrbanGeometry()

    return () => {
      isActive = false
    }
  }, [bairroSelecionado, urbanGeometrySelecionada])

  const activeUrbanGeometry = isMatchingBairro(urbanGeometrySelecionada)
    ? urbanGeometrySelecionada
    : fallbackUrbanGeometry

  const selectedFeature = buildFeatureFromUrbanGeometry(activeUrbanGeometry)

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
            key={`${bairroSelecionado}-${activeUrbanGeometry?.id || activeUrbanGeometry?.name || "sem-geometria"}`}
            data={selectedGeojson}
            style={(feature) => {
              const ativo = isColetaHoje(feature.properties, activeUrbanGeometry)
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
                  <b>${props.Bairro || ""}</b><br>
                  <strong>Dias:</strong> ${dias}<br>
                  <strong>Período:</strong> ${props.Período || ""}<br>
                  <strong>Horário:</strong> ${props.Horário || ""}
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
