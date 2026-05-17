import React, { useState } from 'react'
import { truckService } from '../../../services/truckService'

export const RegistrarCaminhao = () => {
  const [licensePlate, setLicensePlate] = useState('')
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState({
    type: '',
    text: ''
  })

  // Validação padrão Mercosul
  const validatePlate = (plate) => {
    const regex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
    return regex.test(plate)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formattedPlate = licensePlate
      .trim()
      .toUpperCase()

    if (!formattedPlate) {
      setMessage({
        type: 'error',
        text: 'Digite uma placa'
      })
      return
    }

    // Validação da placa
    if (!validatePlate(formattedPlate)) {
      setMessage({
        type: 'error',
        text: 'Formato incorreto. Exemplo válido: ABC1D23'
      })
      return
    }

    try {
      setLoading(true)

      await truckService.registerTruck(formattedPlate)

      setMessage({
        type: 'success',
        text: 'Caminhão registrado com sucesso!'
      })

      setLicensePlate('')

      setTimeout(() => {
        setMessage({
          type: '',
          text: ''
        })
      }, 3000)

    } catch (error) {

      setMessage({
        type: 'error',
        text: error.message || 'Erro ao registrar'
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md ">

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Registrar Novo Caminhão
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Placa do Caminhão
          </label>

          <input
            type="text"
            value={licensePlate}
            onChange={(e) =>
              setLicensePlate(
                e.target.value.toUpperCase()
              )
            }
            placeholder="Ex: ABC1D23"
            className="w-full px-4 py-2 border border-[#7083D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7083D9]"
            maxLength={7}
          />

        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7083D9] text-white py-2 rounded-lg font-semibold hover:bg-[#5463a5] disabled:opacity-50 transition-colors"
        >
          {loading
            ? 'Registrando...'
            : 'Registrar Caminhão'}
        </button>

      </form>

    </div>
  )
}