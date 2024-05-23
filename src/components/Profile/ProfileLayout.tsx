'use client';
import { Button } from '@/shared/Button';
import { Tabs } from './Tabs';
import { SocialButton } from '@/shared/SocialButton';
import { useUser } from '@/hooks/useUser';
import { NoAuthWall } from '../Protected/NoAuthWall';
import { getUserDetails } from '@/actions/auth-actions';
// import { useQuery } from 'react-query';
import { UserNotFound } from './UserNotFound';
import { UserProfileSkeleton } from './UserProfileSkeleton';
import { PLACEHOLDER_PFP } from '@/utils/nativeFeel';
import { maybeFollowUser } from '@/actions/profile-actions';
import { redirect } from 'next/navigation';
import { useMemo } from 'react';
import { AuthUser } from '@/auth';
import { useQuery } from '@tanstack/react-query';

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
        };
    }

    if (profileId && user?.id === profileId) {
        return {
            isLoggedIn,
            user,
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
        refetch
    };
};

export const DLayout = ({
    sessionUser,
    user,
    profileId
}: {
    user: AuthUser;
    sessionUser: AuthUser | null;
    profileId: string;
}) => {
    const handleFollowClick = async () => {
        if (!profileId) return;

        if (!sessionUser?.id) {
            redirect(`/login?callbackUrl=${encodeURIComponent(`/profile/${profileId}`)}`);
        }

        try {
            const response = await maybeFollowUser(profileId);
        } catch (error) {
            console.error(error);
        }
    };

    const renderFollowBtn = useMemo(() => {
        let text: string = "Follow";
        let icon: string = "fas fa-user-plus";

        if (!sessionUser || !sessionUser.id) {
            return null;
        } else {
            if (user && user.followers.includes(sessionUser.id)) {
                text = "Unfollow";
                icon = "fas fa-user-minus";
            };
        }

        return (
            <Button className="w-full" onClick={handleFollowClick}>
                <i className={`${icon} mr-2`}></i> {text}
            </Button>
        );
    }, [user?.id, user?.followers]);


    return (
        <>
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
                        <h5 className="subtext">{user.first_name} {user.last_name}</h5>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-transparent to-white h-60 w-full absolute -bottom-1" />
            </div>

            <div className="section full">
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

            <div className="section mt-1 mb-2">
                <div className="profile-info">
                    <div className="mt-3 flex flex-col gap-2 items-center w-full">
                        {renderFollowBtn}
                        <SocialButton icon="fab fa-instagram">Instagram</SocialButton>
                        <SocialButton icon="fab fa-facebook">Facebook</SocialButton>
                        <SocialButton icon="fab fa-tiktok">TikTok</SocialButton>
                        {/* email */}
                        <SocialButton icon="fas fa-envelope">Email</SocialButton>
                    </div>

                    <div className="mt-4 bio">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at magna porttitor lorem mollis
                        ornare. Fusce varius varius massa.
                    </div>
                </div>
            </div>

            <Tabs profileId={profileId || user.id} />
        </>
    );
};

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    currentUser,
    profileId
}) => {
    const { user, isLoggedIn, isFetching, sessionUser, refetch } = getUser(profileId);

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

    const renderFollowBtn = useMemo(() => {
        let text: string = "Follow";
        let icon: string = "fas fa-user-plus";

        if (!sessionUser || !isLoggedIn) {
            return null;
        } else {
            if (user && user.followers.includes(sessionUser.id)) {
                text = "Unfollow";
                icon = "fas fa-user-minus";
            };
        }

        return (
            <Button className="w-full" onClick={handleFollowClick}>
                <i className={`${icon} mr-2`}></i> {text}
            </Button>
        );
    }, [user?.id, user?.followers]);

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
                        <h5 className="subtext">{user.first_name} {user.last_name}</h5>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-transparent to-white h-60 w-full absolute -bottom-1" />
            </div>

            <div className="section full">
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

            <div className="section mt-1 mb-2">
                <div className="profile-info">
                    <div className="mt-3 flex flex-col gap-2 items-center w-full">
                        {profileId && renderFollowBtn}
                        <SocialButton icon="fab fa-instagram">Instagram</SocialButton>
                        <SocialButton icon="fab fa-facebook">Facebook</SocialButton>
                        <SocialButton icon="fab fa-tiktok">TikTok</SocialButton>
                        {/* email */}
                        <SocialButton icon="fas fa-envelope">Email</SocialButton>
                    </div>

                    <div className="mt-4 bio">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at magna porttitor lorem mollis
                        ornare. Fusce varius varius massa.
                    </div>
                </div>
            </div>

            <Tabs profileId={profileId || user.id} />
        </>
    );
};