import { MapContainer, TileLayer } from 'react-leaflet'

export const MapaCompleto = () => {

  // Praia Grande - SP
  const praiaGrandePosition = [-24.0058, -46.4028]

  return (
    <div className="w-full h-screen">

      <MapContainer
        center={praiaGrandePosition}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>

    </div>
  )
}