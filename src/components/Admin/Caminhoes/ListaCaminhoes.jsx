import React, { useState, useEffect } from 'react'
import { truckService } from '../../../services/truckService'

// Ícones roxos (#7083D9) (estado normal)
import truckPurple from "../../../assets/svg/truckPurple.svg"

const TruckCard = ({ truck, onVerHistorico }) => {
    const getStatusColor = (status) => {
        if (status === 'parado') return 'bg-orange-100 text-orange-700'
        if (status === 'em coleta') return 'bg-green-100 text-green-700'
        return 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-[#7083D9]">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <img src={truckPurple} alt="Caminhão" className="w-6 h-6" />
                        {truck.licensePlate}
                    </h3>

                    {truck.status && (
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(truck.status)}`}>
                            {truck.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
                {truck.routeStart && <p><strong>Início:</strong> {truck.routeStart}</p>}
                {truck.routeEnd && <p><strong>Fim:</strong> {truck.routeEnd}</p>}
                {truck.routeId && <p><strong>Rota ID:</strong> {truck.routeId}</p>}
            </div>

            <button
                onClick={() => onVerHistorico(truck.id)}
                className="w-full bg-[#7083D9] text-white py-2 rounded-lg font-semibold hover:bg-[#5463a5] transition-colors text-sm"
            >
                Ver Histórico
            </button>
        </div>
    )
}

export const ListaCaminhoes = ({ onMapConfigChange }) => {
    const [trucks, setTrucks] = useState([])
    const [filteredTrucks, setFilteredTrucks] = useState([])
    const [searchPlate, setSearchPlate] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadTrucks()
    }, [])

    const loadTrucks = async () => {
        try {
            setLoading(true)
            const data = await truckService.getAllTrucks()
            setTrucks(data)
            setFilteredTrucks(data)
            setError(null)
        } catch (err) {
            setError(err.message || 'Erro ao carregar caminhões')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {

        const value = e.target.value.toUpperCase()

        setSearchPlate(value)

        // Se estiver vazio → mostra todos
        if (value.trim() === '') {
            setFilteredTrucks(trucks)
            return
        }

        // Filtra localmente letra por letra
        const filtered = trucks.filter((truck) =>
            truck.licensePlate
                .toUpperCase()
                .includes(value)
        )

        setFilteredTrucks(filtered)
    }

    const handleVerHistorico = async (truckId) => {
        try {
            const history = await truckService.getTruckHistory(truckId)
            onMapConfigChange({
                type: 'historico',
                data: history,
                truckId
            })
        } catch (err) {
            alert('Erro ao carregar histórico: ' + err.message)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Carregando caminhões...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Caminhões Registrados</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar por placa..."
                    value={searchPlate}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-[#7083D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7083D9]"
                />
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>
            )}

            {filteredTrucks.length === 0 ? (
                <div className="text-center py-8 text-gray-600">Nenhum caminhão encontrado</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {filteredTrucks.map((truck) => (
                        <TruckCard
                            key={truck.id}
                            truck={truck}
                            onVerHistorico={handleVerHistorico}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
