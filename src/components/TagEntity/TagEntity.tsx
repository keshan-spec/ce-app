import { Tag } from "@/app/context/CreatePostContext";
import clsx from "clsx";
import { useState } from "react";
import Draggable from "react-draggable";

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
                left: `${x - 40}px`,
                top: `${y - 40}px`
            }}
            onClick={onClick}
        >
            {label}
        </div>
    );
};

export const DraggableTagEntity = ({
    x,
    y,
    label,
    onClick,
    index,
    onPositionChange,
    onDragEnd,
    onDragStart,
}: TagEntityProps) => {
    const [position, setPosition] = useState({
        x: x - 100,
        y: y - 80
    });

    const handleDrag = (e: any, data: any) => {
        setPosition({ x: data.x, y: data.y });
        onPositionChange?.(data.x, data.y);
        onDragEnd?.();
    };

    return (
        <Draggable
            defaultPosition={{ x, y }}
            onStop={handleDrag}
            position={position}
            onStart={onDragStart}
        >
            <div
                key={index}
                role='button'
                className={clsx(
                    "tag-label p-1 text-xs text-white bg-black/80 rounded-lg z-50 absolute",
                )}
                style={{
                    left: `${x - 40}px`,
                    top: `${y - 40}px`
                }}
                onClick={onClick}
            >
                {label}
            </div>
        </Draggable>

    );
};