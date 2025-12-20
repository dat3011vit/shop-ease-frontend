interface IImage {
    id:string;
    name:string;
    src: string;
    type: string;
    product_id: string;
}

interface ISizes {
    id: string;
    value:string;
}

interface ICategory {
    id: string;
    code: string;
    name: string;
    // total: number;
    description: string;
    // __v: number;
    path: string;//slug
    isActive: boolean;
}

interface  IOverviews{
    id:string;
    description:string;
}

// interface IAttributeProduct {
//     code: string;
//     name: string;
//     value: string;
//     avaiable: number;
// }

export type TProductListResponse = {
    success: boolean;
    status: number;
    message: string;
    product?: IProduct;
    list?: IProduct[];
    list_product?: IProduct[];
    products?: IProduct[];
    params: {
        limit: string;
        page: string;
        totalPage: string;
    };
};
export interface IProduct  {
    productId: string;

    code: string;
    // name:string
    //
    title: string;
    images: IImage[];
    price: number;
    //
    score:number;
    season:ISeason;
    // avaiable: number;
    description: IOverviews;
    tags: string[];
    brand: string;
    size: ISizes[];
    category: ICategory | null;
    isActive: boolean;
    // __v: number;
    // attribute_product: IAttributeProduct[];
};
interface  ISeason{
    name:string;
    year:string;
}

export type FilterProductParams = {
    offset?: string | number;
    limit?: string | number;
    sortField?: string;
    sortType?: string;
    category_id?: string;
    brand?: string;
    distancePrice?: string | string[];
    color?: string | string[];
    size?: string | string[];
    tags?: string;
    keywords?: string;
    searchType?: string;
};

export type OptionsFilter = {
    value: string;
    label: string;
};

export type TFilterState = {
    offset: number;
    limit: number;
    sortType?: string;
    sortField?: string;
    color: string[];
    size: string[];
    distancePrice: string[];
    category_id?: string;
};

export type TFilterAction =
    | { type: "SET_OFFSET"; payload: number }
    | { type: "SET_LIMIT"; payload: number }
    | { type: "SET_SORT_TYPE"; payload: string }
    | { type: "SET_SORT_FIELD"; payload: string }
    | { type: "SET_COLOR"; payload: string[] }
    | { type: "SET_SIZE"; payload: string[] }
    | { type: "SET_DISTANCE_PRICE"; payload: string[] }
    | { type: "SET_CATEGORY_ID"; payload: string }
    | {
    type: "APPLY_ARRAY_FILTER";
    payload: { category: "color" | "size"; value: string };
}
    | { type: "RESET_FILTERS" };
