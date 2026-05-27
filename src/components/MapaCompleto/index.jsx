import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'

import { bairrosGeoJson } from '../bairrosGeoJson'

const normalizeBairro = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

function isColetaHoje(props) {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const diasMap = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado'
  }
  const dias = props?.Dias
  if (!dias) return false
  const diasText = Array.isArray(dias) ? dias.join(' ') : String(dias)
  return diasText.toLowerCase().includes(diasMap[diaSemana].toLowerCase())
}

function formatDias(dias) {
  if (!dias) return 'Não informado'
  return Array.isArray(dias) ? dias.join(', ') : String(dias)
}

export const MapaCompleto = () => {
  const mapRef = useRef(null)
  const location = useLocation()

  // Praia Grande - SP
  const praiaGrandePosition = [-24.0058, -46.4028]
  const bairroSelecionado = new URLSearchParams(location.search).get('bairro') ?? ''

  const selectedFeature = bairroSelecionado
    ? bairrosGeoJson.features.find(
        (feature) => normalizeBairro(feature.properties.Bairro) === normalizeBairro(bairroSelecionado)
      )
    : null

  const selectedGeojson = selectedFeature
    ? { type: 'FeatureCollection', features: [selectedFeature] }
    : null

  const initialCenter = selectedFeature
    ? (() => {
        try {
          const layer = L.geoJSON(selectedFeature)
          const bounds = layer.getBounds()
          if (bounds?.isValid?.()) {
            const center = bounds.getCenter()
            return [center.lat, center.lng]
          }
        } catch {
          // Usa o fallback abaixo.
        }

        return praiaGrandePosition
      })()
    : praiaGrandePosition

  useEffect(() => {
    if (!selectedFeature || !mapRef.current) return

    try {
      const layer = L.geoJSON(selectedFeature)
      const bounds = layer.getBounds()

      if (bounds?.isValid?.()) {
        mapRef.current.invalidateSize?.()
        mapRef.current.fitBounds?.(bounds, { padding: [40, 40] })
      }
    } catch {
      // Ignora geometrias inválidas.
    }
  }, [selectedFeature])

  return (
    <div className="w-full h-screen">

      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedGeojson && (
          <GeoJSON
            key={bairroSelecionado}
            data={selectedGeojson}
            style={(feature) => {
              const ativo = isColetaHoje(feature.properties)
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