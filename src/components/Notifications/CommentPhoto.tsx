"use client";
import Image from "next/image";
import React from "react";

const myphotos = [
    {
        id: "1",
        imgUrl: "/assets/logo.png",
    },
];

function CommentPhoto({ src }: { src: string; }) {
    return (
        <Image
            src={src}
            alt="user photo"
            width={0}
            height={0}
            unoptimized
            className="mt-1 inline-block h-11 w-11 hover:cursor-pointer"
        ></Image>
    );
}

export default CommentPhoto;
