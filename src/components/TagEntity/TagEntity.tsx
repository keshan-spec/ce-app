import { Tag } from "@/app/context/CreatePostContext";
import clsx from "clsx";

export interface TagEntityProps extends Tag {
    onClick?: () => void;
    onPositionChange?: (x: number, y: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

export const TagEntity = ({
    x,
    y,
    label,
    onClick,
    index,
}: TagEntityProps) => {

    return (
        <div
            key={index}
            role='button'
            className={clsx(
                "tag-label p-1 text-xs text-white bg-black/80 rounded-lg z-50 absolute",
            )}
            style={{
                // left: `${x - 40}px`,
                // top: `${y - 40}px`
            }}
            onClick={onClick}
        >
            {label}
        </div>
    );
};
