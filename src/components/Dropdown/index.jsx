import { useState, useEffect, useRef } from "react"
import { urbanGeometryService } from "../../services/urbanGeometryService"

export const Dropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [urbanGeometries, setUrbanGeometries] = useState([])
  const [selectedUrbanGeometry, setSelectedUrbanGeometry] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const dropdownRef = useRef(null)

  const formatBairroName = (name) => {
    if (!name) return ""

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    let isActive = true

    const loadUrbanGeometries = async () => {
      setIsLoading(true)
      setError("")

      try {
        const data = await urbanGeometryService.getAllUrbanGeometry()

        if (!isActive) {
          return
        }

        setUrbanGeometries(Array.isArray(data) ? data : [])
      } catch {
        if (!isActive) {
          return
        }

        setError("Não foi possível carregar os bairros.")
        setUrbanGeometries([])
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadUrbanGeometries()

    return () => {
      isActive = false
    }
  }, [])

  const handleSelect = async (geometry) => {
    setIsOpen(false)

    try {
      const selectedGeometry = await urbanGeometryService.getUrbanGeometryByName(geometry.name)
      setSelectedUrbanGeometry(selectedGeometry)

      if (onSelect) {
        onSelect(selectedGeometry.name, selectedGeometry)
      }
    } catch {
      setSelectedUrbanGeometry(geometry)

      if (onSelect) {
        onSelect(geometry.name, geometry)
      }
    }
  }

  const selectedLabel = selectedUrbanGeometry ? formatBairroName(selectedUrbanGeometry.name) : "Selecione um bairro..."

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-[28px] mr-[28px] mt-[60px] w-[500px] bg-transparent border border-[#A7A7A7] rounded-[14px] text-[24px] font-medium leading-[140%] flex items-center py-[22px] justify-center hover:border-[#7083D9] cursor-pointer tracking-tight"
      >
        {selectedLabel}
      </button>

      {isOpen && (
        <div className="absolute ml-[28px] mr-[28px] mt-2 w-[500px] rounded-[14px] shadow-lg bg-white ring-1 ring-[#7083D9] ring-opacity-5 focus:outline-none z-[100] max-h-[350px] overflow-y-auto no-scrollbar custom-scrollbar">
          <div className="py-1 px-1">
            {isLoading && (
              <p className="px-4 py-3 text-center text-[16px] text-gray-500">
                Carregando bairros...
              </p>
            )}

            {!isLoading && error && (
              <p className="px-4 py-3 text-center text-[16px] text-red-500">
                {error}
              </p>
            )}

            {!isLoading && !error && urbanGeometries.length === 0 && (
              <p className="px-4 py-3 text-center text-[16px] text-gray-500">
                Nenhum bairro encontrado.
              </p>
            )}

            {!isLoading && !error && urbanGeometries.map((geometry) => (
              <button
                key={geometry.id}
                onClick={() => handleSelect(geometry)}
                className="w-full block rounded-[14px] px-3 py-3 text-center font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="block text-[18px] text-center">{formatBairroName(geometry.name)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
