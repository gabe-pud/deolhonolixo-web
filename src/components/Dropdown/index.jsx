import { useState, useEffect, useRef } from 'react';

export const Dropdown = ({ onSelect }) => {

  // Estado que diz se o menu está visível ou não
  const [isOpen, setIsOpen] = useState(false);

  // Estado para guardar o nome do bairro selecionado
  const [selectedBairro, setSelectedBairro] = useState("Selecione um bairro...");

  //Referência que penduramos em uma div, é nessa refêrencia que o useEffect vai trabalhar
  const dropdownRef = useRef(null);

  // Lista de bairros para facilitar a renderização
  const bairros = [
    "Canto do Forte", "Boqueirão", "Guilhermina", "Aviação", "Tupi", "Ocian",
    "Mirim", "Maracanã", "Caiçara", "Real", "Flórida", "Solemar", "Melvi",
    "Nova Mirim", "Anhanguera", "Quietude", "Tupiry", "Santa Marina", "Antártica",
    "Vila Sônia", "Glória", "Sítio do Campo", "Xixová"
  ];

  // O useEffect aqui serve para configurar um "vigia" no navegador assim que o componente aparece.
  // Ou seja, ele verifica se o Dropdown está aberto e fecha automaticamente se houver um clique fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {

      // Se a ref existe E o clique (event.target) NÃO está dentro dela...
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Adiciona o evento de clique no documento inteiro
    document.addEventListener('mousedown', handleClickOutside);

    // Função de limpeza (cleanup)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // [] significa: execute isso apenas uma vez, quando o componente "nascer"

  // Função para lidar com a seleção de bairros, pega um bairro que foi clicado e:
  const handleSelect = (bairro) => {
    setSelectedBairro(bairro); // Atualiza o texto do botão
    setIsOpen(false);          // Fecha o menu após selecionar
    
    // FUTURAMENTE
    // IMPORTANTE: o componente recebe o bairro selecionado através da prop 'onSelect'
    // Aqui avisamos o componente de fora qual foi o bairro selecionado,
    if (onSelect) {
      onSelect(bairro);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-[28px] mr-[28px] mt-[44px] w-[500px] bg-transparent border border-[#A7A7A7] rounded-[14px] text-[24px] font-medium leading-[140%] flex items-center py-[22px] justify-center hover:border-[#7083D9] cursor-pointer tracking-tight"
      >
        {/* O texto do botão é dinâmico */}
        {selectedBairro}
      </button>

      {isOpen && (
        <div className="absolute ml-[28px] mr-[28px] mt-2 w-[500px] rounded-[14px] shadow-lg bg-white ring-1 ring-[#7083D9] ring-opacity-5 focus:outline-none z-[100] max-h-[350px] overflow-y-auto no-scrollbar custom-scrollbar">
          <div className="py-1 px-1">

            {/* para cada bairro da lista de bairros: gere um botão com a key bairro e ao ser clicado chame a função handleSelect e com as tais propriedades... */}
            {bairros.map((bairro) => (
              <button
                key={bairro}

                // ao clicar em um bairro, chama a função handleSelect
                onClick={() => handleSelect(bairro)}
                className="w-full block rounded-[14px] py-2 text-[18px] text-center font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {bairro}
              </button>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};