import { useProduct } from '../../../hooks/useProduct';

const COLOR_FILTERS = {
    id: 'color',
    name: 'Color',
    options: [
        { value: 'white', label: 'White' },
        { value: 'beige', label: 'Beige' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' },
    ],
};
const SIZE_FILTERS = {
    id: 'size',
    name: 'Size',
    options: [
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
    ],
};
const SORT_FILED_FILTERS = {
    id: 'sortField',
    name: 'sortField',
    options: [
        { value: 'name', label: 'Name' },
        { value: 'price', label: 'Price' },
    ],
};
const SORT_TYPE_FILTERS = {
    id: 'sortType',
    name: 'sortType',
    options: [
        { value: '1', label: 'Ascending' },
        { value: '-1', label: 'Descending' },
    ],
};
import { Button, Pagination } from '@/components/ui';
// import ProductList from "../ProductList";

import './index.scss';
import Skeleton from 'react-loading-skeleton';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Container } from '../../components/shared';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductList from '@/components/products/ProductList';
import {useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {Product} from "../../service/product/product.ts";

const ProductByType = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { name } = useParams();

    const [filteredProducts,setFilteredProducts]=useState([])
    const [page,setPage]=useState(() => {
        const pageParam = searchParams?.get("page");
        const pageNumber = pageParam ? Number(pageParam) : 1;  // Chuyển đổi chuỗi thành số
        return pageNumber > 0 ? pageNumber : 1;  // Nếu số hợp lệ, trả về; nếu không, trả về 1
    });
    const [totalPage,setTotalPage]=useState(0);
    const isLoading: boolean = false;

    useEffect(() => {
        // Kiểm tra nếu query parameters "page" hoặc "limit" không tồn tại trong URL
        if (!searchParams.has("page")) {
            // Nếu không có "page", đặt mặc định là 1
            searchParams.set("page", "1");
        }

        if (!searchParams.has("limit")) {
            // Nếu không có "limit", đặt mặc định là 10
            searchParams.set("limit", "10");
        }

        // Cập nhật URL với các query parameters mới nếu có thay đổi
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    useEffect(()=>{
        searchParams.set("page", String(page));
        setSearchParams(searchParams);
    },[page])
    // Lấy tất cả query parameters dưới dạng object
    const allParams = useMemo(() => {
        return Object.fromEntries(searchParams.entries());
    }, [searchParams]);
    console.log("allParams",{allParams})
    useEffect(()=>{
        (async ()=>{
            try {
                let response;

                if (allParams?.category) {
                    response = await Product.getListProductByCategory(allParams);
                } else if (allParams?.season) {
                    response = await Product.getListProductSeason(allParams);
                } else {
                    response = {
                        data: {
                            isSuccess: false,
                        },
                    };
                }
                console.log("product: ", response)
                if(response?.data?.isSuccess===true){
                    if(response.data?.data){
                        setFilteredProducts(response.data.data?.content);
                        setTotalPage(response.data.data.totalPages)
                    }
                    else {
                        setFilteredProducts([])
                    }
                }
                else{
                    setFilteredProducts([])
                }
            }catch(e){
                console.log(e);
                setFilteredProducts([])
            }
        })()
    },[allParams])
    // const totalPages = Number(filteredProducts?.params?.totalPage) ?? 0;
    console.log("filteredProducts",{filteredProducts})
    // Determine page type for styling
    const pageType = allParams?.category ? 'category' : allParams?.season ? 'season' : 'default';
    
    return (
        <div className={`product-collection-modern product-collection-modern--${pageType}`}>
            <div className="product-collection-modern__hero">
                <div className="product-collection-modern__hero-background"></div>
                <Container>
                    <Breadcrumb />
                    <div className="product-collection-modern__hero-content">
                        <h1 className="product-collection-modern__title">
                            {pageType === 'category' ? 'Danh Mục Sản Phẩm' : pageType === 'season' ? 'Bộ Sưu Tập Theo Mùa' : 'Sản Phẩm'}
                        </h1>
                        <p className="product-collection-modern__subtitle">
                            Khám phá bộ sưu tập tuyệt vời của chúng tôi
                        </p>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="product-collection-modern__main">
                    <div className="product-collection-modern__content">
                        {isLoading ? (
                            <div className="product-collection-modern__loading">
                                <Skeleton count={9} height={400} />
                            </div>
                        ) : (
                            filteredProducts && (
                                <>
                                    {filteredProducts?.length > 0 ? (
                                        <>
                                            <div className="product-collection-modern__stats">
                                                <span className="product-collection-modern__stats-item">
                                                    <Icon icon="solar:box-bold-duotone" />
                                                    {filteredProducts.length} sản phẩm
                                                </span>
                                                <span className="product-collection-modern__stats-item">
                                                    <Icon icon="solar:document-bold-duotone" />
                                                    Trang {page} / {totalPage}
                                                </span>
                                            </div>
                                            <ProductList products={filteredProducts} />
                                            <div className="product-collection-modern__pagination">
                                                <Pagination
                                                    totalPages={totalPage} 
                                                    page={page} 
                                                    setPage={setPage}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="product-collection-modern__empty">
                                            <div className="product-collection-modern__empty-icon">
                                                <Icon icon="iconoir:file-not-found" />
                                            </div>
                                            <h2 className="product-collection-modern__empty-title">
                                                Không tìm thấy sản phẩm
                                            </h2>
                                            <p className="product-collection-modern__empty-text">
                                                Vui lòng thử lại với bộ lọc khác
                                            </p>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ProductByType;
