import { Transition } from '@headlessui/react';
import { clsx } from 'clsx';

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
            className="z-10 w-full fixed bottom-0 inset-x-0 bg-white h-full px-5"
            style={{ height }}
            {...transitionClasses}
        >
            <div className="flex justify-start w-full mt-5 overflow-scroll">
                <button
                    onClick={() => onClose()}
                    className="text-md text-black mb-3 cursor-pointer font-bold"
                >
                    &#x2715;
                </button>
            </div>
            <div className="flex flex-col items-center w-full mt-3">
                {children}
            </div>
        </Transition>
    );
};

export default SlideInFromBottomToTop;
