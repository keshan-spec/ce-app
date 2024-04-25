"use client";
import { useEffect } from "react";
import { Carousel } from "../Posts/Posts";

export const CarEventCard = () => {
    return (
        <div className="card">
            <div className="news-list-home-slider-img-row">
                <div className="news-list-home-slider-img"
                    style={{
                        backgroundImage: "url(assets/img/sample/photo/event-img-1.jpg)"
                    }}> </div>
                <div className="heart-icon">
                    <ion-icon name="heart-outline"></ion-icon>
                </div>
                <div className="dates d-flex">
                    <div className="date">
                        <p>Feb</p>
                        <h5>18</h5>
                    </div>
                    <div className="date">
                        <p>Feb</p>
                        <h5>21</h5>
                    </div>
                </div>
            </div>
            <div className="card-body pt-2">
                <div className="news-list-slider-info">
                    <h3>
                        Great British Motor Show
                    </h3>
                    <p>Starts Thu, 18 Feb 2023</p>
                    <p>NEC Birmingham</p>
                </div>
            </div>
        </div>
    );
};

const Banner = () => {
    return (
        <div className="section full mb-4">
            <Carousel settings={{
                loop: true,
            }}>
                <div className="embla__slide">
                    <div className="carousel-full-img">
                        <img src="assets/img/sample/photo/home-slider-1.jpg"
                            alt="alt" className="imaged w-100 square" />
                    </div>
                    <div className="slider-home-info-row">
                        <div className="slider-home-info-left">
                            <h2> Great British <br />
                                Motor Show</h2>
                            <p>17th – 20th August</p>
                            <div className="slider-home-info-right"><a href="#" className="theme-btn-1">See More
                                <ion-icon name="caret-forward-outline"></ion-icon>
                            </a> </div>
                        </div>
                    </div>
                </div>

                <div className="embla__slide">
                    <div className="carousel-full-img">
                        <img src="assets/img/sample/photo/home-slider-2.jpg" alt="alt"
                            className="imaged w-100 square" />
                    </div>
                    <div className="slider-home-info-row">
                        <div className="slider-home-info-left">
                            <h2> Great British <br />
                                Motor Show</h2>
                            <p>17th – 20th August</p>
                            <div className="slider-home-info-right"><a href="#" className="theme-btn-1">See More
                                <ion-icon name="caret-forward-outline"></ion-icon>
                            </a> </div>
                        </div>
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

const TrendingEvents = () => {
    useEffect(() => {
        // Multiple Carousel
        document.querySelectorAll('.carousel-multiple').forEach(carousel => new Splide(carousel, {
            perPage: 4,
            rewind: true,
            type: "loop",
            gap: 16,
            padding: 16,
            arrows: false,
            pagination: false,
            breakpoints: {
                768: {
                    perPage: 2
                },
                991: {
                    perPage: 3
                }
            }
        }).mount());

    }, []);

    return (
        <>
            <div className="header-large-title">
                <h1 className="title">Trending Events</h1>
            </div>

            <div className="section full mt-2 mb-3">
                <div className="carousel-multiple splide carousel-multiple-wrapper">
                    <div className="splide__track">
                        <ul className="splide__list">
                            <li className="splide__slide">
                                <CarEventCard />
                            </li>
                            <li className="splide__slide">
                                <CarEventCard />
                            </li>
                            <li className="splide__slide">
                                <CarEventCard />
                            </li>
                            <li className="splide__slide">
                                <CarEventCard />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

const TrendingEventsC = () => {
    return (
        <>
            <div className="header-large-title">
                <h1 className="title">Trending Events</h1>
            </div>

            <div className="section full mt-2 mb-3 px-3">
                <Carousel settings={{
                    loop: true,
                }}>
                    <div className="embla__slide">
                        <CarEventCard />
                    </div>
                    <div className="embla__slide">
                        <CarEventCard />
                    </div>
                    <div className="embla__slide">
                        <CarEventCard />
                    </div>
                    <div className="embla__slide">
                        <CarEventCard />
                    </div>
                </Carousel>
            </div>
        </>
    );
};

export const HomePage: React.FC = () => {

    return (
        <div className="home mt-5">
            <div className="section full">
                <div className="home-tabs-wrapper">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="panels-tab1" role="tabpanel">
                            <Banner />
                            <TrendingEvents />
                        </div>

                        <div className="tab-pane fade" id="panels-tab2" role="tabpanel">
                            <div className="tab-panele-content-body">
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                    the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                                    of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                                    but also the leap into electronic typesetting, remaining essentially unchanged</p>

                            </div>
                        </div>
                        <div className="tab-pane fade" id="panels-tab3" role="tabpanel">
                            <div className="tab-panele-content-body">
                                <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
                                    piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard
                                    McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
                                    the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
                                    going through the cites of the word in classical literature, discovered the undoubtable
                                    source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum
                                    et Malorum" (The Extremes of Good and Evil) by Cicero, written in</p>

                            </div>
                        </div>
                        <div className="tab-pane fade" id="panels-tab4" role="tabpanel">
                            <div className="tab-panele-content-body">
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                    the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                                    of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                                    but also the leap into electronic typesetting, remaining essentially unchanged</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div id="appCapsule" className="home">
            <div className="section full">
                <div className="home-tabs-wrapper">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="panels-tab1" role="tabpanel">
                            <div className="section full mb-3">
                                <div className="carousel-full splide">
                                    <div className="splide__track">
                                        <ul className="splide__list">
                                            <li className="splide__slide">
                                                <div className="carousel-full-img">
                                                    <img src="assets/img/sample/photo/home-slider-1.jpg" alt="alt"
                                                        className="imaged w-100 square" />
                                                </div>
                                                <div className="slider-home-info-row">
                                                    <div className="slider-home-info-left">
                                                        <h2> Great British <br />
                                                            Motor Show</h2>
                                                        <p>17th – 20th August</p>
                                                        <div className="slider-home-info-right"><a href="#" className="theme-btn-1">See More
                                                            <ion-icon name="caret-forward-outline"></ion-icon>
                                                        </a> </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="header-large-title">
                                <h1 className="title">Trending Events</h1>
                            </div>

                            <div className="section full mt-2 mb-3">
                                <div className="carousel-multiple splide carousel-multiple-wrapper">
                                    <div className="splide__track">
                                        <ul className="splide__list">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <li className="splide__slide" key={index}>
                                                    <CarEventCard />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};