import { useState } from "react"

export const Footer = () => {
  const [isOpen, setIsOpen] = useState(false)

  const fecharModal = () => setIsOpen(false)

  return (
    <>
      {/* Footer */}
      <div className="my-[39px] mb-[60px]">
        <div className="flex gap-[10px] text-[20px] tracking-tight justify-center font-bold">
          <p className="text-[#5C5C5C]">Precisa de ajuda?</p>
          <p
            className="text-[#7083D9] cursor-pointer hover:underline"
            onClick={() => setIsOpen(true)}
          >
            Clique aqui
          </p>
        </div>
      </div>

      {/* Overlay + Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={fecharModal} // fecha ao clicar no overlay
        >
          {/* Modal */}
          <div
            className="bg-white rounded-lg w-[90%] max-w-lg p-6 shadow-lg z-60"
            onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro do modal
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Ajuda e Suporte</h3>
              <button
                onClick={fecharModal}
                className="text-gray-500 hover:text-gray-800 cursor-pointer"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo */}
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                <strong>1. Informações detalhadas sobre a coleta: <br /></strong>
                Para obter informações detalhadas sobre a coleta de resíduos em um bairro específico, acesse a seção <strong>"Selecione um bairro..."</strong> no Menu Principal e selecione o bairro desejado.
              </p>
              <p>
                <strong>2. Acesso ao Menu Opções: <br /></strong>
                Para acessar o Menu Opções, clique no ícone de hambúrguer (três linhas horizontais) localizado no canto superior direito da tela. A partir daí, você pode navegar para diferentes seções do site.
              </p>
              <p>
                <strong>3. App na palma da mão: <br /></strong>
                Baixe nosso App e crie um alerta personalizado para te lembrar a data e hora da coleta do bairro desejado, selecione a opção <strong>"Baixe nosso novo App"</strong> no Menu Principal e após abrir o aplicativo, configure o lembrete de acordo com as suas preferências.
              </p>
              <p>
                <strong>4. Contatar o suporte: <br /></strong>
                Se precisar de suporte personalizado, envie uma mensagem descrevendo o problema. Iremos responder o mais rápido possível!
              </p>
              <p>
                <strong>Contato:</strong>{" "}
                <a
                  href="mailto:suporte.deolhonolixo@gmail.com"
                  className="text-[#7083D9] hover:text-[#5463a5]"
                >
                  suporte.deolhonolixo@gmail.com
                </a>
              </p>
            </div>

            {/* Botão fechar */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded-[6px] bg-[#7083D9] text-white hover:bg-[#5463a5] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
