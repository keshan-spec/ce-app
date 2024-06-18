'use client';
import { Button } from '@/shared/Button';
import { Tabs } from './Tabs';
import { useUser } from '@/hooks/useUser';
import { NoAuthWall } from '../Protected/NoAuthWall';
import { getUserDetails } from '@/actions/auth-actions';
import { UserNotFound } from './UserNotFound';
import { UserProfileSkeleton } from './UserProfileSkeleton';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { maybeFollowUser } from '@/actions/profile-actions';
import { redirect } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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

    const { data, isFetching, refetch } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUserDetails(profileId),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
        staleTime: 60 * 1000,
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
            <Button className="w-full profile-link capitalize" onClick={handleFollowClick}>
                <i className={`${icon} mr-2`}></i> {text}
            </Button>
        );
    }, [user]);

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
            <div className="profile-background"
                style={{
                    backgroundImage: "url(https://www.motortrend.com/uploads/2023/08/008-2024-Ford-Mustang-GT-Premium-Performance-pack-front-three-quarters.jpg)",
                }}
            />
            <div className="section mt-3">
                <div className="profile-head">
                    <div>
                        <img src={user.profile_image || PLACEHOLDER_PFP}
                            alt="avatar" className="profile-image" />
                    </div>
                    <div className="in">
                        <h3 className="name profile-username">@{user.username}</h3>
                        <h5 className="subtext profile-name">{user.first_name} {user.last_name}</h5>
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
                            <button className="profile-link"
                                onClick={() => {
                                    alert('Edit Profile');
                                }}>
                                Edit Profile
                            </button>

                            <button className="profile-link dark-bg" data-location="profile-edit.php">Edit Garage</button>
                        </div>
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