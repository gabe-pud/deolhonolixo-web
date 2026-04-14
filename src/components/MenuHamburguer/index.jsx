import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const MenuHamburguer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {/* Botão hambúrguer */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-50 flex flex-col justify-between w-9 h-9 items-center p-2 hover:bg-[#5463a5] transition rounded-md bg-[#7083D9] focus:outline-none cursor-pointer"
      >
        <span className="block h-0.5 w-6 bg-white rounded"></span>
        <span className="block h-0.5 w-6 bg-white rounded"></span>
        <span className="block h-0.5 w-6 bg-white rounded"></span>
      </button>

      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Menu lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-100 bg-[#7083D9] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 rounded-l-3xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-5 text-white font-semibold text-[23px] mt-20">

          <p className="text-center text-[#2c2c2c]">Menu Opções</p>


          <button
            onClick={() => {
              setIsOpen(false)
              navigate("/login")
            }}
            className="hover:bg-[#6375c7] transition-colors duration-300 rounded-lg px-2 py-1 cursor-pointer text-center text-[23px]"
          >
            Entrar como Administrador
          </button>
        </div>
      </div>
    </>
  )
}
