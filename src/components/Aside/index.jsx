import { Alert } from "../Alert"
import { Footer } from "../Footer"
import { CollectionForecast } from "../CollectionForecast"
import { Time } from "../Time"
import { User } from "../User"
import { LatestCollections } from "../LatestCollections"
import { Dropdown } from "../Dropdown"


export const Aside = ({ }) => {
    return (
        <aside className="w-[555px] flex flex-col relative z-50 shadow-[10px_0px_10px_-3px_rgba(0,0,0,0.3)]">
            <User />
            <Dropdown/>
            <p className="text-center text-[32px] mt-[24px] font-semibold mb-0 pb-0 tracking-tight">
                A coleta chegará em:
            </p>
            <Time />
            <CollectionForecast />
            <Alert />
            <LatestCollections />
            <Footer />

        </aside>
    )

}

