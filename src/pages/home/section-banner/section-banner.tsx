import { Container } from '@/components/shared';
import { Button, IconButton } from '@/components/ui';
import Slider, { Settings } from 'react-slick';
import React, { useRef } from 'react';
import { HomeSlide } from '@/utils/datafake';
import { Icon } from '@iconify/react/dist/iconify.js';
import './index.scss';

export default function SectionBannerHotWord() {
    const slider = useRef<Slider>(null);

    const settings: Settings = {
        arrows: false,
        dots: true,

        infinite: true,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 2000,
        cssEase: 'linear',
        dotsClass: 'slick-dots slick-dots-custom', // Sử dụng lớp tùy chỉnh
    };
    return (
        <div className="banner__hotword-section">
            <Container>
                <div className="banner__hotword">
                    <div className="banner__hotword-slider">
                        <IconButton
                            onClick={() => slider.current?.slickPrev()}
                            icon={'iconamoon:arrow-left-2-light'}
                            className="banner__hotword__arrows previous"
                        />

                        <IconButton
                            onClick={() => slider.current?.slickNext()}
                            icon={'iconamoon:arrow-right-2-light'}
                            className="banner__hotword__arrows next"
                        />
                        {/* <Container> */}
                        <Slider ref={slider} className={''} {...settings}>
                            {HomeSlide?.map((slide) => (
                                <div key={slide?.id} style={{ height: '100%' }}>
                                    <div className="banner__hotword__slider">
                                        <div className="banner__hotword__slider-content">
                                            {/* <h4>{slide?.title}</h4>
                                        <h2>{slide?.description}</h2> */}
                                            {/* <Button
                                            className="banner__hotword__slider-button"
                                            variant="contain"
                                            color="black"
                                        >
                                            Explore now
                                            <Icon icon={'iconamoon:search-light'} />
                                        </Button> */}
                                            <img
                                                src={
                                                    'https://cdn.venngage.com/template/thumbnail/small/01b644bd-e75b-4e70-b476-3a786261f066.webp'
                                                }
                                                sizes="(max-width: 600px) 100vw, 800px"
                                                alt={slide?.title}
                                                loading="eager"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        {/* </Container> */}
                    </div>
                    <div className="banner__hotword-item">
                        <div>
                            <img src="https://d3jmn01ri1fzgl.cloudfront.net/photoadking/webp_thumbnail/shark-new-collection-sale-clothing-banner-template-p3ztild89dffd0.webp" alt="" />
                        </div>
                        <div>
                            <img src="https://design-assets.adobeprojectm.com/content/download/express/public/urn:aaid:sc:VA6C2:c80f1d06-fbb8-4ba3-9e15-210354514bd8/component?assetType=TEMPLATE&etag=cb97c727a2af01a82061c4e30deb50e1&revision=0&component_id=845b1f39-346e-407c-a795-96648d009da8" alt="" />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
