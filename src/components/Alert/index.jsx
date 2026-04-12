import { useState } from "react"

export const Alert = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [days, setDays] = useState([])

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const salvarAlerta = () => {
    // Aqui você faria a integração com Google Calendar
    // Exemplo: chamar API de login Google e criar evento com {date, time, days}
    console.log("Salvar alerta:", { date, time, days })
    alert("Alerta salvo no Google Calendar (simulação).")
    setIsOpen(false)
  }

  return (
    <>
      {/* Texto principal */}
      <div className="flex flex-col items-center my-[34px] mb-0">
        <p className="text-[30px] font-semibold tracking-tight">
          Perdeu o horário da coleta?
        </p>
        <p
          className="text-[24px] font-semibold text-[#7083D9] tracking-tight cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Crie um alerta para lembrar
        </p>
      </div>

      {/* Overlay + Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Criar alerta</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Formulário */}
            <form className="text-sm space-y-5">
              <div>
                <label className="block font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Hora</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-2">
                  Dias da semana (opcional)
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (dia, i) => (
                      <label
                        key={i}
                        className="inline-flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={days.includes(i)}
                          onChange={() => toggleDay(i)}
                          className="h-4 w-4 rounded border border-gray-300 accent-[#7083D9]"
                        />
                        <span>{dia}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end items-center gap-3 mt-2 text-sm">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-[6px] border cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={salvarAlerta}
                  className="px-4 py-3 rounded-[6px] bg-[#7083D9] text-white hover:bg-[#5463a5] cursor-pointer border"
                >
                  Salvar alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
