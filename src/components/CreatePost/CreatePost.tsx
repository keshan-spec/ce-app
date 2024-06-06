'use client';
import { IonIcon } from '@ionic/react';
import { camera, closeOutline, images, recording, swapVertical, videocam, personOutline, carOutline } from 'ionicons/icons';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/shared/Button';
import { Options } from '@splidejs/splide';
import { Splide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { addPost, fetchTaggableEntites } from '@/actions/post-actions';

import Modal from '@/shared/Modal';
import ImageCropModal from './ImageCrop';
import { ImageMeta, useCreatePost } from '@/app/context/CreatePostContext';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { debounce } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { DraggableTagEntity, TagEntity } from '../TagEntity/TagEntity';
import PostMediaSlider from './PostMediaSlider';

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
                forceScreenshotSourceSize
                ref={ref}
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                    // facingMode: 'environment',
                    // frameRate: { ideal: 60 },
                    height: 720,
                    width: 1280
                }}
                height="360"
                width="640"
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

export const EditMediaPanel = () => {
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

            <div className="flex flex-wrap gap-4">
                <PostMediaSlider mediaData={mediaData} onImageClick={(e, index) => setEditImage(index)} />
            </div>
        </div>
    );
};

interface PostSharePanelProps {
    onPostSuccess: (postId: number) => void;
}

export const PostSharePanel: React.FC<PostSharePanelProps> = ({ onPostSuccess }) => {
    const [posting, setPosting] = useState<{
        loading: boolean;
        error: string | null;
    }>({ loading: false, error: null });

    const errorDiv = useRef<HTMLDivElement>(null);

    const { mediaData, setStep, taggedData } = useCreatePost();

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
            const response = await addPost(mediaList, data.caption, data.location, associateCars);
            if (!response || response.error) {
                throw new Error(response.error);
            }

            setPosting({ loading: false, error: null });
            onPostSuccess(response.post_id);
        } catch (e: any) {
            setPosting({ loading: false, error: e.message });
            // // hide error after 5 seconds
            setTimeout(() => {
                setPosting({ loading: false, error: null });
            }, 5000);
        }
    };

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleFocus = () => {
        if (textAreaRef.current) {
            textAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <form className="relative h-full flex flex-col" action={handleShare}>
            <div className="flex flex-wrap gap-4">
                <PostMediaSlider mediaData={mediaData} />
            </div>
            <textarea placeholder="Write a caption..." className="p-2" name='caption' ref={textAreaRef} onFocus={handleFocus}></textarea>

            {posting.error && (
                <div className={`fixed z-10 w-full bottom-0 h-14 p-2 mt-2 text-center text-red-500 bg-red-100`} ref={errorDiv}>
                    {posting.error}
                </div>
            )}

            <div className="flex items-center flex-col my-3 w-full">
                <div className="flex items-center gap-2 px-3 border-1 py-3 w-full" onClick={() => {
                    setStep('tag');
                }}>
                    <IonIcon icon={personOutline} className='text-xl' />
                    <div className="flex items-center justify-between w-full">
                        <span>Tag Entities</span> {taggedData.length > 0 && (
                            <span className="text-xs">
                                {taggedData.length > 1 ? `${taggedData.length} entities` : taggedData[0].label}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 border-1 py-3 w-full" onClick={() => {
                    alert('Associate Car');
                }}>
                    <IonIcon icon={carOutline} className='text-xl' />
                    Associate Car
                </div>
            </div>


            <div className="flex fixed bottom-0 left-0 w-full gap-2">
                <Button
                    className='text-white w-full !rounded-none'
                    fullPageLoading
                >
                    Share
                </Button>
            </div>
        </form>
    );
};

export const PostTagPanel: React.FC = () => {
    const { mediaData, activeTagIndex, taggedData, setTaggedData } = useCreatePost();
    const [tagInput, setTagInput] = useState<{ x: number; y: number; visible: boolean, index: number; }>({ x: 0, y: 0, visible: false, index: 0 });
    const [currentTag, setCurrentTag] = useState('');
    const splideRef = useRef<Splide>(null);

    const { data, isFetching, isLoading, refetch } = useQuery<any[], Error>({
        queryKey: ["taggable-entities"],
        queryFn: () => {
            // console.log('Fetching taggable entities', currentTag);
            return fetchTaggableEntites(currentTag, taggedData);
        },
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: currentTag.trim().length > 3,
    });

    const tagCarousel: Options = {
        ...carouselOptions,
        start: activeTagIndex,
    };

    const onImageClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setTagInput({ x, y, visible: true, index });
    };

    const handleTagInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.trim().length === 0) {
            return;
        }

        if (event.target.value.trim().length < 4) {
            return;
        }

        try {
            await refetch({
                cancelRefetch: isFetching || isLoading,
            });
        } catch (e: any) {
            console.error('Error fetching taggable entities', e.message);
        }
    };

    const debouncedHandleTagInputChange = useCallback(debounce(handleTagInputChange, 500), []);

    const renderImageTags = (index: number) => {
        return taggedData.filter(tag => tag.index === index).map((tag, i) => (
            <TagEntity
                key={i} {...tag}
                onPositionChange={(x, y) => {
                    setTaggedData(taggedData.map((t, idx) => {
                        if (idx === i) {
                            return { ...t, x, y };
                        }
                        return t;
                    }));
                }}
            // onDragStart={() => {
            //     console.log('Drag start');
            //     splideRef.current!.splide.Components.Drag.disable(true);
            // }}
            // onDragEnd={() => {
            //     // splideRef.current!.splide.Components.Drag.disable(false);
            //     console.log('Drag end');
            // }}
            />
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

    return (
        <div className="relative h-full flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
                <div className="tag-input-container w-full px-2 relative">
                    <input
                        disabled={!tagInput.visible}
                        type="text"
                        placeholder='Tag someone...'
                        className="border p-1 rounded-md w-full px-2"
                        onChange={(e) => {
                            setCurrentTag(e.target.value);
                            debouncedHandleTagInputChange(e);
                        }}
                        onBlur={() => {
                            setTimeout(() => {
                                setCurrentTag('');
                                setTagInput({ x: 0, y: 0, visible: false, index: 0 });
                            }, 300);
                        }}
                        defaultValue={currentTag}
                        autoFocus
                    />

                    <div className="results absolute w-full z-50 left-0 px-2 bg-white">
                        {(isFetching || isLoading) && (
                            <div className="tag-suggestions max-h-36 overflow-scroll shadow-md w-full border">
                                <div className="tag-suggestion p-1 border-b flex items-center gap-2 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 "></div>
                                    <div className='w-32 h-4 bg-gray-200'></div>
                                </div>
                            </div>
                        )}

                        {/* if no data */}
                        {!isFetching && !isLoading && data && data.length === 0 && (
                            <div className="tag-suggestions max-h-36 overflow-scroll shadow-md w-full border">
                                <div className="tag-suggestion p-1 border-b">No results found</div>
                            </div>
                        )}

                        {(!(isFetching || isLoading) && (data && data.length > 0 && currentTag.length > 3)) && (
                            <div className="tag-suggestions max-h-44 overflow-scroll shadow-md w-full border">
                                {data.map((entity, idx) => (
                                    <div key={idx} className="tag-suggestion p-1 border-b flex items-center gap-2" onClick={() => {
                                        setCurrentTag('');
                                        setTaggedData([...taggedData, {
                                            x: tagInput.x,
                                            y: tagInput.y,
                                            index: tagInput.index,
                                            label: entity.name,
                                            type: entity.type,
                                            id: entity.entity_id,
                                        }]);
                                        setTagInput({ x: 0, y: 0, visible: false, index: 0 });
                                    }}>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2">
                                            <img src={entity.profile_image || PLACEHOLDER_PFP} alt={entity.name} className="w-full h-full rounded-full" />
                                        </div>
                                        <div>{entity.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <PostMediaSlider
                    ref={splideRef}
                    mediaData={mediaData}
                    onImageClick={onImageClick}
                    carouselSettings={tagCarousel}
                    showControls={false}
                    childRenderer={(index) => {
                        return (
                            <>
                                {renderImageTags(index)}

                                {tagInput.visible && tagInput.index === index && (
                                    <TagEntity
                                        x={tagInput.x}
                                        y={tagInput.y}
                                        label={"Who's this?"}
                                        index={index}
                                        type='user'
                                        id={0}
                                    // onPositionChange={(x, y) => {
                                    //     setTagInput({ x, y, visible: true, index });
                                    // }}
                                    />
                                )}
                            </>
                        );
                    }}

                    childOutSlide={(index) => (
                        <div className={clsx(
                            "w-fit mt-1 flex flex-col gap-1 max-w-sm",
                            taggedData.filter(tag => tag.index === index).length > 0 ? 'visible' : 'hidden'
                        )}>
                            <h3 className="text-black text-left mt-2">Tags</h3>
                            {renderImageTagsList(index)}
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

