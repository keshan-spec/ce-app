"use client";
import Image from "next/image";
import NcImage from "../Image/Image";

function CommentPhoto({ src }: { src: string; }) {
    if (src.endsWith(".mp4")) {
        return (
            <video
                src={src}
                muted
                className="mt-1 inline-block h-11 w-11 hover:cursor-pointer object-cover"
            ></video>
        );
    }


    return (
        <NcImage
            src={src}
            alt="Post photo"
            width={44}
            height={44}
            imageDimension={{
                height: 44,
                width: 44,
            }}
            className="mt-1 inline-block h-11 w-11 hover:cursor-pointer object-cover"
        />
    );
}

export default CommentPhoto;
