import React, { useState } from 'react'
import { MapaAdmin } from './MapaAdmin'
import { PainelAdministrativo } from './PainelAdministrativo/index'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const Admin = () => {
    const [mapConfig, setMapConfig] = useState({
        type: null,
        data: null
    })
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-[#7083D9] text-white p-4 pl-6 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold">Painel de Controle</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    Sair
                </button>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Lado Esquerdo - Painel Admin */}
                <div className="w-1/2 overflow-y-auto border-r border-gray-300">
                    <PainelAdministrativo onMapConfigChange={setMapConfig} />
                </div>

                {/* Lado Direito - Mapa */}
                <div className="w-1/2 overflow-hidden ">
                    <MapaAdmin mapConfig={mapConfig} />
                </div>
            </div>
        </div>
    )
}
