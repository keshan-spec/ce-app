'use client';
import { useUser } from '@/hooks/useUser';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { maybeFollowUser } from '@/actions/profile-actions';
import { redirect } from 'next/navigation';
import React, { memo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProfileLinksExternal } from './ProfileLinks';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getUserDetails } from '@/api-functions/auth';

const Tabs = dynamic(() => import('@/components/Profile/Tabs'));
const ProfileEditPanel = dynamic(() => import('@/components/Profile/Settings/ProfileEditPanel'), { ssr: false });
const NoAuthWall = dynamic(() => import('@/components/Protected/NoAuthWall'), { ssr: false });
const UserProfileSkeleton = dynamic(() => import('@/components/Profile/UserProfileSkeleton'), { ssr: false });
const UserNotFound = dynamic(() => import('@/components/Profile/UserNotFound'), { ssr: false });

const NcImage = dynamic(() => import('@/components/Image/Image'));

interface ProfileLayoutProps {
    profileId?: string;
    currentUser?: boolean;
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

    const { data, isFetching, refetch } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUserDetails(profileId),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
        staleTime: 60 * 1000 * 10,
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

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    currentUser = true,
    profileId
}) => {
    const { user, isLoggedIn, isFetching, sessionUser, refetch, canEditProfile } = getUser(profileId);

    const handleFollowClick = async () => {
        if (!profileId) return;

        if (!isLoggedIn || !sessionUser) {
            redirect(`/login?callbackUrl=${encodeURIComponent(`/profile/${profileId}`)}`);
        }

        try {
            const response = await maybeFollowUser(profileId);

            if (response && response.success) {
                const followers = user?.followers;

                if (followers?.includes(sessionUser?.id)) {
                    user?.followers?.splice(followers.indexOf(sessionUser?.id), 1);
                } else {
                    user?.followers?.push(sessionUser?.id);
                }
            }
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    const renderFollowBtn = useCallback(() => {
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
            <button className="btn btn-primary btn-block btn-lg w-full profile-link capitalize" onClick={handleFollowClick}>
                <i className={`${icon} mr-2`}></i> {text}
            </button>
        );
    }, [user, sessionUser, isLoggedIn]);

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
            <div className="min-h-[120px]">
                <div className="profile-background"
                    style={{
                        backgroundImage: `url(${user.cover_image || "https://www.motortrend.com/uploads/2023/08/008-2024-Ford-Mustang-GT-Premium-Performance-pack-front-three-quarters.jpg"})`
                    }}
                />

                <div className="section mt-3">
                    <div className="profile-head">
                        <NcImage
                            src={user.profile_image || PLACEHOLDER_PFP}
                            alt="avatar"
                            className="profile-image object-cover overflow-hidden rounded-full"
                            containerClassName='profile-image object-cover overflow-hidden rounded-full'
                        />
                        <div className="in">
                            <h3 className="name profile-username">@{user.username}</h3>
                            <h5 className="subtext profile-name">{user.first_name} {user.last_name}</h5>
                        </div>
                    </div>
                </div>
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
                    {profileId && renderFollowBtn()}

                    {(isLoggedIn && canEditProfile) && (
                        <div className='flex gap-2'>
                            <div className="profile-link" data-bs-toggle="offcanvas" data-bs-target="#profileActions">Edit Profile</div>
                            <ProfileEditPanel />
                            <Link prefetch={true} href={'/garage'} className="profile-link dark-bg">Edit Garage</Link>
                        </div>
                    )}

                    <ProfileLinksExternal profileLinks={user.profile_links} isOwner={canEditProfile} />

                    <div className="mt-4 bio hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at magna porttitor lorem mollis
                        ornare. Fusce varius varius massa.
                    </div>
                </div>
            </div>

            <Tabs profileId={profileId || user.id} thirdPersionView={!currentUser} />
        </>
    );
};

export default memo(ProfileLayout);