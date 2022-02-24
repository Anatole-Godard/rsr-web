import Image from "next/image";

export const UserStatistics = () => {

    return (
        <div
            className="flex flex-col space-y-3 bg-white rounded-lg lg:col-span-2 xl:col-span-3 w-full overflow-hidden pb-5">
            <div className="inline-flex items-center justify-between w-full px-3 pt-4 mb-3">
                <h5 className="font-bold text-gray-900 font-marianne">
                    Statistiques
                </h5>
                <div className="w-6 h-6">
                    <Image
                        alt="Bar chart"
                        src="/img/bar_chart.png"
                        width={24}
                        height={24}
                    />
                </div>
            </div>

            <div className="inline-flex flex flex-row items-center justify-around w-full px-3 mb-3">
                <div className="items-center">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Ressources créées
                    </h6>
                    <p className="text-5xl text-gray-900 font-marianne">102</p>
                </div>
                <div className="">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Ressources consultées
                    </h6>
                    <p className="text-5xl text-gray-900 font-marianne">102</p>
                </div>
                <div className="">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Total de vues des ressources
                    </h6>
                    <p className="text-5xl text-gray-900 font-marianne">102</p>
                </div>
            </div>
        </div>
    )
}