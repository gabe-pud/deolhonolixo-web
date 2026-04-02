import { useState, useEffect } from 'react';

export const ColetaLixoInfo = ({ bairro }) => {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // O useEffect "observa" a prop 'bairro'. 
  // Sempre que 'bairro' mudar, esta função roda de novo!
  useEffect(() => {
    if (!bairro) return;

    setCarregando(true);

    // Simulando uma busca de dados (pode ser um fetch de API ou busca em JSON)
    const buscarDadosColeta = () => {
      // Exemplo de base de dados local
      const agenda = {
        "Canto do Forte": { dias: "Segunda, Quarta e Sexta", horario: "19:00" },
        "Boqueirão": { dias: "Terça, Quinta e Sábado", horario: "08:00" },
        "Guilhermina": { dias: "Segunda, Quarta e Sexta", horario: "07:30" },
        // ... outros bairros
      };

      // Simula um atraso de rede de 500ms
      setTimeout(() => {
        setDados(agenda[bairro] || { dias: "Não cadastrado", horario: "--:--" });
        setCarregando(false);
      }, 500);
    };

    buscarDadosColeta();
  }, [bairro]); // <-- O "pulo do gato": o efeito depende da variável 'bairro'

  if (carregando) return <p className="text-center mt-4">Buscando horários...</p>;
  if (!dados) return null;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 max-w-[500px] mx-auto">
      <h2 className="text-2xl font-bold text-[#7083D9] mb-4">{bairro}</h2>
      <div className="space-y-2">
        <p className="text-gray-700"><strong>📅 Dias:</strong> {dados.dias}</p>
        <p className="text-gray-700"><strong>⏰ Horário aprox:</strong> {dados.horario}</p>
      </div>
    </div>
  );
};
