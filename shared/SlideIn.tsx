'use client';
import { Transition } from '@headlessui/react';

interface SlideInFromBottomToTopProps {
    isOpen: boolean;
    children: React.ReactNode;
    height?: string | number;
    onClose: () => void;
}

// https://www.skies.dev/headless-ui-transitions
export const transitionClasses = {
    enter: 'transform transition ease-in-out duration-500 sm:duration-700',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transform transition ease-in-out duration-500 sm:duration-700',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
};

const SlideInFromBottomToTop: React.FC<SlideInFromBottomToTopProps> = ({
    children,
    isOpen,
    height = '100%',
    onClose
}) => {
    return (
        <Transition
            show={isOpen}
            className="z-10 w-full fixed bottom-0 inset-x-0 bg-white h-full overflow-scroll"
            style={{ height, position: 'fixed', zIndex: 9999 }}
            enter={transitionClasses.enter}
            enterFrom={transitionClasses.enterFrom}
            enterTo={transitionClasses.enterTo}
            leave={transitionClasses.leave}
            leaveFrom={transitionClasses.leaveFrom}
            leaveTo={transitionClasses.leaveTo}
        >
            <div className="flex justify-start w-full my-2 px-3">
                <button
                    onClick={() => onClose()}
                    className="text-md text-black cursor-pointer font-bold"
                >
                    &#x2715;
                </button>
            </div>
            <div className="flex flex-col items-center w-full">
                {children}
            </div>
        </Transition>
    );
};

export default SlideInFromBottomToTop;
