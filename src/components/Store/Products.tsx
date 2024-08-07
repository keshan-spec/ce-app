'use client';
import { getStoreProducts } from '@/api-functions/store';
import { StoreProduct } from '@/types/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { memo, useEffect } from 'react';
// const NcImage = dynamic(() => import('@/components/Image/Image'));
import NcImage from '@/components/Image/Image';

const Products = () => {
    const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['store-products'],
        queryFn: ({ pageParam }) => {
            return getStoreProducts(pageParam || 1);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: StoreProduct[], limit: number; }, pages: any[]) => {
            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        initialPageParam: 1,
    });

    // Infinite scroll
    useEffect(() => {
        let fetching = isFetchingNextPage || isFetching || false;
        const onScroll = async (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } = event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true;
                if (hasNextPage) await fetchNextPage();
                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, [hasNextPage, isFetchingNextPage]);

    return (
        <div className="tab-pane fade active show" id="panels-tab1" role="tabpanel">
            <div className="section mt-2">
                <div className="row">
                    {(isFetching && !isFetchingNextPage) && <ProductSkeleton />}

                    {data && data.pages && data.pages.map((page: any, i: number) => (
                        <React.Fragment key={i}>
                            {page.data.map((product: StoreProduct, j: number) => (
                                <div className="col-6 mb-3" key={j}>
                                    <div className="card product-card min-h-[310px] h-full flex justify-between">
                                        <div className="card-body">
                                            {/* <div className="card-img-box" style={{
                                                backgroundImage: `url('${product.thumb}')`,
                                            }}/> */}
                                            <div className="min-h-20 w-full">
                                                <NcImage
                                                    src={product.thumb} alt={product.title}
                                                    containerClassName='min-h-20 w-full'
                                                    className="card-img-top w-full h-full"
                                                    imageDimension={{
                                                        height: 200,
                                                        width: 200,
                                                    }}
                                                />
                                            </div>
                                            <h2 className="title truncate" dangerouslySetInnerHTML={{ __html: product.title }}></h2>
                                            <p className="text">{product.highlight}</p>
                                            <div className="price">£{product.price}</div>
                                        </div>
                                        <div className="card-body">
                                            <Link
                                                prefetch={true}
                                                href={`/store/product/${product.id}`}
                                                className="btn btn-sm btn-primary btn-block">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}

                    {isFetchingNextPage && <ProductSkeleton />}
                </div>
            </div>
        </div>
    );
};

const ProductSkeleton: React.FC = memo(() => {
    return (
        Array.from({ length: 5 }).map((_, i) => (
            <div className="col-6 mb-3 animate-pulse" key={i}>
                <div className="card product-card">
                    <div className="card-body">
                        <div className="h-40 bg-slate-300"></div>
                        <div className="h-6 bg-slate-300 mt-2 rounded-lg"></div>
                        <div className="h-4 bg-slate-200 mt-2 rounded-lg"></div>
                        <div className="h-4 w-8 bg-slate-400 mt-2 rounded-lg"></div>
                        <div className="h-7 bg-slate-300 mt-2 rounded-lg"></div>
                    </div>
                </div>
            </div>
        ))
    );
});

export default memo(Products);