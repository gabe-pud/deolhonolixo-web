import { useState, useEffect, useRef } from 'react';

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-[28px] mr-[28px] mt-[44px] w-[500px] bg-transparent border border-[#A7A7A7] rounded-[14px] text-[24px] font-medium leading-[140%] flex items-center py-[22px] justify-center hover:border-[#7083D9] cursor-pointer tracking-tight"
      >
        Selecione um bairro...
      </button>

      {isOpen && (
        /* z-[100] para garantir que fica acima de todos os outros componentes do Aside */
        <div className="absolute ml-[28px] mr-[28px] mt-2 w-[500px] mt-2 w-48 rounded-[14px] shadow-lg bg-white ring-1 ring-[#7083D9] ring-opacity-5 focus:outline-none z-[100]">
          <div className="py-1 px-1">
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100 ">Canto do Forte</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Boqueirão</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100 ">Guilhermina</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Aviação</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100 ">Tupi</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Ocian</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Mirim</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Maracanã</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Caiçara</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Real</a>
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100">Flórida</a>
            <hr className="my-1 border-gray-200" />
            <a href="#" className="block rounded-[14px] py-2 text-[18px] text-center font-medium text-[#7083D9] hover:bg-gray-100">Ver todos</a>
          </div>
        </div>
      )}
    </div>
  );
}
