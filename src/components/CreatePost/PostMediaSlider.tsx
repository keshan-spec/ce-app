import { Options } from "@splidejs/splide";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { forwardRef, useEffect, useRef } from "react";

const carouselOptions: Options = {
    perPage: 1,
    rewind: false,
    gap: 16,
    padding: 16,
    arrows: false,
    pagination: false,
};

interface PostMediaSliderProps {
    onImageClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
    mediaData: string[];
    carouselSettings?: Options;
    childRenderer?: (index: number) => JSX.Element;
    childOutSlide?: (index: number) => JSX.Element;
    showControls?: boolean;
}


const PostMediaSlider = forwardRef((props: PostMediaSliderProps, ref: React.ForwardedRef<Splide>) => {
    const {
        mediaData,
        carouselSettings = carouselOptions,
        onImageClick,
        childRenderer,
        childOutSlide,
        showControls = false,
    } = props;

    useEffect(() => {
        if (ref) {
            console.log('ref.current', ref);
        }
    }, [ref]);

    return (
        <Splide ref={ref} options={carouselSettings} className="text-center carousel-slider flex items-center justify-center">
            {mediaData.map((item, index) => {
                return (
                    <>
                        <SplideSlide key={index}>
                            <div className="relative max-h-96 h-full bg-black"
                                onClick={(e) => onImageClick?.(e, index)}
                            >
                                {item && item.startsWith('data:image') && (
                                    <img
                                        src={item}
                                        id={`post-media-${index}`}
                                        alt={`Selected ${index + 1}`}
                                        className="max-w-full object-contain h-full m-auto"
                                    />
                                )}

                                {item && item.startsWith('data:video') && (
                                    <video
                                        controls={showControls}
                                        className="max-w-full h-full m-auto" id={`post-media-${index}`}>
                                        <source src={item} type="video/mp4" />
                                    </video>
                                )}

                                {childRenderer?.(index)}
                            </div>
                            {childOutSlide?.(index)}
                        </SplideSlide>
                    </>
                );
            })}
        </Splide>
    );
});


export default PostMediaSlider;