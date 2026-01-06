import { API } from '../api.ts';
import {SERVER} from "../../environment.ts";

export interface ILabel {
    id?: string;
    name: string;
}

interface IData {
    content: ILabel[]
}

const Label = {
    getAll: async() => {
        return await API.get<IData>(
            SERVER.product.url,
            '/label/all',
            undefined,
            true,
        )
    },
}

export {Label};
