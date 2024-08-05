'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

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
    '/edit-post/',
    '/notifications',
    '/search',
    '/profile',
];

const AnimatedLayout = ({ children }: { children: React.ReactNode; }) => {
    const asPath = usePathname();

    const shouldAnimate = animatedPaths.some(path => asPath.startsWith(path));

    return (
        <AnimatePresence mode="wait">
            {shouldAnimate ? (
                <motion.div
                    key={asPath}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={variants}
                    style={{ position: 'relative', width: '100%' }}
                >
                    {children}
                </motion.div>
            ) : (
                <div style={{ width: '100%' }}>
                    {children}
                </div>
            )}
        </AnimatePresence>
    );
};

export default AnimatedLayout;
