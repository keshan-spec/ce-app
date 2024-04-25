import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export const TopNav: React.FC = () => {
    const pathname = usePathname();
    const [searchName, setSearchName] = useState("");
    const [searchProfiles, setSearchProfiles] = useState([]);

    const handleSearchName = (e: any) => {
        console.log(e.target.value);
    };


    return (
        <div className="appHeader bg-primary scrolled header-div-wrapper">
            <div className="header-row-wrapper-top">
                <div className="left">
                    <a href="create.html" className="headerButton" data-bs-toggle="offcanvas" data-bs-target="#sidebarPanel">
                        <ion-icon name="menu-outline"></ion-icon>
                    </a>
                </div>
                <div className="header-logo">
                    <Link href="/">
                        <img src="assets/img/sample/photo/C-Square.svg" alt="" />
                    </Link>
                </div>
                <div className="right">
                    <a href="#" className="headerButton">
                        <ion-icon name="notifications"></ion-icon>
                    </a>
                    <a href="search.html" className="headerButton">
                        <ion-icon name="search-outline"></ion-icon>
                    </a>
                </div>
            </div>

            {pathname == '/' && (
                <div className="header-row-wrapper2">
                    <ul className="nav nav-tabs capsuled" role="tablist">
                        <li className="nav-item"> <a className="nav-link active" data-bs-toggle="tab" href="#panels-tab1" role="tab">
                            <ion-icon name="calendar-outline"></ion-icon>
                            Events </a> </li>
                        <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab2" role="tab">
                            <ion-icon name="location-outline"></ion-icon>
                            Venues </a> </li>
                        <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab3" role="tab">
                            <ion-icon name="map-outline"></ion-icon>
                            Map </a> </li>
                        <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#panels-tab4" role="tab">
                            <ion-icon name="heart"></ion-icon>
                            Saved </a> </li>
                    </ul>
                </div>
            )}
        </div>
    );
};