import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Popup, Marker } from 'react-leaflet'
import L from 'leaflet'
import { routeService } from '../../../services/routeService'

const TruckIcon = L.divIcon({
  html: `
    <div style="
      background-color: #7083D9;
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      🚛
    </div>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
})

export const MapaAdmin = ({ mapConfig }) => {
  const mapRef = useRef(null)
  const layersRef = useRef({
    rotaCompleta: null,
    caminhoPercorrido: null,
    marcadorCaminhao: null
  })

  useEffect(() => {
    if (!mapConfig || !mapConfig.type || !mapRef.current) return

    const map = mapRef.current

    // Limpar camadas anteriores
    Object.values(layersRef.current).forEach((layer) => {
      if (layer) map.removeLayer(layer)
    })
    layersRef.current = { rotaCompleta: null, caminhoPercorrido: null, marcadorCaminhao: null }

    if (mapConfig.type === 'historico') {
      renderizarHistorico(map, mapConfig.data)
    } else if (mapConfig.type === 'rota') {
      renderizarRota(map, mapConfig.data)
    }
  }, [mapConfig])

  const renderizarHistorico = (map, history) => {
    if (!history || history.length === 0) return

    // 1. Desenhar o caminho percorrido
    const coordinates = history.map((h) => [
      h.position.latitude,   // primeiro: latitude
      h.position.longitude   // segundo: longitude
    ])


    if (coordinates.length > 0) {
      const polyline = L.polyline(coordinates, {
        color: '#7083D9',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5'
      }).addTo(map)

      layersRef.current.caminhoPercorrido = polyline

      // Ajustar zoom para ver o caminho inteiro
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
    }

    // 2. Desenhar a rota completa (se houver routeId)
    const lastTruck = history[history.length - 1]
    if (lastTruck && lastTruck.routeId) {
      carregarEDesenharRota(map, lastTruck.routeId)
    }

    // 3. Marcar posição atual (último ponto)
    if (coordinates.length > 0) {
      const ultimaPosicao = coordinates[coordinates.length - 1]
      const marker = L.marker(ultimaPosicao, { icon: TruckIcon })
        .bindPopup(`
          <div>
            <p><strong>Posição Atual</strong></p>
            <p>Lat: ${ultimaPosicao[0].toFixed(4)}</p>
            <p>Lng: ${ultimaPosicao[1].toFixed(4)}</p>
            <p><strong>Velocidade:</strong> ${lastTruck.telemetry?.speedKmh || 'N/A'} km/h</p>
          </div>
        `)
        .addTo(map)

      layersRef.current.marcadorCaminhao = marker
    }
  }

  const renderizarRota = (map, routeData) => {
    if (!routeData || !routeData.coordinates) return

    // Converter coordenadas da rota para formato Leaflet
    const coordinates = routeData.coordinates.map((coord) => [
      coord.latitude,
      coord.longitude
    ])

    if (coordinates.length > 0) {
      const polyline = L.polyline(coordinates, {
        color: '#4CAF50',
        weight: 4,
        opacity: 0.8
      }).addTo(map)

      layersRef.current.rotaCompleta = polyline
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
    }
  }

  const carregarEDesenharRota = async (map, routeId) => {
    try {
      const routeData = await routeService.getRouteById(routeId)

      if (routeData && routeData.coordinates) {
        const coordinates = routeData.coordinates.map((coord) => [
          coord.latitude,
          coord.longitude
        ])

        if (coordinates.length > 0) {
          const polyline = L.polyline(coordinates, {
            color: '#4CAF50',
            weight: 4,
            opacity: 0.8
          }).addTo(map)

          layersRef.current.rotaCompleta = polyline
        }
      }
    } catch (err) {
      console.error('Erro ao carregar rota:', err)
    }
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[-24.0217, -46.4236]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}
