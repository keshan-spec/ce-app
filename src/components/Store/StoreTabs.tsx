'use client';
import { useState } from "react";
import { Products } from "./Products";
import { UserOrders } from "./UserOrders";

export const StoreTabs: React.FC = () => {
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
};