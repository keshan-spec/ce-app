'use client';
import { IonIcon } from '@ionic/react';
import { camera, closeOutline, images, recording, swapVertical, videocam } from 'ionicons/icons';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/shared/Button';
import { Options } from '@splidejs/splide';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { addPost, addTagsForPost } from '@/actions/post-actions';

import Modal from '@/shared/Modal';
import ImageCropModal from './ImageCrop';
import { ImageMeta, Tag, useCreatePost } from '@/app/context/CreatePostContext';
import { forwardRef } from 'react';
import { AssociateCar } from '../TagEntity/AssociateCar';
import { BiTag } from 'react-icons/bi';
import Draggable from 'react-draggable';
import clsx from 'clsx';

const carouselOptions: Options = {
    perPage: 1,
    rewind: false,
    gap: 16,
    padding: 16,
    arrows: false,
    pagination: false,
};

interface PostInitialPanelProps { }

export const PostInitialPanel = forwardRef((props: PostInitialPanelProps, ref: React.ForwardedRef<Webcam>) => {
    const {
        captureImage,
        capturing,
        isVideoMode,
        switchMode,
        handleMediaChange,
    } = useCreatePost();

    return (
        <>
            <input
                type="file"
                id="galleryInput"
                accept="image/*, video/*"
                onChange={handleMediaChange}
                multiple // Allow selecting multiple images or videos
                className="hidden"
            />

            <Webcam
                audio={false}
                ref={ref}
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                    facingMode: 'environment',
                    frameRate: { ideal: 60, max: 60 },
                }}
            />

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 h-24 w-3/4 rounded-lg backdrop-blur-xl flex justify-between items-center">
                <button
                    onClick={() => document.getElementById('galleryInput')?.click()}
                    className="flex flex-col items-center gap-1 text-white px-4 py-2">
                    <IonIcon icon={images}
                    />
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
});


interface EditMediaPanelProps { }
export const EditMediaPanel: React.FC<EditMediaPanelProps> = () => {
    const { updateImage, setEditImage, setStep, editImage, media, mediaData, } = useCreatePost();

    return (
        <div className="relative h-full flex flex-col gap-4">
            <Modal isOpen={editImage !== null} onClose={() => setEditImage(null)} title='Edit Image'>
                <ImageCropModal
                    image={media[editImage!]}
                    onCrop={(area) => {
                        updateImage(editImage!, area);
                    }}
                />
            </Modal>

            <div className="flex flex-wrap gap-4 mt-20">
                <PostMediaSlider mediaData={mediaData} onImageClick={(e, index) => setEditImage(index)} />
                {/* <Splide options={carouselOptions} className="text-center carousel-slider flex items-center">
                    {mediaData.map((item, index) => {
                        return (
                            <SplideSlide key={index}>
                                <div className="max-h-96 overflow-hidden bg-black">
                                    {item && item.startsWith('data:image') && (
                                        <img
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
                </Splide> */}
            </div>

            <div className="flex fixed bottom-0 left-0 w-full gap-2">
                <Button
                    className='w-full'
                    theme='secondary'
                    onClick={() => {
                        setStep('initial');
                    }}
                >
                    Back
                </Button>
                <Button
                    className='text-white w-full'
                    onClick={() => {
                        setStep('share');
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

const PostMediaSlider = ({
    onImageClick,
    mediaData,
    carouselSettings = carouselOptions,
    childRenderer,
    childOutSlide,
}: {
    onImageClick: (event: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number) => void;
    mediaData: string[];
    carouselSettings?: Options;
    childRenderer?: (index: number) => JSX.Element;
    childOutSlide?: (index: number) => JSX.Element;
}) => {
    return (
        <Splide options={carouselSettings} className="text-center carousel-slider flex items-center justify-center">
            {mediaData.map((item, index) => {
                return (
                    <SplideSlide key={index}>
                        <div className="relative max-h-96 h-full bg-black">
                            {item && item.startsWith('data:image') && (
                                <img
                                    src={item}
                                    id={`post-media-${index}`}
                                    alt={`Selected ${index + 1}`}
                                    className="max-w-full object-cover h-full m-auto"
                                    onClick={(e) => onImageClick(e, index)}
                                />
                            )}

                            {item && item.startsWith('data:video') && (
                                <video src={item} controls className="max-w-full" id={`post-media-${index}`} />
                            )}

                            {childRenderer?.(index)}
                        </div>
                        {childOutSlide?.(index)}
                    </SplideSlide>
                );
            })}
        </Splide>
    );
};

interface PostSharePanelProps {
    onPostSuccess: () => void;
    goBack: () => void;
}

export const PostSharePanel: React.FC<PostSharePanelProps> = ({ onPostSuccess, goBack }) => {
    const [posting, setPosting] = useState<{
        loading: boolean;
        error: string | null;
    }>({ loading: false, error: null });
    const errorDiv = useRef<HTMLDivElement>(null);

    const { mediaData, setStep, setActiveTagIndex } = useCreatePost();

    const imageMeta = useCallback((): ImageMeta => {
        let tallestImg = 0;
        const data = mediaData.map((item, idx) => {
            const elem = document.getElementById(`post-media-${idx}`);

            if (elem?.clientHeight! > tallestImg) {
                tallestImg = elem?.clientHeight!;
            }

            return {
                data: item,
                width: elem?.clientWidth,
                height: elem?.clientHeight,
                type: item.startsWith('data:image') ? 'image' : 'video',
            };
        });


        // loop through the data and set the height of all images to the tallest image
        return data.map(item => {
            item.height = tallestImg;
            return item;
        }) as ImageMeta;
    }, [mediaData]);

    const handleShare = async (formData: FormData) => {
        setPosting({ loading: true, error: null });
        const mediaList = imageMeta();
        const associateCars = formData.get('associatedCars')?.toString();

        const data = {
            caption: formData.get('caption')?.toString(),
            location: formData.get('location')?.toString(),
            associatedCars: associateCars?.split(',').map(car => car.trim()),
        };

        try {
            await addPost(mediaList, data.caption, data.location, associateCars);
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

    return (
        <form className="relative h-full flex flex-col gap-4" action={handleShare}>
            <div className="flex flex-wrap gap-4 mt-20">
                <PostMediaSlider
                    mediaData={mediaData}
                    onImageClick={(e, index) => {
                        setActiveTagIndex(index);
                        setStep('tag');
                    }}
                />
            </div>
            <textarea placeholder="Write a caption..." className="border p-2 rounded" name='caption' />
            <AssociateCar inputName='associatedCars' />

            {posting.error && (
                <div className={`fixed z-10 w-full bottom-0 h-14 p-2 mt-2 text-center text-red-500 bg-red-100`} ref={errorDiv}>
                    {posting.error}
                </div>
            )}

            <div className="flex items-center gap-2 px-3 border-1 py-3" onClick={() => {
                setStep('tag');
            }}>
                <BiTag className="text-lg" />
                Tag Entities
            </div>

            <div className="flex fixed bottom-0 left-0 w-full gap-2">
                <Button
                    className='text-white w-full'
                    onClick={goBack}
                >
                    Back
                </Button>
                <Button
                    className='text-white w-full'
                    fullPageLoading
                >
                    Share
                </Button>
            </div>
        </form>
    );
};




export const PostTagPanel: React.FC = () => {
    const { mediaData, setStep, activeTagIndex, taggedData, setTaggedData } = useCreatePost();

    const [tagInput, setTagInput] = useState<{ x: number; y: number; visible: boolean, index: number; }>({ x: 0, y: 0, visible: false, index: 0 });
    const [currentTag, setCurrentTag] = useState<string>('');
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const tagCarousel: Options = {
        ...carouselOptions,
        start: activeTagIndex,
    };

    const onImageClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>, index: number) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setTagInput({ x, y, visible: true, index });
    };

    const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(event.target.value);
    };

    const handleTagInputBlur = () => {
        if (currentTag.trim() && inputFocused) {
            setTaggedData([...taggedData, { x: tagInput.x, y: tagInput.y, label: currentTag, index: tagInput.index }]);
        }
        setTagInput({ x: 0, y: 0, visible: false, index: 0 });
        setCurrentTag('');
    };

    const handleTagInputFocus = () => {
        setInputFocused(true);
    };

    const renderImageTags = (index: number) => {
        return taggedData.filter(tag => tag.index === index).map((tag, i) => (
            <TagEntity key={i} {...tag} />
        ));
    };

    const renderImageTagsList = (index: number) => {
        return taggedData.filter(tag => tag.index === index).map((tag, i) => (
            <div key={i} className="bg-black text-white p-1 rounded-lg flex items-center justify-between">
                <span className="px-3">{tag.label}</span>
                <IonIcon icon={closeOutline} onClick={() => {
                    setTaggedData(taggedData.filter((_, idx) => idx !== i));
                }} />
            </div>
        ));
    };

    const handleFinish = async () => {
        await addTagsForPost(21, taggedData);
    };

    return (
        <div className="relative h-full flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 mt-20">
                {tagInput.visible && (
                    <div className="tag-input-container w-full px-2">
                        <input
                            type="text"
                            placeholder='Tag someone...'
                            className="border p-1 rounded tag-input w-full"
                            value={currentTag}
                            onChange={handleTagInputChange}
                            onFocus={handleTagInputFocus}
                            onBlur={handleTagInputBlur}
                            autoFocus
                        />
                        <div className="arrow"></div>
                    </div>
                )}

                <PostMediaSlider
                    mediaData={mediaData}
                    onImageClick={onImageClick}
                    carouselSettings={tagCarousel}
                    childRenderer={(index) => {
                        return (
                            <>
                                {renderImageTags(index)}

                                {tagInput.visible && tagInput.index === index && (
                                    <TagEntity x={tagInput.x} y={tagInput.y} label={"Who's this?"} index={index} />
                                )}
                            </>
                        );
                    }}

                    childOutSlide={(index) => (
                        <div className={clsx(
                            "w-full mt-1 flex flex-col gap-1",
                            taggedData.filter(tag => tag.index === index).length > 0 ? 'visible' : 'hidden'
                        )}>
                            <h3 className="text-black text-left mt-2">Tags</h3>
                            {renderImageTagsList(index)}
                        </div>
                    )}
                />
            </div>

            <div className="flex fixed bottom-0 left-0 w-full gap-2">
                <Button
                    className='text-white w-full'
                    onClick={() => {
                        setStep('share');
                    }}
                >
                    Back
                </Button>
                <Button
                    className='text-white w-full'
                    onClick={() => {
                        // setStep('share');
                        handleFinish();
                    }}
                >
                    Finish
                </Button>
            </div>
        </div>
    );
};

export const TagEntity = ({ x, y, label }: Tag) => {
    return (
        <div
            className="tag-label p-1 text-xs text-white bg-black/80 rounded-lg z-50"
            style={{ position: 'absolute', left: x, top: y }}
        >
            {label}
        </div>
    );
};

// const TagEntity: React.FC<Tag> = ({ x, y, label }) => {
//     const [position, setPosition] = useState({ x, y });

//     const handleDrag = (e: any, data: any) => {
//         setPosition({ x: data.x, y: data.y });
//         document.body.style.pointerEvents = 'auto';
//     };

//     return (
//         <Draggable
//             defaultPosition={{ x, y }}
//             onStart={() => {
//                 // make body pointer events none
//                 document.body.style.pointerEvents = 'none';
//             }}
//             onDrag={() => {
//                 // make body pointer events none
//                 document.body.style.pointerEvents = 'none';
//             }}
//             onStop={handleDrag}
//             position={position}
//         >
//             <div
//                 className="tag-label p-1 text-sm text-white bg-black/80 rounded-lg z-50 w-fit"
//                 style={{ position: 'absolute', left: position.x - 50, top: position.y }}
//             >
//                 {label}
//             </div>
//         </Draggable>
//     );
// };