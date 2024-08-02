import { Options } from "@splidejs/splide";
import { Splide } from '@splidejs/react-splide';
import { forwardRef, useRef, useState } from "react";

import { useDotButton } from "../Carousel/EmbalDotButtons";
import useEmblaCarousel from 'embla-carousel-react';
import clsx from "clsx";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import NcImage from "../Image/Image";
import { PostMedia } from "@/types/posts";
import { DotButton } from "@/shared/Carousel";

const carouselOptions: Options = {
    perPage: 1,
    rewind: false,
    // gap: 16,
    // padding: 16,
    arrows: false,
    pagination: true,
};

interface PostMediaSliderProps {
    onImageClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
    mediaData: PostMedia[];
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

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false },/*[AutoHeight({ delay: 5000, stopOnInteraction: false })]*/);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true);

    return (
        <div className="embla !mb-0">
            <div className="embla__viewport relative bg-black" ref={emblaRef}>
                <div className="embla__container !items-center">
                    {mediaData.map((item, index) => {
                        const calculatedHeight = parseInt(item.media_height) ? parseInt(item.media_height) : 500;
                        const maxHeight = calculatedHeight > 600 ? 400 : calculatedHeight;

                        return (
                            <div
                                key={item.id}
                                id={`media-${item.id}`}
                                className={clsx(
                                    "embla__slide h-full group bg-black flex flex-col",
                                    item.media_type === 'video' && "embla__slide--video"
                                )}>
                                <div className="embla__slide__number w-full h-full">
                                    {item.media_type === 'image' && (
                                        <NcImage
                                            key={item.id}
                                            src={item.media_url} alt={item.media_alt}
                                            className="object-contain w-full"
                                            imageDimension={{
                                                width: parseInt(item.media_width) || 400,
                                                height: maxHeight || 400
                                            }}
                                        />
                                    )}


                                    {item.media_type === 'video' && (
                                        <>
                                            <div
                                                className={`w-full h-full flex items-center justify-center`}
                                                style={{ width: item.media_width, height: 'auto' }}
                                                id={`video-${item.id}`}
                                                onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                                            >
                                                <video
                                                    playsInline
                                                    loop
                                                    muted={muted}
                                                    className="object-contain w-full cursor-pointer"
                                                    ref={videoRef}
                                                    style={{
                                                        width: parseInt(item.media_width) || 400,
                                                        height: maxHeight || 400
                                                    }}
                                                    src={item.media_url}
                                                    width={parseInt(item.media_width) || 400}
                                                    height={'auto'}
                                                />
                                                <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
                                                    {muted ? <BiVolumeMute /> : <BiVolumeFull />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={
                clsx("flex flex-col",
                    mediaData.length > 1 && "my-2.5",
                )
            }>
                <div className="flex gap-1 w-full justify-center text-xl">
                    {mediaData.length > 1 && (
                        <div className="flex gap-1 min-w-24 items-start justify-center max-w-20">
                            {scrollSnaps.map((_, index) => {
                                return (
                                    <DotButton
                                        key={index}
                                        onClick={() => onDotButtonClick(index)}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedIndex === index ? 'bg-theme-primary' : 'bg-gray-300'}`} />
                                    </DotButton>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // return (
    //     <Splide ref={ref} options={carouselSettings} className="text-center flex items-center justify-center relative">
    //         {mediaData.map((item, index) => {
    //             return (
    //                 <>
    //                     <SplideSlide key={index}>
    //                         <div className="relative max-h-96 h-full bg-black"
    //                             onClick={(e) => onImageClick?.(e, index)}
    //                         >
    //                             {item && (item.startsWith('data:image') || item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg')) && (
    //                                 <img
    //                                     src={item}
    //                                     id={`post-media-${index}`}
    //                                     alt={`Selected ${index + 1}`}
    //                                     className="max-w-full object-contain h-full m-auto"
    //                                 />
    //                             )}

    //                             {item && (item.startsWith('data:video') || item.endsWith('.mp4')) && (
    //                                 <video
    //                                     controls={showControls}
    //                                     className="max-w-full h-full m-auto" id={`post-media-${index}`}>
    //                                     <source src={item} type="video/mp4" />
    //                                 </video>
    //                             )}

    //                             {childRenderer?.(index)}
    //                         </div>
    //                         {childOutSlide?.(index)}
    //                     </SplideSlide>
    //                 </>
    //             );
    //         })}
    //     </Splide>
    // );
});


export default PostMediaSlider;