'use client';
import { useCreatePost } from '@/app/context/CreatePostContext';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

interface SlideInFromBottomToTopProps {
    isOpen: boolean;
    children: React.ReactNode;
    height?: string | number;
    onClose: () => void;
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

const SlideInPanel: React.FC<SlideInFromBottomToTopProps> = ({
    children,
    isOpen,
    height = '100%',
    onClose,
    className = '',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { step, setStep } = useCreatePost();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        switch (step) {
            case 'initial':
                onClose();
                break;
            case 'edit':
                setStep('initial');
                break;
            case 'share':
                setStep('edit');
                break;
            case 'tag':
                setStep('share');
                break;
            default:
                break;
        }
    }, [onClose, setStep, step]);

    const handleNext = useCallback(() => {
        switch (step) {
            case 'initial':
                setStep('edit');
                break;
            case 'edit':
                setStep('share');
                break;
            case 'tag':
                setStep('share');
                break;
            default:
                break;
        }
    }, [setStep, step]);

    const renderHeader = useCallback(() => {
        let title = '';
        let icon = '';

        switch (step) {
            case 'edit':
                title = 'Edit Image';
                icon = 'fas fa-arrow-left';
                break;
            case 'tag':
                title = 'Tag Image';
                icon = 'fas fa-arrow-left';
                break;
            case 'share':
                title = 'Share Post';
                icon = 'fas fa-arrow-left';
                break;
            default:
                title = 'Create Post';
                icon = 'fas fa-times';
                break;
        }

        return (
            <>
                <div className="flex items-center">
                    <button
                        onClick={() => handleClose()}
                        className={clsx(
                            "text-md text-black cursor-pointer font-bold",
                            "p-2 w-10 h-10 flex items-center justify-center text-black"
                        )}
                    >
                        <i className={icon}></i>
                    </button>
                    <span className="text-md font-semibold">{title}</span>
                </div>
                <div className="flex items-center pr-3">
                    {(step === 'edit' || step === 'tag') && (
                        <span
                            onClick={() => handleNext()}
                            className="text-md font-semibold text-theme-primary">
                            {step === 'edit' ? 'Next' : 'Finish'}
                        </span>
                    )}
                </div>
            </>
        );
    }, [step]);

    return (
        <Transition
            ref={ref}
            show={isOpen}
            className={clsx(
                "z-10 w-full fixed bottom-0 inset-x-0 bg-white h-full rounded-t-lg slide-in",
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
                    "w-full my-2 px-2 flex items-center gap-2 justify-between",
                    // 'absolute top-0 z-50',
                )}>
                {renderHeader()}
            </div>

            {children}
        </Transition>
    );
};

export default SlideInPanel;
