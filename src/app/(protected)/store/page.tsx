import { Metadata } from "next";
import React from "react";
import dynamic from 'next/dynamic';

const Products = dynamic(() => import('@/components/Store/Products'));
const UserOrders = dynamic(() => import('@/components/Store/UserOrders'));

export const metadata: Metadata = {
    title: 'Store | Drive Life',
    description: 'Drive Life Store',
    openGraph: {
        type: 'website',
        siteName: 'Drive Life',
    },
};

export default async function Page() {
    return (
        <div className="section full">
            <div className="home-tabs-wrapper">
                <div className="tab-content">
                    {/* <Products /> */}
                    {/* <UserOrders /> */}
                    {/* Coming soon */}
                    <div className="text-center p-5">
                        <h2 className="title">Coming Soon!</h2>
                        <p className="text-muted">Our store is under construction. Stay tuned for exciting products and offers!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}