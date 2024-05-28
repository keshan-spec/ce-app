import { IonIcon } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTiktok, mailOutline } from "ionicons/icons";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    socialType: 'instagram' | 'tiktok' | 'facebook' | 'email';
    icon?: string;
    link?: string;
}

const socialIcons = {
    instagram: logoInstagram,
    tiktok: logoTiktok,
    facebook: logoFacebook,
    email: mailOutline
};

const socialLinks = {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    facebook: 'https://www.facebook.com/',
    email: 'mailto:'
};

export const SocialButton: React.FC<SocialButtonProps> = ({ children, icon, link, socialType, ...props }) => {
    const { className, onClick } = props;

    const handleLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (link) {
            const url = socialLinks[socialType] + link;
            if (url) {
                window.open(url, '_blank');
            }
        } else {
            onClick && onClick(e);
        }
    };

    return (
        <button
            className="profile-link social-link relative"
            onClick={handleLinkClick}
            data-location={`${socialLinks[socialType]}`}
            data-link="external">
            <IonIcon className="profile-icon hydrated" icon={socialIcons[socialType]} role="img" aria-label={`logo ${socialType}`} /> {children}
        </button>
    );

    return (
        <button
            {...props}
            onClick={handleLinkClick}
            className={`overflow-hidden relative uppercase w-full hover:bg-theme-secondary flex items-center justify-center text-white font-bold h-9 rounded focus:outline-none focus:shadow-outline bg-theme-dark ${className}`}
        >
            {icon && <i className={`${icon} mr-2 bg-theme-dark-100 px-3 w-fit max-w-10 text-center h-full flex items-center absolute left-0 rounded-sm`}></i>}
            {children}
        </button>
    );
};