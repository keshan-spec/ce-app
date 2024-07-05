'use client';
import { getStoreProduct } from '@/actions/store-actions';
import { useCartStore } from '@/hooks/useCartStore';
import { StoreQtyButton } from '@/shared/StoreQtyButton';
import { ProductVariationTypes } from '@/types/store';
import { IonIcon } from '@ionic/react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Options } from '@splidejs/splide';
import { useQuery } from '@tanstack/react-query';
import { bagRemoveOutline, cartOutline, reload, reloadCircle, reloadOutline } from 'ionicons/icons';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import { BiLoader } from 'react-icons/bi';

const carouselOptions: Options = {
    perPage: 1,
    rewind: true,
    type: "loop",
    arrows: false,
    pagination: false,
};

interface ViewProductProps {
    id: number;
}

export const ViewProduct: React.FC<ViewProductProps> = ({
    id
}) => {
    const { data, isFetching } = useQuery({
        queryKey: ["view-product", id],
        queryFn: () => getStoreProduct(id),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
        staleTime: 60 * 1000,
    });


    const priceRef = useRef<HTMLDivElement>(null);

    const [qty, setQty] = useState<number>(1);
    const [variation, setVariation] = useState<ProductVariationTypes | null>(null);
    const [variationId, setVariationId] = useState<number | null>(null);
    const [buttonText, setButtonText] = useState<string>('Buy Now');

    const { addToCart, loading } = useCartStore();

    const renderImages = () => {
        if (data?.data?.images && data.data.images.length > 0) {
            return data.data.images.map((image: string, index: number) => {
                return (
                    <SplideSlide key={index} className="card">
                        <img src={image} alt="alt" className="imaged w-100 square" />
                    </SplideSlide>
                );
            });
        }

        return (
            <SplideSlide className="card">
                <img src="/assets/img/sample/photo/product2.jpg" alt="alt" className="imaged w-100 square" />
            </SplideSlide>
        );
    };

    const onVariationChange = (e: React.ChangeEvent<HTMLSelectElement>, key: keyof ProductVariationTypes) => {
        setVariation({
            ...variation,
            [key]: e.target.value,
        });
    };

    const renderVariation = () => {
        if (data?.data?.variations) {
            // get first color
            if (variation === null) {
                setVariation(data.data.variations.attribute_price_combos[0].attributes);
            }

            return Object.keys(data?.data?.variations.attributes).map((key: string, index: number) => (
                <div key={index} className='flex justify-between w-full gap-1 items-center flex-col mb-2'>
                    <label htmlFor={key} className='w-full'>{data?.data?.variations?.attributes[key].label}</label>
                    <select name={key} id={key} className="form-control w-full" onChange={(e) => {
                        onVariationChange(e, key as keyof ProductVariationTypes);
                    }}>
                        {data?.data?.variations?.attributes[key].values.map((variation, i: number) => (
                            <option key={i} value={variation.value}>{variation.label}</option>
                        ))}
                    </select>
                </div>
            ));
        }
    };

    const handleAddToCart = async () => {
        if (variationId && data?.data && priceRef.current) {
            const variationThumbnail = data?.data?.variations?.attribute_price_combos.find((combo) => combo.id === variationId)?.thumbnail;
            const variations = data?.data?.variations?.attributes;

            const variationColor = variations?.pa_colour?.values.find((v) => v.value === variation?.pa_colour);
            const variationSize = variations?.['pa_item-size']?.values.find((v) => v.value === variation?.['pa_item-size']);

            await addToCart({
                id: `${data?.data?.id}-${variationId}`,
                title: data?.data?.title,
                price: parseFloat(priceRef.current!.innerText.replace('£', '')),
                qty: qty,
                variation: variation,
                variationId: variationId,
                thumbnail: variationThumbnail || data?.data?.thumb,
                variationLabel: `${variationColor?.label} - ${variationSize?.label}` || 'No variation',
            });

            setButtonText('Added to cart');
        }
    };

    useEffect(() => {
        if (variation) {
            if (variation['pa_item-size']) {
                const price = data?.data?.variations?.attribute_price_combos.find((combo) => {
                    if (combo.attributes.pa_colour === variation.pa_colour && combo.attributes['pa_item-size'] === variation['pa_item-size']) {
                        return combo;
                    }
                });

                if (price) {
                    setVariationId(price.id);
                    priceRef.current!.innerText = `£${price.price}`;
                }
            }
        }
    }, [variation]);

    return (
        <>
            {isFetching && <ViewProductSkeleton />}

            {!isFetching && data && (
                <>
                    <Splide options={carouselOptions} className="text-center carousel-full flex items-center justify-center">
                        {renderImages()}
                    </Splide>

                    <div className="section full">
                        <div className="wide-block pt-2 pb-2 product-detail-header">
                            <h1 className="title" dangerouslySetInnerHTML={{ __html: data?.data?.title }}></h1>
                            <div className="text">{data?.data?.highlight}</div>
                            <div className="detail-footer">
                                <div className="price">
                                    {/* <div className="old-price">£74.99</div> */}
                                    <div className="current-price" ref={priceRef}>£{data?.data?.price}</div>
                                </div>
                                <div className="amount">
                                    <StoreQtyButton onQtyChange={(qty) => setQty(qty)} maxQty={data?.data?.stock} />

                                </div>
                            </div>

                            {renderVariation()}

                            <div className="flex gap-1 items-center">
                                {/* {itemInCart() && (
                                    <button className="btn btn-secondary btn-lg"
                                        onClick={() => {
                                            removeFromCart(data?.data?.id);
                                        }}
                                    >
                                        <IonIcon icon={bagRemoveOutline} role="img" className="md hydrated text-center !m-0" aria-label="cart outline" />
                                    </button>
                                )} */}

                                <button className="btn btn-primary btn-lg btn-block" onClick={handleAddToCart} disabled={loading || !variationId}>
                                    {loading && <BiLoader className="md hydrated animate-spin mr-2" />}
                                    {!loading && <IonIcon icon={cartOutline} role="img" className="md hydrated" aria-label="cart outline" />}
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="section full mt-2">
                        <div className="section-title">Product Details</div>
                        {data?.data?.short_description && (
                            <div className="wide-block pt-2 pb-2">
                                <div dangerouslySetInnerHTML={{ __html: data?.data?.short_description }}></div>
                            </div>
                        )}
                        <div className="wide-block pt-2 pb-2">
                            <div dangerouslySetInnerHTML={{ __html: data?.data?.description || 'No description available' }}></div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

const ViewProductSkeleton = () => {
    return (
        <>
            <div className="section full">
                <div className="title h-64 animate-pulse bg-gray-300 rounded w-full"></div>

                <div className="wide-block pt-2 pb-2 product-detail-header">
                    <div className="title h-6 animate-pulse bg-gray-300 rounded-lg w-3/4 mb-1"></div>
                    <div className="text h-4 animate-pulse bg-gray-300 rounded-lg w-1/2"></div>
                    <div className="detail-footer">
                        <div className="price">
                            <div className="current-price h-6 animate-pulse bg-gray-300 rounded w-1/4"></div>
                        </div>
                        <div className="amount flex w-full justify-between items-center">
                            <div className="w-1/4 h-7 rounded-lg bg-gray-300" />
                            <div className="stepper stepper-secondary bg-gray-300">
                            </div>
                        </div>
                    </div>
                    <div className="btn  btn-lg btn-block h-10 animate-pulse !bg-gray-300"></div>
                </div>
            </div>

            <div className="section full mt-2">
                <div className="section-title h-6 animate-pulse bg-gray-300 rounded w-1/4 ml-4 mb-1"></div>
                <div className="wide-block pt-2 pb-2 flex gap-1 flex-col">
                    <div className="h-4 animate-pulse bg-gray-300 rounded"></div>
                    <div className="h-4 animate-pulse bg-gray-300 rounded"></div>
                    <div className="h-4 animate-pulse bg-gray-300 rounded"></div>
                </div>
            </div>
        </>
    );
};