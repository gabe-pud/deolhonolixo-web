import React, { useState } from 'react'
import { RegistrarCaminhao } from '../Caminhoes/RegistrarCaminhao'
import { ListaCaminhoes } from '../Caminhoes/ListaCaminhoes'
import { ListaRotas } from '../Rotas/ListaRotas'


export const PainelAdministrativo = ({ onMapConfigChange }) => {
  const [telaAtiva, setTelaAtiva] = useState('home')

  const botoes = [
    { id: 'registrar', label: 'Registrar Caminhão', icon: '🚛' },
    { id: 'caminhoes', label: 'Ver Caminhões', icon: '👷' },
    { id: 'rotas', label: 'Ver Rotas', icon: '🗺️' }
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
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo ao Painel Admin</h2>
            <p className="text-gray-600 mb-8">Selecione uma opção para começar</p>
          </div>
        )
    }
  }

  return (
    <div className=" h-full bg-gray-50">
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
            <span className="text-2xl mb-2 block">{botao.icon}</span>
            {botao.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {renderConteudo()}
      </div>
    </div>
  )
}
