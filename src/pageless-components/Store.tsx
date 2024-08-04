import React from "react";
import dynamic from 'next/dynamic';

const Products = dynamic(() => import('@/components/Store/Products'));
const UserOrders = dynamic(() => import('@/components/Store/UserOrders'));

export default function StorePage() {
    return (
        <div className="section full">
            <div className="home-tabs-wrapper">
                <div className="tab-content">
                    <Products />
                    <UserOrders />
                </div>
            </div>
        </div>
    );
}