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
  const TAMANHO_JANELA_ROTA = 25
  const TAMANHO_MAXIMO_SEGMENTO_METROS = 10
  const layersRef = useRef({
    rotaCompleta: null,
    caminhoPercorrido: null,
    marcadorCaminhao: null,
    marcadorRota: null
  })
  const [pontosRota, setPontosRota] = useState([])
  const [indiceRota, setIndiceRota] = useState(0)
  const [estaReproduzindo, setEstaReproduzindo] = useState(false)
  const [pontosPorSegundo, setPontosPorSegundo] = useState(1)
  const [sliderMinimizado, setSliderMinimizado] = useState(false)
  const [modoSliderAtivo, setModoSliderAtivo] = useState(false)
  const [rotaSelecionadaGeometry, setRotaSelecionadaGeometry] = useState(null)
  const botaoBaseClass = 'inline-flex h-9 min-w-[120px] items-center justify-center rounded-full px-4 text-xs font-semibold shadow-xl transition-colors'

  const normalizarGeometryDaRota = (routeData) => {
    const routeGeometry = routeData?.routeGeometry

    if (!routeGeometry?.type || !routeGeometry?.coordinates) return null

    const normalizarCoordenadas = (coordinates) =>
      coordinates.map((coordinate) =>
        Array.isArray(coordinate[0])
          ? normalizarCoordenadas(coordinate)
          : [Number(coordinate[0]), Number(coordinate[1])]
      )

    return {
      type: routeGeometry.type,
      coordinates: normalizarCoordenadas(routeGeometry.coordinates)
    }
  }

  const extrairPontosDaGeometria = (geometry) => {
    if (!geometry?.coordinates) return []

    if (geometry.type === 'LineString') {
      return geometry.coordinates.map((coordinate) => [
        Number(coordinate[1]),
        Number(coordinate[0])
      ])
    }

    if (geometry.type === 'MultiLineString') {
      return geometry.coordinates.flatMap((lineString) =>
        lineString.map((coordinate) => [
          Number(coordinate[1]),
          Number(coordinate[0])
        ])
      )
    }

    return []
  }

  const obterJanelaDaRota = (pontos, indiceFinal, tamanhoJanela = TAMANHO_JANELA_ROTA) => {
    if (!pontos.length) return []

    const indiceFinalLimitado = Math.min(indiceFinal, pontos.length - 1)
    const indiceInicial = Math.max(0, indiceFinalLimitado - (tamanhoJanela - 1))

    return pontos.slice(indiceInicial, indiceFinalLimitado + 1)
  }

  const densificarSegmentosDaRota = (pontos, tamanhoMaximoSegmentoMetros = 5) => {
    if (pontos.length <= 1) return pontos

    const pontosDensificados = [pontos[0]]

    for (let indice = 0; indice < pontos.length - 1; indice += 1) {
      const pontoAtual = pontos[indice]
      const proximoPonto = pontos[indice + 1]
      const distanciaEntrePontos = L.latLng(pontoAtual).distanceTo(L.latLng(proximoPonto))
      const quantidadeSegmentos = Math.max(1, Math.ceil(distanciaEntrePontos / tamanhoMaximoSegmentoMetros))

      for (let passo = 1; passo < quantidadeSegmentos; passo += 1) {
        const progresso = passo / quantidadeSegmentos
        const latitude = pontoAtual[0] + (proximoPonto[0] - pontoAtual[0]) * progresso
        const longitude = pontoAtual[1] + (proximoPonto[1] - pontoAtual[1]) * progresso

        pontosDensificados.push([latitude, longitude])
      }

      pontosDensificados.push(proximoPonto)
    }

    return pontosDensificados
  }

  const limparCamadasDaRota = (map) => {
    if (layersRef.current.rotaCompleta) {
      map.removeLayer(layersRef.current.rotaCompleta)
      layersRef.current.rotaCompleta = null
    }

    if (layersRef.current.marcadorRota) {
      map.removeLayer(layersRef.current.marcadorRota)
      layersRef.current.marcadorRota = null
    }
  }

  const desenharRotaCompleta = (map, routeGeometry) => {
    if (!map || !routeGeometry) return

    limparCamadasDaRota(map)

    const layer = L.geoJSON(routeGeometry, {
      style: {
        color: '#4CAF50',
        weight: 4,
        opacity: 0.8
      }
    }).addTo(map)

    layersRef.current.rotaCompleta = layer
    map.fitBounds(layer.getBounds(), { padding: [50, 50] })
  }

  const desenharJanelaDaRota = (map, pontos, indiceFinal) => {
    if (!map || !pontos.length) return

    limparCamadasDaRota(map)

    const janela = obterJanelaDaRota(pontos, indiceFinal, TAMANHO_JANELA_ROTA)

    if (!janela.length) return

    const polyline = L.polyline(janela, {
      color: '#4CAF50',
      weight: 4,
      opacity: 0.85
    }).addTo(map)

    layersRef.current.rotaCompleta = polyline

    const ultimoPonto = janela[janela.length - 1]
    const marcador = L.circleMarker([ultimoPonto[0], ultimoPonto[1]], {
      radius: 7,
      color: '#1E7A33',
      weight: 3,
      fillColor: '#4CAF50',
      fillOpacity: 1
    }).addTo(map)

    layersRef.current.marcadorRota = marcador

    map.panTo([ultimoPonto[0], ultimoPonto[1]])
  }

  useEffect(() => {
    if (!mapConfig || !mapConfig.type || !mapRef.current) return

    const map = mapRef.current

    // Limpar camadas anteriores
    Object.values(layersRef.current).forEach((layer) => {
      if (layer) map.removeLayer(layer)
    })
    layersRef.current = {
      rotaCompleta: null,
      caminhoPercorrido: null,
      marcadorCaminhao: null,
      marcadorRota: null
    }

    if (mapConfig.type === 'historico') {
      setPontosRota([])
      setIndiceRota(0)
      setEstaReproduzindo(false)
      setSliderMinimizado(false)
      setModoSliderAtivo(false)
      setRotaSelecionadaGeometry(null)
      renderizarHistorico(map, mapConfig.data)
    } else if (mapConfig.type === 'rota') {
      renderizarRota(map, mapConfig.data)
    }
  }, [mapConfig])

  useEffect(() => {
    if (!modoSliderAtivo || mapConfig?.type !== 'rota' || !mapRef.current || pontosRota.length === 0) return

    desenharJanelaDaRota(mapRef.current, pontosRota, indiceRota)
  }, [modoSliderAtivo, mapConfig?.type, pontosRota, indiceRota])

  useEffect(() => {
    if (!estaReproduzindo || mapConfig?.type !== 'rota' || pontosRota.length === 0) return

    const intervaloEmMilissegundos = 1000 / pontosPorSegundo

    const intervalId = window.setInterval(() => {
      setIndiceRota((indiceAtual) => {
        if (indiceAtual >= pontosRota.length - 1) {
          setEstaReproduzindo(false)
          return indiceAtual
        }

        return indiceAtual + 1
      })
    }, intervaloEmMilissegundos)

    return () => window.clearInterval(intervalId)
  }, [estaReproduzindo, mapConfig?.type, pontosRota.length, pontosPorSegundo])

  const renderizarHistorico = (map, history) => {
    if (!history || history.length === 0) return

    // 1. Desenhar o caminho percorrido
    const coordinates = history.map((h) => [
      h.position.longitude,
      h.position.latitude
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
    const routeGeometry = normalizarGeometryDaRota(routeData)

    if (!routeGeometry) return

    setEstaReproduzindo(false)
    setSliderMinimizado(false)
    setModoSliderAtivo(false)
    setRotaSelecionadaGeometry(routeGeometry)
    setPontosRota([])
    setIndiceRota(0)

    desenharRotaCompleta(map, routeGeometry)
  }

  const ativarModoSlider = () => {
    if (!mapRef.current || !rotaSelecionadaGeometry) return

    const pontosOriginais = extrairPontosDaGeometria(rotaSelecionadaGeometry)
    const pontosDensificados = densificarSegmentosDaRota(
      pontosOriginais,
      TAMANHO_MAXIMO_SEGMENTO_METROS
    )

    setEstaReproduzindo(false)
    setSliderMinimizado(false)
    setModoSliderAtivo(true)
    setPontosRota(pontosDensificados)
    setIndiceRota(0)
  }

  const voltarParaRotaCompleta = () => {
    if (!mapRef.current || !rotaSelecionadaGeometry) return

    setEstaReproduzindo(false)
    setSliderMinimizado(false)
    setModoSliderAtivo(false)
    setPontosRota([])
    setIndiceRota(0)
    desenharRotaCompleta(mapRef.current, rotaSelecionadaGeometry)
  }

  const carregarEDesenharRota = async (map, routeId) => {
    try {
      const routeData = await routeService.getRouteById(routeId)

      const routeGeometry = normalizarGeometryDaRota(routeData)

      if (routeGeometry) {
        const layer = L.geoJSON(routeGeometry, {
          style: {
            color: '#4CAF50',
            weight: 4,
            opacity: 0.8
          }
        }).addTo(map)

        layersRef.current.rotaCompleta = layer
      }
    } catch (err) {
      console.error('Erro ao carregar rota:', err)
    }
  }

  return (
    <div className="w-full h-full relative">
      {mapConfig?.type === 'rota' && rotaSelecionadaGeometry && (
        <div className="absolute top-4 right-4 z-[1000]">
          {!modoSliderAtivo ? (
            <button
              type="button"
              onClick={ativarModoSlider}
              className={`${botaoBaseClass} bg-[#7083D9] text-white hover:bg-[#5f72c6]`}
            >
              Ver com slider/player
            </button>
          ) : sliderMinimizado ? (
            <button
              type="button"
              onClick={() => setSliderMinimizado(false)}
              className={`${botaoBaseClass} bg-[#7083D9]/90 text-white hover:bg-[#5f72c6]`}
            >
              Expandir
            </button>
          ) : (
            <div className="w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/60 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7083D9]">
                    Janela da rota
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={voltarParaRotaCompleta}
                    className={`${botaoBaseClass} bg-[#7083D9] text-white hover:bg-[#5f72c6]`}
                  >
                    Rota completa
                  </button>

                  <button
                    type="button"
                    onClick={() => setSliderMinimizado(true)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-xl transition-colors hover:bg-slate-200"
                    aria-label="Minimizar janela da rota"
                    title="Minimizar janela da rota"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="mb-2 truncate text-sm font-medium whitespace-nowrap text-slate-700">
                Ponto {indiceRota + 1} de {pontosRota.length}
              </p>

              <div className="mb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEstaReproduzindo((valorAtual) => !valorAtual)}
                  className={`${botaoBaseClass} bg-[#7083D9] text-white hover:bg-[#5f72c6]`}
                >
                  {estaReproduzindo ? 'Pause' : 'Play'}
                </button>

                <label className="flex flex-1 items-center gap-2 text-xs text-slate-600">
                  <span>Atualizações/s</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={pontosPorSegundo}
                    onChange={(event) => setPontosPorSegundo(Math.max(1, Number(event.target.value) || 1))}
                    className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-[#7083D9]"
                  />
                </label>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#7083D9]/10 px-3 py-1 text-xs font-semibold text-[#4B5FB8]">
                  {Math.min(TAMANHO_JANELA_ROTA, indiceRota + 1)} pontos visíveis
                </span>
                <span className="text-xs text-slate-500">
                  {estaReproduzindo ? 'Reproduzindo' : 'Pausado'}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={Math.max(0, pontosRota.length - 1)}
                step="1"
                value={indiceRota}
                onChange={(event) => setIndiceRota(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#7083D9]"
              />

              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Início</span>
                <span>Fim</span>
              </div>
            </div>
          )}
        </div>
      )}

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
