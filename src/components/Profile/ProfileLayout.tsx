'use client';
import { Button } from '@/shared/Button';
import { Tabs } from './Tabs';
import { useUser } from '@/hooks/useUser';
import { NoAuthWall } from '../Protected/NoAuthWall';
import { getUserDetails } from '@/actions/auth-actions';
import { UserNotFound } from './UserNotFound';
import { UserProfileSkeleton } from './UserProfileSkeleton';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { addUserProfileLinks, maybeFollowUser } from '@/actions/profile-actions';
import { redirect } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PopUp from '@/shared/Dialog';
import { ProfileLinksExternal } from './ProfileLinks';

interface ProfileLayoutProps {
    profileId?: string;
    currentUser: boolean;
}

const getUser = (profileId: string | undefined) => {
    const { user, isLoggedIn } = useUser();

    if (!profileId) {
        return {
            isLoggedIn,
            user,
            canEditProfile: true,
        };
    }

    if (profileId && user?.id === profileId) {
        return {
            isLoggedIn,
            user,
            canEditProfile: true,
        };
    }

    // 59899
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUserDetails(profileId),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
    });

    return {
        isLoggedIn,
        user: data?.user,
        sessionUser: user,
        isFetching,
        refetch,
        canEditProfile: false,
    };
};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    currentUser,
    profileId
}) => {
    const { user, isLoggedIn, isFetching, sessionUser, refetch, canEditProfile } = getUser(profileId);

    const [isLinkOpen, setIsLinkOpen] = useState<'instagram' | 'tiktok' | 'facebook' | 'email' | null>(null);

    const handleFollowClick = async () => {
        if (!profileId) return;

        if (!isLoggedIn) {
            redirect(`/login?callbackUrl=${encodeURIComponent(`/profile/${profileId}`)}`);
        }

        try {
            const response = await maybeFollowUser(profileId);
            refetch?.();
        } catch (error) {
            console.error(error);
        }
    };

    const onLinkAdd = async (data: FormData) => {
        if (!isLinkOpen) return;
        try {
            const response = await addUserProfileLinks({
                type: isLinkOpen,
                link: data.get('link') as string
            });

            if (response) {
                refetch?.();
                setIsLinkOpen(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLinkClick = (type: 'instagram' | 'tiktok' | 'facebook' | 'email') => {
        if (!canEditProfile) return;

        if (isLoggedIn && user?.id) {
            setIsLinkOpen(type);
        }
    };

    const renderFollowBtn = useMemo(() => {
        let text: string = "Follow";
        let icon: string = "fas fa-plus";

        if (!sessionUser || !isLoggedIn) {
            return null;
        } else {
            if (user && user.followers.includes(sessionUser.id)) {
                text = "Unfollow";
                icon = "fas fa-minus";
            };
        }

        return (
            <Button className="w-full profile-link capitalize" onClick={handleFollowClick}>
                <i className={`${icon} mr-2`}></i> {text}
            </Button>
        );
    }, [user?.id, user?.followers]);

    const linkInputplaceHolder = useMemo(() => {
        switch (isLinkOpen) {
            case 'instagram':
                return 'Your Instagram username';
            case 'tiktok':
                return 'Your TikTok username';
            case 'facebook':
                return 'Your Facebook username';
            case 'email':
                return 'Your Email address';
            default:
                return '';
        }
    }, [isLinkOpen]);

    if (!isLoggedIn && currentUser) {
        return <NoAuthWall redirectTo="/profile" />;
    }

    if (!currentUser && !profileId) {
        return <NoAuthWall redirectTo="/profile" />;
    }

    if (isFetching) {
        return <UserProfileSkeleton />;
    }

    if (!user) {
        return <UserNotFound />;
    }

    return (
        <>
            <PopUp isOpen={isLinkOpen ? true : false} onClose={() => setIsLinkOpen(null)} title='Add Link'>
                <form className="flex flex-col gap-2 p-4" action={onLinkAdd}>
                    <input type={isLinkOpen === 'email' ? 'email' : 'text'} placeholder={linkInputplaceHolder} name='link' className='p-1 border border-gray-300 rounded' />
                    <Button type='submit' className="w-full">Add Link</Button>
                </form>
            </PopUp>

            <div className="section !p-0 relative" style={{
                backgroundImage: "url(https://www.motortrend.com/uploads/2023/08/008-2024-Ford-Mustang-GT-Premium-Performance-pack-front-three-quarters.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <div className="flex flex-col items-center justify-center min-h-56 z-20 relative">
                    <div className="avatar mt-10">
                        <img src={user.profile_image || PLACEHOLDER_PFP}
                            alt="avatar" className="max-w-28 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex flex-col items-center mt-2 gap-y-1">
                        <h3 className="text-md mb-0">@{user.username}</h3>
                        <h5 className="subtext opacity-65">{user.first_name} {user.last_name}</h5>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-transparent to-white h-72 w-full absolute bottom-0" />
            </div>

            <div className="section full hidden">
                <div className="profile-stats !justify-center gap-4 ps-2 pe-2">
                    <a href="#" className="item">
                        <strong>{user.posts_count}</strong>posts
                    </a>
                    <a href="#" className="item">
                        <strong>{user.followers?.length}</strong>followers
                    </a>
                    <a href="#" className="item">
                        <strong>{user.following?.length}</strong>following
                    </a>
                </div>
            </div>

            <div className="section mb-2">
                <div className="profile-links">
                    {profileId && renderFollowBtn}

                    {(isLoggedIn && canEditProfile) && (
                        <Button className="w-full profile-link capitalize" onClick={() => {
                            alert('Edit Profile');
                        }}>
                            Edit Profile
                        </Button>
                    )}

                    <ProfileLinksExternal profileLinks={user.profile_links} isOwner={canEditProfile} />

                    <div className="mt-4 bio hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at magna porttitor lorem mollis
                        ornare. Fusce varius varius massa.
                    </div>
                </div>
            </div>

            <Tabs profileId={profileId || user.id} />
        </>
    );
};