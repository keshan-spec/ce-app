"use client";
import Image from "next/image";

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
        <Image
            src={src}
            alt="Post photo"
            width={0}
            height={0}
            unoptimized
            className="mt-1 inline-block h-11 w-11 hover:cursor-pointer object-cover"
        />
    );
}

export default CommentPhoto;
