import React, {useEffect, useState} from 'react';
import { TProductListResponse } from '@/common/models/Product';
import ProductList from '@/components/products/ProductList';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { dataFake } from '@/utils/datafake';
import SectionBannerHotWord from './section-banner/section-banner';
import SectionStackBanner from './section-stack-banner/section-stack-banner';
import { Icon } from '@iconify/react/dist/iconify.js';
import {IProduct} from "../../common/models/Product.ts";
import getListUser from "../../service/user/getListUser.ts";
import {Pagination} from "../../components/ui";
import getListProduct from "../../service/product/getListProduct.ts";
import ProductListV2 from "@/components/products/ProductListV2";
import {Product} from "@/service/product/product.ts";
import introVideo from '@/assets/videos/video-orange-intro.mp4';
import { useTranslation } from 'react-i18next';
import './home.scss';

const filteredProducts: TProductListResponse = dataFake;
export default function Home() {
    const { t } = useTranslation('product');
    const [page,setPage]=useState(1);
    const [totalPage,setTotalPage]=useState(0);
    const [listProduct,setListProduct] = useState<IProduct[]>([])
    useEffect(()=>{
        (async (page,key)=>{
            try {
                // const response = await getListProduct({
                //     limit:20,
                //     page:page,
                // })
                const response =await Product.getListProductElk({
                    size:20,
                    page:page-1
                })
                console.log("product: ", response)
                if(response.data.isSuccess===true){
                    if(response.data?.data){
                        setListProduct(response.data.data?.content||[]);
                        setTotalPage(response.data.data.totalPages)
                    }
                    else {
                        setListProduct([])
                    }
                }
            }catch(e){
                console.log(e);
                setListProduct([])
            }
        })(page)
    },[page])
    console.log({listProduct})
    return (
        <div className="home-page-modern">
            {/* Video ngay dưới header */}
            <div className="intro-video-container">
                <video
                    className="intro-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={introVideo} type="video/mp4" />
                    {t('browserNotSupported')}
                </video>
            </div>

            <SectionBannerHotWord />
            
            <div className="home-page-modern__content">
                <Container>
                    <div className="home-page-modern__header">
                        <h1 className="home-page-modern__title">
                            <Icon icon="solar:shop-bold-duotone" className="home-page-modern__title-icon" />
                            {t('title')}
                        </h1>
                        <p className="home-page-modern__subtitle">
                            {t('subtitle')}
                        </p>
                    </div>

                    {listProduct?.length > 0 ? (
                        <>
                            <ProductListV2 products={listProduct} isSearchable={false} />
                            <div className="home-page-modern__pagination">
                                <Pagination
                                    totalPages={totalPage} 
                                    page={page} 
                                    setPage={setPage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="home-page-modern__empty">
                            <div className="home-page-modern__empty-icon">
                                <Icon icon="iconoir:file-not-found" />
                            </div>
                            <h2 className="home-page-modern__empty-title">
                                {t('noProducts')}
                            </h2>
                            <p className="home-page-modern__empty-text">
                                {t('tryAgain')}
                            </p>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}
