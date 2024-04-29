import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import AutoHeight from 'embla-carousel-auto-height';
import {
    NextButton,
    PrevButton,
    usePrevNextButtons
} from './EmblaArrowButtons';
import { DotButton, useDotButton } from './EmbalDotButtons';
import NcImage from '../Image/Image';

type PropType = {
    slides: string[];
    options?: EmblaOptionsType;
    showDotButtons?: boolean;
    showArrowButtons?: boolean;
    afterSlides?: React.ReactNode;
};

const EmblaCarousel: React.FC<PropType> = ({
    slides,
    options,
    showDotButtons = false,
    showArrowButtons = true,
    afterSlides,

}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [AutoHeight({ delay: 5000, stopOnInteraction: false })]);

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => (
                        <div className="embla__slide h-full" key={index}>
                            <div className="embla__slide__number w-full h-full">
                                <NcImage src={slide} alt="" className='object-contain w-full' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showArrowButtons && (
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            )}

            {showDotButtons && (
                <div className="embla__controls">
                    <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                onClick={() => onDotButtonClick(index)}
                                className={'embla__dot'.concat(
                                    index === selectedIndex ? ' embla__dot--selected' : ''
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
            {afterSlides}
        </div>
    );
};

export default EmblaCarousel;
