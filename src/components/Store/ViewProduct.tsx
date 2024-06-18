'use client';
import { IonIcon } from '@ionic/react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Options } from '@splidejs/splide';
import { carOutline, cartOutline } from 'ionicons/icons';
import React, { useRef } from 'react';

const carouselOptions: Options = {
    perPage: 1,
    rewind: true,
    type: "loop",
    arrows: false,
    pagination: false,
};

export const ViewProduct: React.FC = () => {
    const qtyRef = useRef<HTMLInputElement>(null);

    const handleQtyChange = (type: 'up' | 'down') => {
        if (qtyRef.current) {
            const qty = parseInt(qtyRef.current.value);

            if (type === 'up') {
                qtyRef.current.value = (qty + 1).toString();
            } else {
                if (qty > 1) {
                    qtyRef.current.value = (qty - 1).toString();
                }
            }
        }
    };

    return (
        <>
            <Splide options={carouselOptions} className="text-center carousel-full flex items-center justify-center">
                <SplideSlide className="card">
                    <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
                </SplideSlide>
                <SplideSlide className="card">
                    <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
                </SplideSlide>
                <SplideSlide className="card">
                    <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
                </SplideSlide>
                <SplideSlide className="card">
                    <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
                </SplideSlide>
                <SplideSlide className="card">
                    <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
                </SplideSlide>
            </Splide>

            <div className="section full">
                <div className="wide-block pt-2 pb-2 product-detail-header">
                    <h1 className="title">DriveLife QR Code</h1>
                    <div className="text">Circle</div>
                    <div className="detail-footer">
                        <div className="price">
                            {/* <div className="old-price">£74.99</div> */}
                            <div className="current-price">£4.50</div>
                        </div>
                        <div className="amount">
                            <div className="stepper stepper-secondary">
                                <button className="stepper-button stepper-down"
                                    onClick={() => {
                                        handleQtyChange('down');
                                    }}>-</button>
                                <input type="text" className="form-control" value="1" disabled ref={qtyRef} />
                                <button className="stepper-button stepper-up"
                                    onClick={() => {
                                        handleQtyChange('up');
                                    }}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className="btn btn-primary btn-lg btn-block" data-location="store-checkout.php">
                        <IonIcon icon={cartOutline} role="img" className="md hydrated" aria-label="cart outline" />
                        Buy Now
                    </div>
                </div>
            </div>

            <div className="section full mt-2">
                <div className="section-title">Product Details</div>
                <div className="wide-block pt-2 pb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla, nibh sed viverra dictum,
                    ligula mauris lobortis tortor, eu efficitur leo nulla at metus. Aliquam malesuada enim augue, semper
                    sagittis enim tempus sed.
                </div>

            </div>
        </>
    );
};