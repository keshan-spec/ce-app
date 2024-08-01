import dynamic from "next/dynamic";
import React from "react";

const DiscoverSearchPage = dynamic(() => import("@/components/Discover/DiscoverSearchPage"));

export default async function Page() {
    return (
        <DiscoverSearchPage />
    );
}