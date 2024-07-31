'use client';
import { IonIcon } from '@ionic/react';
import { camera, closeOutline, images, recording, swapVertical, videocam, personOutline, carOutline, cameraReverse, cameraSharp, closeCircleOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/shared/Button';
import { Options } from '@splidejs/splide';
import { Splide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { addPost, fetchTaggableEntites, fetchTagsForPost, PostTag, updatePost } from '@/actions/post-actions';

import Modal from '@/shared/Modal';
import ImageCropModal from './ImageCrop';
import { ImageMeta, useCreatePost } from '@/app/context/CreatePostContext';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { debounce } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { TagEntity } from '../TagEntity/TagEntity';
import PostMediaSlider from './PostMediaSlider';
import { useEditPost } from '@/app/context/EditPostProvider';
import { BiLoader } from 'react-icons/bi';
import SlideInFromBottomToTop from '@/shared/SlideIn';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Loader } from '../Loader';

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

    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

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
                allowFullScreen={true}
                autoFocus={true}
                videoConstraints={{
                    facingMode,
                    height: 720,
                    width: 1280
                }}
            />

            <div className="absolute bottom-10 left-1/2 transform px-4 -translate-x-1/2 h-24 w-full rounded-lg backdrop-blur-xl flex justify-between items-center">
                <button
                    onClick={() => document.getElementById('galleryInput')?.click()}
                    className="flex flex-col items-center gap-1 text-white py-2">
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
                <button onClick={switchMode} className="flex flex-col items-center gap-1 text-white py-2">
                    <IonIcon icon={swapVertical} />
                    Switch
                </button>
                <button onClick={() => {
                    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
                }} className="flex flex-col items-center gap-1 text-white py-2">
                    <IonIcon icon={facingMode === 'user' ? cameraReverse : cameraSharp} />
                    {facingMode === 'user' ? 'Front' : 'Back'}
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
                {/* <PostMediaSlider mediaData={mediaData} onImageClick={(e, index) => setEditImage(index)} /> */}
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

    const getTaggedEntities = (type: 'user' | 'car') => {
        return taggedData.filter(tag => tag.type === type).map(tag => tag);
    };

    const taggedUsers = useMemo(() => getTaggedEntities('user'), [taggedData]);
    const taggedCars = useMemo(() => getTaggedEntities('car'), [taggedData]);

    return (
        <form className="relative h-full flex flex-col" action={handleShare}>
            <div className="flex flex-wrap gap-4">
                {/* <PostMediaSlider mediaData={mediaData} /> */}
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
                        <span>Tag Entities</span> {taggedUsers.length > 0 && (
                            <span className="text-xs">
                                {taggedUsers.length > 1 ? `${taggedUsers.length} entities` : taggedUsers[0].label}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 border-1 py-3 w-full" onClick={() => {
                    setStep('associate-car');
                }}>
                    <IonIcon icon={carOutline} className='text-xl' />
                    <div className="flex items-center justify-between w-full">
                        <span>Associated Cars</span> {taggedCars.length > 0 && (
                            <span className="text-xs">
                                {taggedCars.length > 1 ? `${taggedCars.length} entities` : taggedCars[0].label}
                            </span>
                        )}
                    </div>
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
    const { mediaData, activeTagIndex, taggedData, setTaggedData, step } = useCreatePost();
    const [tagInput, setTagInput] = useState<{ x: number; y: number; visible: boolean, index: number; }>({ x: 0, y: 0, visible: false, index: 0 });
    const [currentTag, setCurrentTag] = useState('');
    const splideRef = useRef<Splide>(null);

    const { data, isFetching, isLoading, refetch } = useQuery<any[], Error>({
        queryKey: ["taggable-entities"],
        queryFn: () => {
            return fetchTaggableEntites(currentTag, taggedData, step === 'associate-car');
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
                                            <img src={entity.image || PLACEHOLDER_PFP} alt={entity.name} className="w-full h-full rounded-full" />
                                        </div>
                                        <div>{entity.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* <PostMediaSlider
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
                /> */}
            </div>
        </div>
    );
};

const PostEditTagPanel: React.FC<{
    taggedData: PostTag[];
    step: 'car' | 'user' | 'event' | 'venue';
    onTaggedDataChange: (data: PostTag) => void;
}> = ({
    onTaggedDataChange,
    taggedData,
    step,
}) => {
        const [currentTag, setCurrentTag] = useState('');
        const { data, isFetching, isLoading, refetch } = useQuery<any[], Error>({
            queryKey: ["taggable-entities"],
            queryFn: () => fetchTaggableEntites(currentTag, taggedData, step === 'car'),
            retry: 0,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            enabled: currentTag.trim().length > 3,
        });


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

        return (
            <div className="relative h-full flex flex-col gap-4 w-full">
                <div className="flex flex-wrap gap-4">
                    <div className="tag-input-container w-full px-2 relative">
                        <input
                            type="text"
                            placeholder={`Tag a ${step}...`}
                            className="border p-1 rounded-md w-full px-2"
                            onChange={(e) => {
                                setCurrentTag(e.target.value);
                                debouncedHandleTagInputChange(e);
                            }}
                            defaultValue={currentTag}
                            autoFocus
                        />
                    </div>

                    <div className="results absolute w-full z-50 left-0 px-2 bg-white top-12">
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
                                        onTaggedDataChange({
                                            entity_id: entity.entity_id,
                                            type: entity.type,
                                            media_id: 0,
                                            x: 0,
                                            y: 0,
                                            entity: {
                                                id: entity.entity_id,
                                                name: entity.name,
                                            },
                                        });
                                        console.log(entity);
                                    }}>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2">
                                            <img src={entity.image || PLACEHOLDER_PFP} alt={entity.name} className="w-full h-full rounded-full" />
                                        </div>
                                        <div>{entity.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

const editPostSchema = z.object({
    caption: z.string().optional(),
    location: z.string().optional(),
});

type EditPostData = z.infer<typeof editPostSchema>;

export const PostEditSharePanel: React.FC<PostSharePanelProps> = ({ onPostSuccess }) => {
    const errorDiv = useRef<HTMLDivElement>(null);

    const { post, loading, error } = useEditPost();
    const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting, isSubmitSuccessful, isDirty, dirtyFields } } = useForm<EditPostData>({
        resolver: zodResolver(editPostSchema),
        defaultValues: {
            caption: post?.caption,
        }
    });

    const [addTags, setAddTags] = useState<'user' | 'car' | 'event' | 'venue' | null>(null);
    const [tags, setTags] = useState<PostTag[]>([]);
    const [removedTags, setRemovedTags] = useState<number[]>([]);
    const [updatedTags, setUpdatedTags] = useState<PostTag[]>([]);

    const onTagChanged = (tag: PostTag) => {
        setUpdatedTags([...updatedTags, {
            ...tag,
            media_id: post?.media[0].id || 0,
        }]);
        setAddTags(null);
    };

    const handleShare: SubmitHandler<EditPostData> = async (data) => {
        if (!post || !post.id) return;

        try {
            const response = await updatePost({
                caption: data.caption,
                location: data.location,
                new_tags: updatedTags,
                removed_tags: removedTags,
                post_id: post.id,
            });

            console.log(response);
            if (!response || response.error) {
                throw new Error(response.error);
            }
            // onPostSuccess(response.post_id);
        } catch (e: any) {
            setError('root', { message: e.message });
        }
    };

    const getTaggedEntities = (type: 'user' | 'car') => {
        const mergedTags = [...tags, ...updatedTags];

        return mergedTags.filter(tag => tag.type === type && !removedTags.includes(tag.entity_id)).map(tag => tag);
    };

    const removeTag = (entityId: number) => {
        const foundTag = tags.find(tag => tag.entity_id === entityId);

        if (foundTag) {
            setRemovedTags([...removedTags, entityId]);
        } else {
            console.log('Removing from updated tags', entityId);

            setUpdatedTags([...updatedTags.filter(tag => tag.entity_id !== entityId)]);
        }
    };

    const fetchTags = async () => {
        if (!post) return;

        const data = await fetchTagsForPost(post.id);
        if (data) {
            setTags(data);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [post]);

    const taggedUsers = useMemo(() => getTaggedEntities('user'), [tags, updatedTags, removedTags]);
    const taggedCars = useMemo(() => getTaggedEntities('car'), [tags, updatedTags, removedTags]);

    return (
        <>
            <SlideInFromBottomToTop isOpen={addTags !== null} onClose={() => setAddTags(null)} title='Add Tags' height={'80%'}>
                <PostEditTagPanel onTaggedDataChange={onTagChanged} taggedData={[...tags, ...updatedTags]} step={addTags!} />
            </SlideInFromBottomToTop>
            {isSubmitting && <Loader transulcent />}

            <div id="toast-16" className={clsx(
                "toast-box toast-top",
                { "bg-success": isSubmitSuccessful },
                { "bg-danger": errors.root },
                { "show": isSubmitSuccessful || errors.root }
            )}>
                <div className="in">
                    <div className="text">
                        {errors.root && errors.root.message}
                        {isSubmitSuccessful && "Post updated successfully"}
                    </div>
                </div>
                <button type="button" className="btn btn-sm btn-text-light close-button"
                    onClick={() => {
                        if (isSubmitSuccessful) {
                            onPostSuccess(post?.id!);
                        } else {
                            clearErrors();
                        }
                    }}
                >OK</button>
            </div>

            <form className="relative flex flex-col h-screen" onSubmit={handleSubmit(handleShare)}>
                <div className="flex flex-wrap gap-4">
                    <PostMediaSlider mediaData={post?.media || []} />
                </div>

                <textarea
                    placeholder="Write a caption..."
                    className="p-2 h-auto"
                    rows={3}
                    {...register('caption')}
                />

                <div className="section full mb-2">
                    <ul className="listview link-listview mb-2">
                        <TagSection
                            title='Tag Users'
                            tags={taggedUsers}
                            loading={loading}
                            onAdd={() => setAddTags('user')}
                            onRemove={removeTag}
                        />

                        <TagSection
                            title='Tag Vehicle Registrations'
                            tags={taggedCars}
                            loading={loading}
                            onAdd={() => setAddTags('car')}
                            onRemove={removeTag}
                        />

                        <TagSection
                            title='Tag Events'
                            tags={[]}
                            loading={loading}
                            onAdd={() => { }}
                            onRemove={() => { }}
                        />

                        <TagSection
                            title='Tag Venues'
                            tags={[]}
                            loading={loading}
                            onAdd={() => { }}
                            onRemove={() => { }}
                        />
                    </ul>
                </div>

                <div className="fixed bottom-2 px-2 w-full z-[999]">
                    <button className='btn btn-primary btn-block btn-lg'>
                        Update
                    </button>
                </div>
            </form>
        </>
    );
};

interface TagSectionProps {
    title: string;
    tags: PostTag[];
    loading: boolean;
    onAdd: () => void;
    onRemove: (entityId: number) => void;
}

const TagSection: React.FC<TagSectionProps> = ({ title, tags, loading, onAdd, onRemove }) => (
    <li className="multi-level" key={title}>
        <Link href={'#'} className="item">
            {title} <span className={clsx("badge", tags.length === 0 ? 'badge-primary-zero' : 'badge-primary')}>
                {tags.length}
                {loading && <BiLoader className="animate-spin" />}
            </span>
        </Link >
        <ul className="listview simple-listview" style={{ height: 0 }}>
            <li>
                <button type='button' className="btn btn-primary btn-block btn-sm" onClick={onAdd}>+ Add</button>
            </li>
            {tags.map((tag, i) => (
                <li key={i}>
                    {tag.entity.name}
                    <IonIcon icon={closeCircleOutline} role="img" className="md hydrated" onClick={() => onRemove(tag.entity_id)} />
                </li>
            ))}
        </ul>
    </li>
);