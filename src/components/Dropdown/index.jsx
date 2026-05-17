import { useState, useEffect, useRef } from "react"

const bairros = [
  { label: "Canto do Forte", value: "canto do forte" },
  { label: "Boqueirão", value: "boqueirao" },
  { label: "Guilhermina", value: "guilhermina" },
  { label: "Aviação", value: "aviacao" },
  { label: "Tupi", value: "tupi" },
  { label: "Ocian", value: "ocian" },
  { label: "Mirim", value: "mirim" },
  { label: "Maracanã", value: "maracana" },
  { label: "Caiçara", value: "caicara" },
  { label: "Real", value: "real" },
  { label: "Flórida", value: "florida" },
  { label: "Solemar", value: "solemar" },
  { label: "Militar", value: "militar" },
  { label: "Cidade da Criança", value: "cidade da crianca" },
  { label: "Princesa", value: "princesa" },
  { label: "Imperador", value: "imperador" },
  { label: "Melvi", value: "melvi" },
  { label: "Samambaia", value: "samambaia" },
  { label: "Esmeralda", value: "esmeralda" },
  { label: "Ribeirópolis", value: "ribeiropolis" },
  { label: "Andaraguá", value: "andaragua" },
  { label: "Nova Mirim", value: "nova mirim" },
  { label: "Anhanguera", value: "anhanguera" },
  { label: "Quietude", value: "quietude" },
  { label: "Tupiry", value: "tupiry" },
  { label: "Santa Marina", value: "santa marina" },
  { label: "Antártica", value: "antartica" },
  { label: "Vila Sônia", value: "vila sonia" },
  { label: "Glória", value: "gloria" },
  { label: "Sítio do Campo", value: "sitio do campo" },
  { label: "Xixová", value: "xixova" },
  { label: "Serra do Mar", value: "serra do mar" }
]

export const Dropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBairro, setSelectedBairro] = useState("Selecione um bairro...")
  const dropdownRef = useRef(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (bairro) => {
    setSelectedBairro(bairro.label)
    setIsOpen(false)
    if (onSelect) {
      onSelect(bairro.value)
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-[28px] mr-[28px] mt-[60px] w-[500px] bg-transparent border border-[#A7A7A7] rounded-[14px] text-[24px] font-medium leading-[140%] flex items-center py-[22px] justify-center hover:border-[#7083D9] cursor-pointer tracking-tight"
      >
        {selectedBairro}
      </button>

      {isOpen && (
        <div className="absolute ml-[28px] mr-[28px] mt-2 w-[500px] rounded-[14px] shadow-lg bg-white ring-1 ring-[#7083D9] ring-opacity-5 focus:outline-none z-[100] max-h-[350px] overflow-y-auto no-scrollbar custom-scrollbar">
          <div className="py-1 px-1">
            {bairros.map((bairro) => (
              <button
                key={bairro.value}
                onClick={() => handleSelect(bairro)}
                className="w-full block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {bairro.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
