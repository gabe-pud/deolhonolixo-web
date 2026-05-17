import { useEffect, useState } from "react"

const horariosColeta = {
  manhaSegQuaSex: {
    bairros: ["Aviação", "Boqueirão", "Tupi", "Canto do Forte", "Guilhermina", "Sítio do Campo", "aviacao", "boqueirao", "tupi", "canto do forte", "guilhermina", "sitio do campo"],
    horaInicio: 8,
    horaFim: 12,
    dias: [1, 3, 5] // segunda, quarta, sexta
  },
  tardeSegQuaSex: {
    bairros: ["Solemar", "Esmeralda", "Flórida", "Melvi", "Princesa", "Ribeirópolis", "Samambaia", "Cidade da Criança", "Sítio do Campo", "solemar", "esmeralda", "florida", "melvi", "princesa", "ribeiropolis", "samambaia", "cidade da crianca", "sitio do campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [1, 3, 5]
  },
  manhaTerQui: {
    bairros: ["Caiçara", "Maracanã", "Mirim", "Ocian", "Real", "caicara", "maracana", "mirim", "ocian", "real"],
    horaInicio: 8,
    horaFim: 12,
    dias: [2, 4] // terça, quinta
  },
  tardeTerQui: {
    bairros: ["Anhanguera", "Antártica", "Glória", "Nova Mirim", "Quietude", "Santa Marina", "Tupiry", "Vila Sônia", "Sítio do Campo", "anhanguera", "antartica", "gloria", "nova mirim", "quietude", "santa marina", "tupiry", "vila sonia", "sitio do campo"],
    horaInicio: 13,
    horaFim: 18,
    dias: [2, 4]
  }
}

function calcularUltimasColetas(bairro) {
    if (!bairro) return []

    const agora = new Date()
    const diaSemana = agora.getDay()
    const horaAtual = agora.getHours()

    const grupo = Object.values(horariosColeta).find(g => g.bairros.includes(bairro))
    if (!grupo) return []

    const coletas = []
    let diasPassados = 0

    while (coletas.length < 4) {
        const data = new Date(agora)
        data.setDate(agora.getDate() - diasPassados)
        const dia = data.getDay()

        if (grupo.dias.includes(dia)) {
            // Verifica se é hoje
            if (diasPassados === 0) {
                // Se ainda está dentro do período da coleta, não adiciona
                if (horaAtual >= grupo.horaInicio && horaAtual <= grupo.horaFim) {
                    // só adiciona depois que o período acabar
                } else if (horaAtual > grupo.horaFim) {
                    coletas.push(data.toLocaleDateString("pt-BR"))
                }
            } else {
                coletas.push(data.toLocaleDateString("pt-BR"))
            }
        }
        diasPassados++
        if (diasPassados > 30) break // segurança para não entrar em loop infinito
    }

    return coletas.slice(0, 4)
}

export const LatestCollections = ({ bairro }) => {
    if (!bairro) return (
        <div className="bg-[#FCAE1D] rounded-[14px] ml-[28px] mr-[28px] my-[39px] mb-0 p-[24px] text-[20px] font-bold shadow-[10px_10px_10px_-3px_rgba(0,0,0,0.3)] tracking-tight">
            <div className="flex flex-col items-center gap-[10px]">
                <p className="text-black">Últimas coletas</p>
                <p className="text-[#5C5C5C]">
                    Selecione um bairro
                </p>
            </div>
        </div>
    )

    const [datas, setDatas] = useState([])

    useEffect(() => {
        const atualizar = () => setDatas(calcularUltimasColetas(bairro))
        atualizar()
        const interval = setInterval(atualizar, 60000) // atualiza a cada minuto
        return () => clearInterval(interval)
    }, [bairro])

    return (
        <div className="bg-[#FCAE1D] rounded-[14px] ml-[28px] mr-[28px] my-[39px] mb-0 p-[24px] text-[20px] font-bold shadow-[10px_10px_10px_-3px_rgba(0,0,0,0.3)] tracking-tight">
            <div className="flex flex-col items-center gap-[10px]">
                <p className="text-black">Últimas coletas</p>
                <p className="text-[#5C5C5C]">
                    {datas.map((d, i) => (
                        <span key={i}>
                            {d}

                            <br />
                        </span>
                    ))}
                </p>
            </div>
        </div>
    )
}
