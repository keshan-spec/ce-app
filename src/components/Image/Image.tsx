'use client';
import {
    FC,
    ImgHTMLAttributes,
    memo,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import checkInViewIntersectionObserver from "@/utils/isInViewPortIntersectionObserver";
import { BiLoader } from "react-icons/bi";
import { default as NextImage } from "next/image";

export interface NcImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    containerClassName?: string;
    placeholderClassName?: string;
    imageDimension?: {
        width: number;
        height: number;
    };
}

const NcImage: FC<NcImageProps> = ({
    containerClassName = "",
    alt = "CarEvents Image",
    src = "",
    className = "object-cover w-full h-full",
    placeholderClassName = "",
    imageDimension = {
        width: 400,
        height: 400,
    },
    ...args
}) => {
    const isMountedRef = useRef(false);
    const _containerRef = useRef<HTMLDivElement | null>(null);
    const _imageElRef = useRef<HTMLImageElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [__src, set__src] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    const _initActions = () => {
        _checkInViewPort();
    };

    const _checkInViewPort = () => {
        if (!_containerRef.current) return;
        checkInViewIntersectionObserver({
            target: _containerRef.current,
            options: {
                root: null,
                rootMargin: "0%",
                threshold: 0,
            },
            freezeOnceVisible: false,
            callback: _imageOnViewPort,
        });
    };

    const _imageOnViewPort = () => {
        if (!src) {
            _handleImageLoaded();
            return true;
        }

        // Abort any previous image load
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const imageEl = new Image();
        _imageElRef.current = imageEl;
        imageEl.src = src;
        imageEl.addEventListener("load", _handleImageLoaded);
        imageEl.addEventListener("error", _handleImageError);

        return () => {
            // Clean up listeners on component unmount
            imageEl.removeEventListener("load", _handleImageLoaded);
            imageEl.removeEventListener("error", _handleImageError);
        };
    };

    const _handleImageLoaded = () => {
        if (!isMountedRef.current) return;
        setImageLoaded(true);
        set__src(src);
    };

    const _handleImageError = () => {
        if (!isMountedRef.current) return;
        console.error("Image failed to load:", src);
    };

    useEffect(() => {
        isMountedRef.current = true;
        _initActions();
        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [src]);

    const renderLoadingPlaceholder = () => {
        return (
            <div
                className={`w-full h-full flex items-center justify-center bg-theme-dark/70 dark:bg-custom-900 text-neutral-100 dark:text-neutral-500 ${placeholderClassName}`}
                style={{ height: imageDimension.height, width: "100%" }}
            >
                <BiLoader className="animate-spin text-xl w-full text-white" />
            </div>
        );
    };

    const renderLoadingPlaceholderMemo = useMemo(() => {
        return renderLoadingPlaceholder();
    }, []);

    return (
        <div
            className={`nc-NcImage lg:min-w-0 w-full ${containerClassName}`}
            data-nc-id="NcImage"
            ref={_containerRef}
        >
            {__src && imageLoaded ? (
                <NextImage
                    src={__src}
                    className={`w-full ${className}`}
                    alt={alt}
                    {...args}
                    width={imageDimension.width}
                    height={imageDimension.height}
                    unoptimized
                />
            ) : renderLoadingPlaceholderMemo}
        </div>
    );
};

export default memo(NcImage);
