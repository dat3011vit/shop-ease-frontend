import { Container } from '@/components/shared';
import { Button, IconButton } from '@/components/ui';
import Slider, { Settings } from 'react-slick';
import React, { useRef } from 'react';
import { HomeSlide } from '@/utils/datafake';
import { Icon } from '@iconify/react/dist/iconify.js';
import imgHome1 from '@/assets/images/img_home_1.webp';
import imgHome2 from '@/assets/images/img_home_2.webp';
import imgHome3 from '@/assets/images/img_home_3.webp';
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
                                                src={imgHome3}
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
                            <img src={imgHome1} alt="" />
                        </div>
                        <div>
                            <img src={imgHome2} alt="" />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
