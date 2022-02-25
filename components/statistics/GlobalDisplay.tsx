import {Resource} from "@definitions/Resource";

export const GlobalDisplay = ({label, data}: {label: String, data: number}) => {
    return(
        <div className="items-center">
            <h6 className="font-bold text-gray-900 font-marianne">{label}</h6>
            <p className="text-5xl text-gray-900 font-marianne">{data}</p>
        </div>
    )
}