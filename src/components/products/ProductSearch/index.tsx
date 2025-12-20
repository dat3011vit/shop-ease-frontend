import "./index.scss";
import { useFormik } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
// import { useProduct } from "../../../hooks/useProduct";
// import { useDebounce } from "../../../hooks/useDebounce";
import { formatMoney } from "../../../utils/util";
// import { ROUTE } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Product } from "../../../types/product-type";
import {path} from "@/common/constants/path.ts";

interface ProductSearchProps {
    onClose: () => void;
}

export const ProductSearch = ({ onClose }: ProductSearchProps) => {
    console.log("mo product-search")
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>("fff");
    // const debouncedSearchValue = useDebounce(searchValue, 500);
    // const { data: products, isFetching } = useProduct.useGetProductByName(
    //     debouncedSearchValue as string
    // );
    const {products,isFetching}={products:{list_product:[]},isFetching:true}

    // const formik = useFormik({
    //     initialValues: {
    //         query: "",
    //     },
    //     onSubmit: (values) => {
    //         setSearchValue(values.query);
    //     },
    // });

    // useEffect(() => {
    //     if (formik.values.query !== searchValue) {
    //         setSearchValue(formik.values.query);
    //     }
    // }, [formik.values.query, searchValue]);

    const handleNavigateProductDetails = (
        product_id: string,
        // product: Product
        product: {
            _id: string;
            code: string;
            name: string;
            // images: IImage[];
            price: number;
            avaiable: number;
            description: string;
            tags: string[];
            brand: string;
            // dimensions: IDimensions;
            // category: ICategory | null;
            isActive: boolean;
            __v: number;
            // attribute_product: IAttributeProduct[];
        }
    ) => {
        onClose();
        navigate(`${path.PRODUCT_DETAIL}/${product_id}`, {
            state: { product },
        });
    };

    return (
        <div className="search">
            <form
                // onSubmit={formik.handleSubmit}
                className="search__form">
                <input
                    id="query"
                    name="query"
                    type="text"
                    // onChange={formik.handleChange}
                    // value={formik.values.query}
                    placeholder="Type your search keywords"
                    className="search__input"
                />
                <button className="search__button" type="submit">
                    <Icon icon="icons8:right-arrow" />
                </button>
                <span>
                    <Icon icon={"iconamoon:search-light"} />
                </span>
            </form>
            <div className="search__result">
                {isFetching && (
                    <Skeleton
                        style={{ marginTop: "3.2rem" }}
                        height={100}
                        count={2}
                    />
                )}
                {!isFetching && searchValue !== "" && products?.list_product
                    ? products.list_product.map((product) => (
                          <div
                              onClick={() =>
                                  handleNavigateProductDetails(
                                      product._id,
                                      product
                                  )
                              }
                              key={product._id}
                              className="search__result--link"
                          >
                              <div className="search__result--thumb">
                                  <img
                                      className="img-fluid"
                                      src={product?.images[0]?.url}
                                      alt={product.name}
                                      loading="lazy"
                                  />
                              </div>
                              <div className="search__result--col">
                                  <div className="search__result--col-title">
                                      {product?.name}
                                  </div>
                                  <div className="search__result--col-desc">
                                      <p>{product?.description}</p>
                                  </div>
                                  <div className="search__result--col-price">
                                      {/*<span>{formatMoney(product?.price)}</span>*/}
                                  </div>
                              </div>
                          </div>
                      ))
                    : null}
                {!isFetching &&
                    products?.list_product &&
                    products.list_product.length === 0 && (
                        <h2 className="no-result">
                            Not Found Product!
                            <Icon icon="iconoir:file-not-found" />
                        </h2>
                    )}
            </div>
        </div>
    );
};

export default ProductSearch;
