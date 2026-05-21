import React, { useState } from 'react'
import { RegistrarCaminhao } from '../Caminhoes/RegistrarCaminhao'
import { ListaCaminhoes } from '../Caminhoes/ListaCaminhoes'
import { ListaRotas } from '../Rotas/ListaRotas'

// Ícones brancos (quando clicados)
import map from "../../../assets/svg/map.svg"
import seeTruck from "../../../assets/svg/seeTruck.svg"
import truck from "../../../assets/svg/truck.svg"

// Ícones roxos (#7083D9) (estado normal)
import mapPurple from "../../../assets/svg/mapPurple.svg"
import seeTruckPurple from "../../../assets/svg/seeTruckPurple.svg"
import truckPurple from "../../../assets/svg/truckPurple.svg"

export const PainelAdministrativo = ({ onMapConfigChange }) => {
  const [telaAtiva, setTelaAtiva] = useState('home')

  const botoes = [
    { id: 'registrar', label: 'Registrar Caminhão', iconActive: truck, iconInactive: truckPurple },
    { id: 'caminhoes', label: 'Ver Caminhões', iconActive: seeTruck, iconInactive: seeTruckPurple },
    { id: 'rotas', label: 'Ver Rotas', iconActive: map, iconInactive: mapPurple }
  ]

  const renderConteudo = () => {
    switch (telaAtiva) {
      case 'registrar':
        return <RegistrarCaminhao />
      case 'caminhoes':
        return <ListaCaminhoes onMapConfigChange={onMapConfigChange} />
      case 'rotas':
        return <ListaRotas onMapConfigChange={onMapConfigChange} />
      default:
        return (
          <div className="p-8 text-center ">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Painel Admin</h2>
            <p className="text-gray-600 mb-8">Selecione uma opção para começar</p>
          </div>
        )
    }
  }

  return (
    <div className="h-full bg-gray-50 ">
      {/* Menu de Navegação */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-white border-b border-gray-300">
        {botoes.map((botao) => (
          <button
            key={botao.id}
            onClick={() => setTelaAtiva(botao.id)}
            className={`p-4 rounded-lg font-semibold transition-all ${
              telaAtiva === botao.id
                ? 'bg-[#7083D9] text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <img
              src={telaAtiva === botao.id ? botao.iconActive : botao.iconInactive}
              alt={botao.label}
              className="w-8 h-8 mb-2 mx-auto transition-all"
            />
            {botao.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="p-6 ">
        {renderConteudo()}
      </div>
    </div>
  )
}
