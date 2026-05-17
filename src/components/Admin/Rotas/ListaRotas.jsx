import React, { useState, useEffect } from 'react'
import { routeService } from '../../../services/routeService'

const RouteCard = ({ route, onVerRota }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#7083D9]">
            <h3 className="font-bold text-lg text-gray-800 mb-2">🗺️ Rota #{route.routeId}</h3>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p><strong>Nome:</strong> {route.routeName || 'N/A'}</p>
                {route.description && <p><strong>Descrição:</strong> {route.description}</p>}
            </div>

            <button
                onClick={() => onVerRota(route.routeId)}
                className="w-full bg-[#7083D9] text-white py-2 rounded-lg font-semibold hover:bg-[#5463a5] transition-colors text-sm"
            >
                Ver Rota no Mapa
            </button>
        </div>
    )
}


export const ListaRotas = ({ onMapConfigChange }) => {
    const [rotas, setRotas] = useState([])
    const [filteredRotas, setFilteredRotas] = useState([])
    const [searchRoute, setSearchRoute] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadRotas()
    }, [])

    const loadRotas = async () => {
        try {
            setLoading(true)
            const data = await routeService.getAllRoutes()
            setRotas(data)
            setFilteredRotas(data)
            setError(null)
        } catch (err) {
            setError(err.message || 'Erro ao carregar rotas')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase()
        setSearchRoute(value)

        if (value.trim() === '') {
            setFilteredRotas(rotas)
        } else {
            const filtered = rotas.filter(
                (rota) => (rota.routeName || '').toLowerCase().includes(value) ||
                    String(rota.routeId).includes(value)
            )
            setFilteredRotas(filtered)
        }
    }

    const handleVerRota = async (routeId) => {
        try {
            const routeData = await routeService.getRouteById(routeId)
            onMapConfigChange({
                type: 'rota',
                data: routeData
            })
        } catch (err) {
            alert('Erro ao carregar rota: ' + err.message)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Carregando rotas...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Rotas Disponíveis</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar rota por nome ou ID..."
                    value={searchRoute}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-[#7083D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7083D9]"
                />
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
            )}

            {filteredRotas.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    Nenhuma rota encontrada
                </div>
            ) : (

                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">

                    {filteredRotas.map((rota) => (
                        <RouteCard
                            key={rota.routeId}
                            route={rota}
                            onVerRota={handleVerRota}
                        />
                    ))}

                </div>

            )}
        </div>
    )
}
