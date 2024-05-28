'use client';
import { IonIcon } from '@ionic/react';
import { camera, images, recording, swapVertical, videocam } from 'ionicons/icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/shared/Button';
import { Options } from '@splidejs/splide';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { addPost } from '@/actions/post-actions';
import { vibrateDevice } from '@/utils/nativeFeel';

import { Area } from "react-easy-crop";
import Modal from '@/shared/Modal';
import NcImage from '../Image/Image';
import ImageCropModal from './ImageCrop';

const carouselOptions: Options = {
    perPage: 1,
    rewind: true,
    gap: 0,
    padding: 10,
    arrows: false,
    pagination: true,
};

interface CreatePostProps {
    closePanel: () => void;
}

export type ImageMeta = {
    width: number;
    height: number;
    mime?: string;
    alt?: string;
    data: string;
    type: 'image' | 'video';
}[];

export const CreatePost: React.FC<CreatePostProps> = ({
    closePanel
}) => {
    const webcamRef = useRef<Webcam>(null);
    const [isVideoMode, setIsVideoMode] = useState<boolean>(true); // Initially, video mode is enabled
    const [selectedMedia, setSelectedMedia] = useState<(string | null)[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder>();
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);

    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.removeEventListener(
                    "dataavailable",
                    handleDataAvailable
                );
            }

            setCapturing(false);
            setRecordedChunks([]);
        };
    }, []);

    const handleStartCaptureClick = useCallback(() => {
        if (!webcamRef.current) return;

        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream!, {
            mimeType: "video/webm"
        });

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = useCallback(({ data }: { data: any; }) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, [setRecordedChunks]);

    const handleStopCaptureClick = useCallback(() => {
        if (!mediaRecorderRef.current || !webcamRef.current) return;

        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);


    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newMedia: (string | null)[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onloadend = () => {
                    newMedia.push(reader.result as string);
                    if (newMedia.length === files.length) {
                        setSelectedMedia(prevMedia => [...prevMedia, ...newMedia]);
                    }
                };
                reader.readAsDataURL(file);

                setStep(1);
            }
        }
    };

    const captureImage = useCallback(() => {
        if (isVideoMode) {
            if (capturing) {
                handleStopCaptureClick();
                setStep(1);
            } else {
                handleStartCaptureClick();
            }
        } else {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setSelectedMedia(prevMedia => [...prevMedia, imageSrc]);
                setStep(1);
            }
        }
    }, [webcamRef, capturing, isVideoMode]);

    const switchMode = useCallback(() => {
        vibrateDevice(100);
        setIsVideoMode(prevMode => !prevMode);
    }, []);

    const renderCapturedMedia = () => {

        let component: JSX.Element | null = null;

        if (recordedChunks.length > 0) {
            // create video from recorded chunks

            const blob = new Blob(recordedChunks, { type: "video/webm" });

            // const video = document.createElement('video');
            // video.src = URL.createObjectURL(blob);
            // video.onloadedmetadata = () => {
            //     imageMeta.push({
            //         data: URL.createObjectURL(blob),
            //         width: video.videoWidth,
            //         height: video.videoHeight,
            //         type: 'video',
            //     });
            // };

            component = (
                <video
                    src={URL.createObjectURL(blob)}
                />
            );
        }

        if (selectedMedia.length > 0) {
            component = (
                <div className="flex flex-wrap gap-4 mt-20">
                    <Splide options={carouselOptions}>
                        {selectedMedia.map((media, index) => {
                            // create image from base64 and get dimensions and other meta data
                            // if (media?.startsWith('data:video')) {
                            //     const video = document.createElement('video');
                            //     video.src = media;
                            //     video.onloadedmetadata = () => {
                            //         imageMeta.push({
                            //             data: media!,
                            //             width: video.videoWidth,
                            //             height: video.videoHeight,
                            //             type: 'video',
                            //         });
                            //     };
                            // } else {
                            //     const img = new Image();

                            //     img.src = media!;
                            //     img.onload = () => {
                            //         imageMeta.push({
                            //             data: media!,
                            //             width: img.width,
                            //             height: img.height,
                            //             type: 'image',
                            //         });
                            //     };
                            // }

                            return (
                                <SplideSlide key={index}>
                                    <div className="max-h-96 overflow-hidden">
                                        {media && media.startsWith('data:image') && (
                                            <img src={media} alt={`Selected ${index + 1}`} className="max-w-full" />
                                        )}
                                        {media && media.startsWith('data:video') && (
                                            <video
                                                src={media}
                                                className="max-w-full"
                                            />
                                        )}
                                    </div>
                                </SplideSlide>
                            );
                        })}
                    </Splide>
                </div>
            );
        }


        return (
            <div className="relative w-full h-[100dvh] flex flex-col items-start justify-start">
                {component}
                <div className="flex mx-auto mt-2 gap-3">
                    <Button onClick={() => {
                        setRecordedChunks([]);
                        setSelectedMedia([]);
                        setStep(0);
                    }}>
                        Retry
                    </Button>

                    <Button onClick={() => {
                        setStep(2);
                    }}>
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    const renderStep = useCallback(() => {
        if (step === 0) {
            return (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        videoConstraints={{
                            facingMode: 'environment',
                            frameRate: { ideal: 60, max: 60 },
                        }} // Rear camera
                    />

                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 h-24 w-3/4 rounded-lg backdrop-blur-xl flex justify-between items-center">
                        <button
                            onClick={() => document.getElementById('galleryInput')?.click()}
                            className="flex flex-col items-center gap-1 text-white px-4 py-2">
                            <IonIcon icon={images} />
                            Gallery
                        </button>
                        <button onClick={captureImage} >
                            {/* circle */}
                            <div className="w-16 h-16 rounded-full bg-white flex justify-center items-center text-3xl">
                                <IonIcon icon={isVideoMode ? capturing ? recording : videocam : camera} />
                            </div>
                        </button>
                        <button onClick={switchMode} className="flex flex-col items-center gap-1 text-white px-4 py-2">
                            <IonIcon icon={swapVertical} />
                            Switch
                        </button>
                    </div>
                </>
            );
        }

        if (step === 1) {
            return renderCapturedMedia();
        }

        if (step === 2) {
            const media = selectedMedia.filter(media => media !== null) as string[];
            media.push(...recordedChunks.map(chunk => URL.createObjectURL(chunk)));

            return (
                <PostSharePanel media={media} onPostSuccess={closePanel} />
            );
        }

        return null;
    }, [step, isVideoMode, capturing, captureImage, switchMode, selectedMedia, renderCapturedMedia]);

    return (
        <div className="relative w-full h-[100dvh]">
            <input
                type="file"
                id="galleryInput"
                accept="image/*, video/*"
                onChange={handleMediaChange}
                multiple // Allow selecting multiple images or videos
                className="hidden"
            />
            {renderStep()}
        </div>
    );
};


interface PostSharePanelProps {
    media: string[];
    onPostSuccess: () => void;
}

const PostSharePanel: React.FC<PostSharePanelProps> = ({ media, onPostSuccess }) => {
    const [posting, setPosting] = useState<{
        loading: boolean;
        error: string | null;
    }>({ loading: false, error: null });
    const errorDiv = useRef<HTMLDivElement>(null);

    const [mediaData, setMediaData] = useState<string[]>(media.filter(media => media !== null) as string[]);
    const [editImage, setEditImage] = useState<number | null>(null);

    const imageMeta = useCallback((): ImageMeta => {
        const data = mediaData.map((item, idx) => {
            const elem = document.getElementById(`post-media-${idx}`);
            return {
                data: item,
                width: elem?.clientWidth,
                height: elem?.clientHeight,
                type: item.startsWith('data:image') ? 'image' : 'video',
            };
        });

        return data as ImageMeta;

        // const promises = mediaData.map((item, idx) => {
        //     return new Promise((resolve) => {
        //         if (item.startsWith('data:image')) {
        //             const img = document.createElement('img');
        //             img.id = `image-${idx}`;
        //             img.src = item;

        //             img.onload = () => {
        //                 const elem = document.getElementById(`post-media-${idx}`);

        //                 resolve({
        //                     data: item,
        //                     width: elem?.clientWidth || img.width,
        //                     height: elem?.clientHeight || img.height,
        //                     type: 'image',
        //                 });
        //             };
        //         } else if (item.startsWith('data:video')) {
        //             const video = document.createElement('video');
        //             video.src = item;
        //             video.onloadedmetadata = () => {
        //                 const elem = document.getElementById(`post-media-${idx}`);

        //                 resolve({
        //                     data: item,
        //                     width: elem?.clientWidth || video.videoWidth,
        //                     height: elem?.clientHeight || video.videoHeight,
        //                     type: 'video',
        //                 });
        //             };
        //         } else {
        //             resolve({
        //                 data: item,
        //                 width: 0,
        //                 height: 0,
        //                 type: 'unknown',
        //             });
        //         }
        //     });
        // });

        // return Promise.all(promises) as Promise<ImageMeta>;
    }, [mediaData]);

    const handleShare = async (formData: FormData) => {
        setPosting({ loading: true, error: null });
        const mediaList = await imageMeta();

        try {
            await addPost(mediaList, formData.get('caption')?.toString(), formData.get('location')?.toString());
            setPosting({ loading: false, error: null });
            onPostSuccess();
        } catch (e: any) {
            setPosting({ loading: false, error: e.message });
            // // hide error after 5 seconds
            setTimeout(() => {
                setPosting({ loading: false, error: null });
            }, 5000);
        }
    };

    const updateImage = (index: number, croppedArea: Area) => {
        const img = new Image();
        img.src = media[index];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        img.onload = () => {
            canvas.width = croppedArea.width;
            canvas.height = croppedArea.height;

            ctx.drawImage(img,
                croppedArea.x,
                croppedArea.y,
                croppedArea.width,
                croppedArea.height,
                0,
                0,
                croppedArea.width,
                croppedArea.height
            );

            const newMedia = [...mediaData];
            newMedia[index] = canvas.toDataURL();
            setEditImage(null);
            setMediaData(newMedia);
        };
    };

    // a share panel like instagram
    return (
        <form className="relative h-full flex flex-col gap-4" action={handleShare}>
            <Modal isOpen={editImage !== null} onClose={() => setEditImage(null)} title='Edit Image'>
                <ImageCropModal
                    image={media[editImage!]}
                    onCrop={(area) => {
                        updateImage(editImage!, area);
                    }}
                />
            </Modal>

            <div className="flex flex-wrap gap-4 mt-20">
                <Splide options={carouselOptions}>
                    {mediaData.map((item, index) => {
                        return (
                            <SplideSlide key={index}>
                                <div className="max-h-96 overflow-hidden">
                                    {item && item.startsWith('data:image') && (
                                        <NcImage
                                            src={item}
                                            id={`post-media-${index}`}
                                            alt={`Selected ${index + 1}`}
                                            className="max-w-full"
                                            onClick={() => {
                                                setEditImage(index);
                                            }} />
                                    )}

                                    {item && item.startsWith('data:video') && (
                                        <video src={item} controls className="max-w-full" id={`post-media-${index}`} />
                                    )}
                                </div>
                            </SplideSlide>
                        );
                    })}
                </Splide>
            </div>
            <textarea placeholder="Write a caption..." className="border p-2 rounded" name='caption' />
            <input type="text" placeholder="Add location" className="border p-2 rounded" name='location' />

            {posting.error && (
                <div className={`fixed z-10 w-full bottom-0 h-14 p-2 mt-2 text-center text-red-500 bg-red-100`} ref={errorDiv}>
                    {posting.error}
                </div>
            )}

            <Button
                className='fixed bottom-0 left-0 w-full bg-blue-500 text-white'
                fullPageLoading
            >
                Share
            </Button>
        </form>
    );
};