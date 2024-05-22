'use client';
import { Button } from '@/shared/Button';
import { Tabs } from './Tabs';
import { SocialButton } from '@/shared/SocialButton';
import { useUser } from '@/hooks/useUser';
import { NoAuthWall } from '../Protected/NoAuthWall';

interface ProfileLayoutProps {
    profileId?: string;
    currentUser: boolean;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    currentUser,
    profileId
}) => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn && currentUser) {
        return <NoAuthWall redirectTo="/profile" />;
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
                        <img src={user.profile_image} alt="avatar" className="max-w-28 rounded-full border-2 border-white" />
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
                        <strong>152</strong>posts
                    </a>
                    <a href="#" className="item">
                        <strong>27k</strong>followers
                    </a>
                    <a href="#" className="item">
                        <strong>506</strong>following
                    </a>
                </div>
            </div>

            <div className="section mt-1 mb-2">
                <div className="profile-info">
                    <div className="mt-3 flex flex-col gap-2 items-center w-full">
                        <Button className="w-full"><i className="fas fa-user-plus mr-2"></i> Follow</Button>
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