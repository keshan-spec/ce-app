import React, { createContext, useState, ReactNode, useContext, useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { vibrateDevice } from '@/utils/nativeFeel';
import { Area } from 'react-easy-crop';
import { EditMediaPanel, PostInitialPanel, PostSharePanel, PostTagPanel } from '@/components/CreatePost/CreatePost';
import { addTagsForPost } from '@/actions/post-actions';

export type ImageMeta = {
    width: number;
    height: number;
    mime?: string;
    alt?: string;
    data: string;
    type: 'image' | 'video';
}[];

export interface Tag {
    x: number;
    y: number;
    label: string;
    index: number;
    type: 'car' | 'user' | 'event';
    id: number;
}

type Step = 'initial' | 'edit' | 'share' | 'tag' | 'associate-car';

interface CreatePostContextType {
    media: string[];
    mediaData: string[];
    step: Step;
    error: string;
    capturing: boolean;
    isVideoMode: boolean;
    setStep: (step: Step) => void;
    setError: (error: string) => void;

    // Image capture
    handleMediaChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    captureImage: () => void;
    switchMode: () => void;
    updateImage: (index: number, croppedArea: Area) => void;
    setEditImage: (index: number | null) => void;

    webcamRef: React.RefObject<Webcam>;
    editImage: number | null;
    setActiveTagIndex: React.Dispatch<React.SetStateAction<number>>;
    activeTagIndex: number;

    taggedData: Tag[];
    setTaggedData: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

const CreatePostProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [mediaData, setMediaData] = useState<string[]>([]);
    const [media, setMedia] = useState<string[]>([]);

    const [step, setStep] = useState<Step>('initial');
    const [error, setError] = useState<string>('');

    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder>();

    const [isVideoMode, setIsVideoMode] = useState<boolean>(true); // Initially, video mode is enabled
    const [selectedMedia, setSelectedMedia] = useState<(string | null)[]>([]);
    const [editImage, setEditImage] = useState<number | null>(null);

    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number>(0);

    const [taggedData, setTaggedData] = useState<Tag[]>([]);



    useEffect(() => {
        if (step === 'initial') {
            setSelectedMedia([]);
            setMedia([]);
            setMediaData([]);
            setTaggedData([]);
            setActiveTagIndex(0);
        }
    }, [step]);


    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.removeEventListener("dataavailable", handleDataAvailable);
            }

            setCapturing(false);
            setRecordedChunks([]);
        };
    }, []);

    useEffect(() => {
        const media = selectedMedia.filter(media => media !== null) as string[];
        media.push(...recordedChunks.map(chunk => URL.createObjectURL(chunk)));

        setMedia(media);
        setMediaData(media);
    }, [selectedMedia, recordedChunks]);

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
                setStep('edit');
            }
        }
    };

    const captureImage = useCallback(() => {
        if (isVideoMode) {
            if (capturing) {
                handleStopCaptureClick();
                setStep('edit');
            } else {
                handleStartCaptureClick();
            }
        } else {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setSelectedMedia(prevMedia => [...prevMedia, imageSrc]);
                setStep('edit');
            }
        }
    }, [webcamRef, capturing, isVideoMode]);

    const switchMode = useCallback(() => {
        vibrateDevice(100);
        setIsVideoMode(prevMode => !prevMode);
    }, []);

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

    return (
        <CreatePostContext.Provider
            value={{
                setTaggedData,
                taggedData,
                activeTagIndex,
                setActiveTagIndex,
                webcamRef,
                editImage,
                capturing,
                isVideoMode,
                media,
                mediaData,
                step,
                error,
                switchMode,
                captureImage,
                setEditImage,
                handleMediaChange,
                setStep,
                setError,
                updateImage,
            }}
        >
            {children}
        </CreatePostContext.Provider>
    );
};

const useCreatePost = () => {
    const context = useContext(CreatePostContext);

    if (context === undefined) {
        throw new Error('useCreatePost must be used within an CreatePostProvider');
    }
    return context;
};

const CreatePostSteps = ({
    closePanel
}: {
    closePanel: () => void;
}) => {
    const { step, webcamRef, taggedData } = useCreatePost();

    const addTags = async (post_id: number) => {
        if (taggedData.length === 0) {
            closePanel();
            return;
        }

        try {
            const response = await addTagsForPost(post_id, taggedData);
            if (!response || response.error) {
                console.error(response.error);
            }

            closePanel();
        } catch (e) {
            console.error(e);
        }
    };


    const renderStep = useCallback(() => {
        switch (step) {
            case 'initial':
            default:
                return <PostInitialPanel ref={webcamRef} />;
            case 'edit':
                return <EditMediaPanel />;
            case 'associate-car':
            case 'tag':
                return <PostTagPanel />;
            case 'share':
                return (
                    <PostSharePanel onPostSuccess={addTags} />
                );
        }
    }, [step]);

    return (
        <div className="relative w-full h-[94dvh]">
            {renderStep()}
        </div>
    );
};

export { CreatePostProvider, useCreatePost, CreatePostSteps };
