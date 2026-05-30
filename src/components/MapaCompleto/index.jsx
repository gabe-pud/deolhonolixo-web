import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GeoJSON, MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { urbanGeometryService } from '../../services/urbanGeometryService'

const MAPA_COMPLETO_VIEW_STORAGE_KEY = 'mapaCompleto:lastView'

const getStoredMapView = () => {
  try {
    const raw = localStorage.getItem(MAPA_COMPLETO_VIEW_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const center = parsed?.center
    const zoom = parsed?.zoom

    if (
      !Array.isArray(center) ||
      center.length < 2 ||
      !Number.isFinite(Number(center[0])) ||
      !Number.isFinite(Number(center[1])) ||
      !Number.isFinite(Number(zoom))
    ) {
      return null
    }

    return {
      center: [Number(center[0]), Number(center[1])],
      zoom: Number(zoom)
    }
  } catch {
    return null
  }
}

const persistMapView = (map) => {
  if (!map) return

  try {
    const center = map.getCenter()
    const zoom = map.getZoom()

    localStorage.setItem(
      MAPA_COMPLETO_VIEW_STORAGE_KEY,
      JSON.stringify({ center: [center.lat, center.lng], zoom })
    )
  } catch {
    // Ignora erros de escrita em storage.
  }
}

const parseGeometry = (geometryValue) => {
  if (!geometryValue) return null

  if (typeof geometryValue === 'string') {
    try {
      return JSON.parse(geometryValue)
    } catch {
      return null
    }
  }

  return geometryValue
}

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const dayMatchers = [
  { index: 0, patterns: ['domingo', 'dom'] },
  { index: 1, patterns: ['segunda', 'seg'] },
  { index: 2, patterns: ['terca', 'ter'] },
  { index: 3, patterns: ['quarta', 'qua'] },
  { index: 4, patterns: ['quinta', 'qui'] },
  { index: 5, patterns: ['sexta', 'sex'] },
  { index: 6, patterns: ['sabado', 'sab'] }
]

const dayToIndex = (day) => {
  if (typeof day === 'number' && day >= 0 && day <= 6) {
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

  const [hourPart = '0', minutePart = '0'] = String(time).split(':')
  const hour = Number.parseInt(hourPart, 10)
  const minute = Number.parseInt(minutePart, 10)

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 0, minute: 0 }
  }

  return { hour, minute }
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
      type: 'Polygon',
      coordinates: [closeRingIfNeeded(rawGeometry)]
    }
  }

  if (Array.isArray(rawGeometry[0]) && isCoordinatePair(rawGeometry[0][0])) {
    return {
      type: 'Polygon',
      coordinates: rawGeometry.map(closeRingIfNeeded)
    }
  }

  return null
}

function isColetaHoje(urbanGeometry) {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const horaAtualEmMinutos = hoje.getHours() * 60 + hoje.getMinutes()

  const collectionDays = urbanGeometry?.collectionDays || []
  const normalizedDays = (Array.isArray(collectionDays) ? collectionDays : [collectionDays])
    .map(dayToIndex)
    .filter((day) => day !== undefined)

  if (normalizedDays.length === 0) return false

  const collectionTime = urbanGeometry?.collectionTime
  const { hour, minute } = parseCollectionTime(collectionTime)
  const collectionTimeInMinutes = hour * 60 + minute

  return normalizedDays.includes(diaSemana) && horaAtualEmMinutos <= collectionTimeInMinutes
}

function formatDias(dias) {
  if (!dias) return 'Não informado'
  return Array.isArray(dias) ? dias.join(', ') : String(dias)
}

const MapViewPersistence = ({ onMapReady }) => {
  const map = useMapEvents({
    moveend: () => {
      persistMapView(map)
    },
    zoomend: () => {
      persistMapView(map)
    }
  })

  useEffect(() => {
    onMapReady?.(map)
    persistMapView(map)

    return () => {
      persistMapView(map)
    }
  }, [map, onMapReady])

  return null
}

export const MapaCompleto = () => {
  const mapRef = useRef(null)
  const location = useLocation()
  const [urbanGeometrySelecionada, setUrbanGeometrySelecionada] = useState(null)

  // Praia Grande - SP
  const praiaGrandePosition = [-24.0058, -46.4028]
  const bairroSelecionado = new URLSearchParams(location.search).get('bairro') ?? ''
  const [initialView] = useState(() => {
    return getStoredMapView() || { center: praiaGrandePosition, zoom: 13 }
  })

  useEffect(() => {
    let isActive = true

    const loadUrbanGeometry = async () => {
      if (!bairroSelecionado) {
        setUrbanGeometrySelecionada(null)
        return
      }

      try {
        const data = await urbanGeometryService.getUrbanGeometryByName(bairroSelecionado)

        if (isActive) {
          setUrbanGeometrySelecionada(data)
        }
      } catch {
        if (isActive) {
          setUrbanGeometrySelecionada(null)
        }
      }
    }

    loadUrbanGeometry()

    return () => {
      isActive = false
    }
  }, [bairroSelecionado])

  const selectedFeature = useMemo(() => {
    const parsedGeometry = parseGeometry(urbanGeometrySelecionada?.geometry)
    const geometry = toGeoJsonGeometry(parsedGeometry)

    if (!geometry) {
      return null
    }

    if (geometry.type === 'Feature') {
      return {
        ...geometry,
        properties: {
          ...(geometry.properties || {}),
          Bairro: urbanGeometrySelecionada?.name,
          Dias: urbanGeometrySelecionada?.collectionDays,
          Período: urbanGeometrySelecionada?.collectionPeriod,
          Horário: urbanGeometrySelecionada?.collectionTime
        }
      }
    }

    return {
      type: 'Feature',
      geometry,
      properties: {
        Bairro: urbanGeometrySelecionada?.name,
        Dias: urbanGeometrySelecionada?.collectionDays,
        Período: urbanGeometrySelecionada?.collectionPeriod,
        Horário: urbanGeometrySelecionada?.collectionTime
      }
    }
  }, [urbanGeometrySelecionada])

  const selectedGeojson = selectedFeature
    ? { type: 'FeatureCollection', features: [selectedFeature] }
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

    try {
      fitFeatureBounds(mapRef.current, selectedFeature)
    } catch {
      // Ignora geometrias inválidas.
    }
  }, [selectedFeature])

  return (
    <div className="w-full h-screen">

      <MapContainer
        center={initialView.center}
        zoom={initialView.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        ref={mapRef}
      >
        <MapViewPersistence
          onMapReady={(map) => {
            mapRef.current = map
          }}
        />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedGeojson && (
          <GeoJSON
            key={bairroSelecionado}
            data={selectedGeojson}
            style={() => {
              const ativo = isColetaHoje(urbanGeometrySelecionada)
              return {
                color: ativo ? '#7083D9' : '#A6A6A6',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3,
                fillColor: ativo ? '#7083D9' : '#A6A6A6'
              }
            }}
            onEachFeature={(feature, layer) => {
              const props = feature.properties || {}
              const dias = formatDias(props.Dias)
              const popupContent = `
                <div>
                  <b>${props.Bairro || ''}</b><br>
                  <strong>Dias:</strong> ${dias}<br>
                  <strong>Período:</strong> ${props.Período || ''}<br>
                  <strong>Horário:</strong> ${props.Horário || ''}
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