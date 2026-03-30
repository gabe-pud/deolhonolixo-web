export const CollectionForecast = () => {
    return (
        <div className="bg-[#7083D9] rounded-[14px] flex flex-col gap-[22px] ml-[28px] mr-[28px] text-white p-[24px] text-[30px] shadow-[10px_10px_10px_-3px_rgba(0,0,0,0.3)] tracking-tight">
            <div className="flex justify-between">
                <p className="font-bold">
                    Próxima Coleta:
                </p>
                <p>
                    28/09/2025
                </p>
            </div>
            <div className="flex justify-between">
                <p className="font-bold">
                    Horário Previsto:
                </p>
                <p>
                    14:00
                </p>
            </div>
        </div>
    )
}