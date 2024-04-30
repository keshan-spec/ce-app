import {
    FC,
    ImgHTMLAttributes,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import checkInViewIntersectionObserver from "@/utils/isInViewPortIntersectionObserver";
import { BiLoader } from "react-icons/bi";


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
    let isMounted = false;
    const _containerRef = useRef(null);
    let _imageEl: HTMLImageElement | null = null;
    // const darkmodeState = useAppSelector(selectDarkmodeState);

    const [__src, set__src] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);

    const _initActions = async () => {
        // set__src(placeholderImage);
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
        _imageEl = new Image();
        if (_imageEl) {
            _imageEl.src = src;
            _imageEl.addEventListener("load", _handleImageLoaded);
        }
        return true;
    };

    const _handleImageLoaded = () => {
        if (!isMounted) return;
        setImageLoaded(true);
        set__src(src);
    };

    useEffect(() => {
        isMounted = true;
        _initActions();
        return () => {
            isMounted = false;
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
            {/* {renderLoadingPlaceholderMemo} */}
            {__src && imageLoaded ? (
                <img src={__src} className={`w-full ${className}`} alt={alt} {...args} loading="lazy" />
            ) : renderLoadingPlaceholderMemo}
        </div>
    );
};

export default NcImage;
