import { BiCaretRight } from "react-icons/bi";
import { Carousel } from "../Posts/Posts";
import { NearYouEvents, TrendingEvents } from "./TrendingEvents";
import Link from "next/link";

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
                            <div className="slider-home-info-right">
                                <Link href="#" className="theme-btn-1 ">
                                    See More <BiCaretRight className="inline" />
                                </Link>
                            </div>
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
                            <div className="slider-home-info-right">
                                <Link href="#" className="theme-btn-1 ">
                                    See More <BiCaretRight className="inline" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export const HomePage: React.FC = async () => {
    return (
        <div className="home mt-5">
            <div className="section full">
                <div className="home-tabs-wrapper">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="panels-tab1" role="tabpanel">
                            <Banner />
                            <TrendingEvents />
                            <NearYouEvents />
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
};