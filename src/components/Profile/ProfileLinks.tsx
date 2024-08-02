'use client';
import { ProfileLinks } from "@/auth";
import { Button } from "@/shared/Button";
import { IonIcon } from "@ionic/react";
import clsx from "clsx";
import { closeOutline, linkOutline, logoFacebook, logoInstagram, logoTiktok, logoYoutube, mailOutline } from "ionicons/icons";
import { useState } from "react";

interface ProfileLinksProps {
    profileLinks: ProfileLinks;
    isOwner?: boolean;
}

const socialLinks = {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/@',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
};

export const ProfileLinksExternal: React.FC<ProfileLinksProps> = ({
    profileLinks,
}) => {
    const externalLinks = profileLinks.external_links || [];

    const handleSocialLinkClick = (type: 'instagram' | 'tiktok' | 'facebook' | 'youtube') => {
        if (!profileLinks[type]) return;

        const url = socialLinks[type] + profileLinks[type];

        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="profile-links-external flex">
            {profileLinks.instagram && (
                <div className={clsx(
                    "profile-link social-link",
                    !profileLinks.instagram && 'opacity-70'
                )}
                    onClick={() => {
                        handleSocialLinkClick('instagram');
                    }}>
                    <IonIcon icon={logoInstagram} className="profile-icon md hydrated" role="img" aria-label="logo instagram" />
                    <span>Instagram</span>
                </div>
            )}
            {profileLinks.facebook && (
                <div className={clsx(
                    "profile-link social-link",
                    !profileLinks.facebook && 'opacity-70'
                )}
                    onClick={() => {
                        handleSocialLinkClick('facebook');
                    }}>
                    <IonIcon icon={logoFacebook} className="profile-icon md hydrated" role="img" aria-label="logo facebook" />

                    <span>Facebook</span>
                </div>
            )}

            {profileLinks.tiktok && (
                <div className={clsx(
                    "profile-link social-link",
                    !profileLinks.tiktok && 'opacity-70'
                )}
                    onClick={() => {
                        handleSocialLinkClick('tiktok');
                    }}>
                    <IonIcon icon={logoTiktok} className="profile-icon md hydrated" role="img" aria-label="logo tiktok" />

                    <span>Tiktok</span>
                </div>
            )}

            {profileLinks.youtube && (
                <div className={clsx(
                    "profile-link social-link",
                    !profileLinks.youtube && 'opacity-70'
                )}
                    onClick={() => {
                        handleSocialLinkClick('youtube');
                    }}>
                    <IonIcon icon={logoYoutube} className="profile-icon md hydrated" role="img" aria-label="mail outline" />
                    <span>Youtube</span>
                </div>
            )}

            {externalLinks.length > 0 && (
                <div className={clsx(
                    "profile-link social-link",
                    externalLinks.length === 0 && 'opacity-70'
                )} data-bs-toggle="offcanvas" data-bs-target="#moreLinks">
                    <IonIcon icon={linkOutline} className="profile-icon md hydrated" role="img" aria-label="link outline" />
                    <span>Links</span>
                </div>
            )}

            <div className="offcanvas offcanvas-bottom offcanvas-large action-sheet" tabIndex={-1} id="moreLinks">
                <div className="offcanvas-body">
                    <div className="comments-container">
                        <div className="comments-container-header" data-bs-dismiss="offcanvas">
                            <IonIcon icon={closeOutline} className="md hydrated" role="img" aria-label="close outline" />
                            <span>More Links</span>
                        </div>

                        {externalLinks?.length > 0 ? (
                            <ul className="listview simple-listview mb-2 border-top-0">
                                {externalLinks?.map(({
                                    id, link
                                }, i) => (
                                    <li className="pl-0 flex items-center" key={i}>
                                        <span className='font-medium'>{link.label}</span>
                                        <a href={link.url} target='_'>
                                            <IonIcon icon={linkOutline} role="img" className="text-lg" aria-label="link outline" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-4">No custom links added</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};


const AddLinkForm = ({ onLinkAdd }: {
    onLinkAdd: (link: {
        label: string;
        url: string;
    }) => void;
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);
    const [labelError, setLabelError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setLabelError(null);
        setLinkError(null);

        try {
            const link = formData.get('link') as string;
            const label = formData.get('label') as string;

            let hasErrors = false;

            if (!link) {
                setLinkError('Link is required');
                hasErrors = true;
            }

            if (!label) {
                setLabelError('Label is required');
                hasErrors = true;
            }

            // check if link is valid
            const url = new URL(link);
            if (!url) {
                setLinkError('Invalid URL');
                hasErrors = true;
            }

            if (hasErrors) {
                return;
            }

            setIsSubmitting(true);

            await onLinkAdd({
                label: label,
                url: link
            });

            setIsSubmitting(false);
        } catch (error: any) {
            setLinkError(error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-2 w-full" action={handleSubmit}>
            <input type="text" placeholder="What your link should be called" name='label' className={clsx(
                "p-1 border-1 rounded",
                labelError ? 'border-red-500' : 'border-gray-300'
            )} />
            {labelError && <div className="text-red-500 text-xs">{labelError}</div>}

            <input type="text" placeholder="Your Link" name='link' className={clsx(
                "p-1 border-1 rounded",
                linkError ? 'border-red-500' : 'border-gray-300'
            )} />
            {linkError && <div className="text-red-500 text-xs">{linkError}</div>}
            <Button type='submit' className="w-full" disabled={isSubmitting}>Add Link</Button>
        </form>
    );
};