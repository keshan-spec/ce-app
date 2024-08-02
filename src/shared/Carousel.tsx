import { memo, PropsWithChildren } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import clsx from "clsx";

type DotButtonPropType = PropsWithChildren<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >
>;

interface CarouselProps {
    children: React.ReactNode;
    settings?: EmblaOptionsType;
    className?: string;
}

const Carousel = ({ children, className, settings = { loop: false } }: CarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(settings);

    return (
        <div className={clsx(
            "embla",
            className
        )} ref={emblaRef}>
            <div className="embla__container">
                {children}
            </div>
        </div>
    );
};

export const DotButton: React.FC<DotButtonPropType> = (props) => {
    const { children, ...restProps } = props;

    return (
        <button type="button" {...restProps}
            className={`${restProps.className} cursor-pointer`}
            aria-label="Go to slide">
            {children}
        </button>
    );
};

export default memo(Carousel);

