'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';

const variants = {
    initial: { x: '100%', opacity: 0 },
    enter: { x: '0%', opacity: 1, transition: { duration: 0.2 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
};

const animatedPaths = [
    '/store/product/',
    '/post/',
    '/cart',
    '/checkout',
    '/profile/edit/',
    '/garage/edit/',
    '/garage/add',
    '/profile/garage/',
    '/garage',
    '/edit-post/',
    '/notifications',
    '/search',
];

const AnimatedLayout = ({ children }: { children: React.ReactNode; }) => {
    const asPath = usePathname();
    const searchParams = useSearchParams();

    const shouldAnimate = animatedPaths.some(path => asPath.startsWith(path));
    const hasAnimation = searchParams.get('ref') === 'redirect' || searchParams.get('ref') === 'back';

    return (
        <AnimatePresence mode="popLayout">
            {shouldAnimate || hasAnimation ? (
                <motion.div
                    transition={{
                        ease: 'easeIn',
                        type: 'tween',
                    }}
                    key={asPath}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={variants}
                    style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                >
                    {children}
                </motion.div>
            ) : (
                <>
                    {children}
                </>
            )}
        </AnimatePresence>
    );
};

export default AnimatedLayout;
