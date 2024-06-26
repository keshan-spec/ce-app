'use client';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface SlideInFromBottomToTopProps {
    isOpen: boolean;
    children: React.ReactNode;
    height?: string | number;
    onClose: () => void;
    title?: string;
    stickyScroll?: boolean;
    fullScreen?: boolean;
    titleClassName?: string;
    className?: string;
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
    title,
    onClose,
    stickyScroll = false,
    fullScreen = false,
    className = '',
    titleClassName = '',
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    return (
        <Transition
            ref={ref}
            show={isOpen}
            className={clsx(
                "z-10 w-full fixed bottom-0 inset-x-0 bg-white h-full rounded-t-lg slide-in",
                !stickyScroll && 'overflow-scroll',
                className
            )}
            style={{ height, position: 'fixed', zIndex: 9999 }}
            enter={transitionClasses.enter}
            enterFrom={transitionClasses.enterFrom}
            enterTo={transitionClasses.enterTo}
            leave={transitionClasses.leave}
            leaveFrom={transitionClasses.leaveFrom}
            leaveTo={transitionClasses.leaveTo}
        >
            <div
                className={clsx(
                    "w-full my-2 pb-1 px-3",
                    fullScreen ? 'absolute top-0 z-50' : 'flex justify-between items-center border-b',
                    titleClassName
                )}>
                <button
                    onClick={() => onClose()}
                    className={clsx(
                        "text-md text-black cursor-pointer font-bold",
                        fullScreen && "p-2 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full text-white"
                    )}
                >
                    &#x2715;
                </button>
                {title && <span className="text-sm font-semibold">{title}</span>}
                <span></span>
            </div>
            <div className={clsx(
                "flex flex-col items-center w-full",
                stickyScroll && 'overflow-scroll h-inherit'
            )}>
                {children}
            </div>
        </Transition>
    );
};

export default SlideInFromBottomToTop;
