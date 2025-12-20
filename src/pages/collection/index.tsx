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
import { TProductListResponse } from '@/common/models/Product';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterOptionCheckbox from '@/components/filter/FilterCheckbox';
import FilterRange from '@/components/filter/FilterRange';
import FilterOptionRadioBox from '@/components/filter/FilterRadioBox';
import ProductList from '@/components/products/ProductList';
import { dataFake } from '@/utils/datafake';
import {useSearchParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {Product} from "../../service/product/product.ts";

const Collection = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [filteredProducts,setFilteredProducts]=useState([])
    const [page,setPage]=useState(() => {
        const pageParam = searchParams?.get("page");
        const pageNumber = pageParam ? Number(pageParam) : 1;  // Chuyển đổi chuỗi thành số
        return pageNumber > 0 ? pageNumber : 1;  // Nếu số hợp lệ, trả về; nếu không, trả về 1
    });
    const [totalPage,setTotalPage]=useState(0);
    const isLoading: boolean = false;
    console.log({ filteredProducts });

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
                const response = await Product.searchListProduct(allParams)
                console.log("product: ", response)
                if(response.data.isSuccess===true){
                    if(response.data?.data){
                        setFilteredProducts(response.data.data?.content);
                        setTotalPage(response.data.data.totalPages)
                    }
                    else {
                        setFilteredProducts([])
                    }
                }
            }catch(e){
                console.log(e);
                setFilteredProducts([])
            }
        })()
    },[allParams])
    // const totalPages = Number(filteredProducts?.params?.totalPage) ?? 0;
    console.log("filteredProducts",{filteredProducts})
    const searchQuery = allParams?.key || allParams?.keywords || '';
    
    return (
        <div className="search-page-modern">
            <div className="search-page-modern__hero">
                <div className="search-page-modern__hero-background"></div>
                <Container>
                    <Breadcrumb />
                    <div className="search-page-modern__hero-content">
                        <div className="search-page-modern__search-icon">
                            <Icon icon="solar:magnifer-bold-duotone" />
                        </div>
                        <h1 className="search-page-modern__title">
                            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tìm Kiếm Sản Phẩm'}
                        </h1>
                        <p className="search-page-modern__subtitle">
                            {searchQuery 
                                ? `Tìm thấy ${filteredProducts?.length || 0} sản phẩm phù hợp`
                                : 'Khám phá bộ sưu tập đa dạng của chúng tôi'
                            }
                        </p>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="search-page-modern__content">
                    <div className="search-page-modern__filters">
                        <h3 className="search-page-modern__filters-title">
                            <Icon icon="solar:filter-bold-duotone" />
                            Bộ Lọc
                        </h3>
                        <div className="search-page-modern__filters-content">
                            <FilterOptionCheckbox title="Màu sắc" category="color" options={COLOR_FILTERS.options} />
                            <FilterOptionCheckbox title="Kích thước" category="size" options={SIZE_FILTERS.options} />
                            <FilterRange min={'0'} max={'500000'} step={1} title="Khoảng giá" />
                            <FilterOptionRadioBox title="Sắp xếp theo" options={SORT_FILED_FILTERS.options} />
                            <FilterOptionRadioBox title="Thứ tự" options={SORT_TYPE_FILTERS.options} />
                            <Button
                                className="search-page-modern__reset-btn"
                                size="sm"
                                variant="contain"
                                color="black"
                            >
                                <Icon icon="solar:refresh-bold" />
                                Đặt lại
                            </Button>
                        </div>
                    </div>
                        {isLoading ? (
                            <div className="search-page-modern__loading">
                                <Skeleton count={9} height={400} />
                            </div>
                        ) : (
                            filteredProducts && (
                                <>
                                    {filteredProducts?.length > 0 ? (
                                        <>
                                            <div className="search-page-modern__stats">
                                                <span className="search-page-modern__stats-item">
                                                    <Icon icon="solar:box-bold-duotone" />
                                                    {filteredProducts.length} sản phẩm
                                                </span>
                                                <span className="search-page-modern__stats-item">
                                                    <Icon icon="solar:document-bold-duotone" />
                                                    Trang {page} / {totalPage}
                                                </span>
                                            </div>
                                            <ProductList products={filteredProducts} />
                                            <div className="search-page-modern__pagination">
                                                <Pagination
                                                    totalPages={totalPage} 
                                                    page={page} 
                                                    setPage={setPage}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="search-page-modern__empty">
                                            <div className="search-page-modern__empty-icon">
                                                <Icon icon="iconoir:file-not-found" />
                                            </div>
                                            <h2 className="search-page-modern__empty-title">
                                                Không tìm thấy sản phẩm
                                            </h2>
                                            <p className="search-page-modern__empty-text">
                                                Vui lòng thử lại với từ khóa khác
                                            </p>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                </div>
            </Container>
        </div>
    );
};

export default Collection;
