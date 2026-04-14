
export const Alert = () => {
  return (
    <>
      {/* Texto principal */}
      <div className="flex flex-col items-center my-[34px] mb-0">
        <p className="text-[30px] font-semibold tracking-tight">
          Tenha mais na palma da mão
        </p>
        <p
          className="text-[24px] font-semibold text-[#7083D9] tracking-tight cursor-pointer hover:underline"
          onClick={() => setIsOpen(true)}
        >
          Baixe nosso novo App
        </p>
      </div>
    </>
  )
}
