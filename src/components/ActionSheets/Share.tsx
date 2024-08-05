"use client";
import { BiShareAlt } from 'react-icons/bi';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoTwitter, logoWhatsapp, closeOutline, logoInstagram, copyOutline, shareSocialOutline } from 'ionicons/icons';
import { memo, useEffect, useState } from 'react';

interface ShareProps {
    shareImage: string;
    shareTags?: string[];
    shareText: string;
    shareTitle: string;
    shareUri: string;
    id: string | number;
}

const NativeShare: React.FC<ShareProps> = ({
    shareImage,
    shareTags,
    shareText,
    shareTitle,
    shareUri,
    id,
}) => {
    const [shareUrl, setShareUrl] = useState<string>('');

    useEffect(() => {
        try {
            const siteUrl = window.location.origin;

            const url = new URL(`${siteUrl}${shareUri}`);
            if (shareTags) {
                url.searchParams.append('tags', shareTags.join(','));
            }
            setShareUrl(url.toString());
        } catch (error) {
            console.error('Error setting share URL', error);
        }

        return () => {
            setShareUrl('');
        };
    }, [shareUri, shareTags]);

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    const shareToWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText)}%0a${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const shareToIgStory = () => {
        const url = `instagram-stories://share?backgroundImage=${encodeURIComponent(shareImage)}&sticker=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fab-button animate dropdown">
            <span data-bs-toggle="offcanvas" data-bs-target={`#actionSheetCreate_${id}`}>
                <IonIcon icon={shareSocialOutline} role="img" className="md hydrated" aria-label="chatbox ellipses sharp" />
            </span>
            <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`actionSheetCreate_${id}`} style={{
                // visibility: 'visible',
            }} aria-modal="true" role="dialog">
                <div className="offcanvas-body">
                    <ul className="action-button-list">
                        {/* copy url */}
                        <li>
                            <button className="btn btn-list" onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                            }} data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={copyOutline} role="img" className="md hydrated" aria-label="copy outline" />
                                    Copy URL
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-list" onClick={shareToIgStory} data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={logoInstagram} role="img" className="md hydrated" aria-label="share outline" />
                                    Instagram
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-list" onClick={shareToFacebook} data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={logoFacebook} role="img" className="md hydrated" aria-label="share outline" />
                                    Facebook
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-list" onClick={shareToTwitter} data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={logoTwitter} role="img" className="md hydrated" aria-label="share outline" />
                                    Twitter
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-list" onClick={shareToWhatsApp} data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={logoWhatsapp} role="img" className="md hydrated" aria-label="share outline" />
                                    WhatsApp
                                </span>
                            </button>
                        </li>
                        <li className="action-divider"></li>
                        <li>
                            <button className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
                                <span>
                                    <IonIcon icon={closeOutline} role="img" className="md hydrated" aria-label="close outline" />
                                    Close
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default memo(NativeShare);