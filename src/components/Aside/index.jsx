import { Alert } from "../Alert"
import { Button } from "../Button"
import { Footer } from "../Footer"
import { CollectionForecast } from "../CollectionForecast"
import { Time } from "../Time"
import { User } from "../User"

export const Aside = ({ }) => {
    return (
        <aside className="w-[555px] flex flex-col relative z-50 shadow-[10px_0px_10px_-3px_rgba(0,0,0,0.3)]">
            <User />
            <Button />
                <p className="text-center text-[32px] mt-[24px] font-semibold mb-0 pb-0 tracking-tight">
                    A coleta chegará em:
                </p>
            <Time />
            <CollectionForecast />
            <Alert />

            <div className="bg-[#FCAE1D] rounded-[14px] ml-[28px] mr-[28px] my-[39px] mb-0  p-[24px] text-[20px] font-bold shadow-[10px_10px_10px_-3px_rgba(0,0,0,0.3)] tracking-tight">
                <div className="flex flex-col items-center gap-[10px]">
                    <p className=" text-black">
                        Últimas coletas
                    </p>
                    <p className="text-[#5C5C5C]">
                        20/03/2026<br></br>
                        13/03/2026<br></br>
                        05/03/2026<br></br>
                        28/02/2026
                    </p>
                </div>
            </div>

            <Footer />

        </aside>
    )
}