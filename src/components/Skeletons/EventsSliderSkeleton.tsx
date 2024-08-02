import { CarEventCardSkeleton, carouselOptions } from '../Home/Events';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { memo } from 'react';

const EventsSliderSkeleton = memo(() => {
    return (
        <Splide options={carouselOptions}>
            <SplideSlide>
                <CarEventCardSkeleton />
            </SplideSlide>
        </Splide>
    );
});

export default EventsSliderSkeleton;