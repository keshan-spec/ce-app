import { AUTH_LANDING_PAGE, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { IonIcon } from "@ionic/react";
import Link from "next/link";
import { keyOutline } from 'ionicons/icons';
import { memo } from "react";
import dynamic from "next/dynamic";

const ThemeBtn = dynamic(() => import('@/shared/ThemeBtn'), { ssr: false });

interface NoAuthWallProps {
    redirectTo?: string;
}

const NoAuthWall: React.FC<NoAuthWallProps> = ({
    redirectTo = DEFAULT_LOGIN_REDIRECT
}) => {
    const encodedCallbackUrl = encodeURIComponent(redirectTo);

    return (
        <div className="flex flex-col items-center justify-center w-full h-[80vh]">
            <h2 className="text-2xl font-bold text-center w-full">
                Looks like you're not logged in. Please log in to view this page.
            </h2>

            <Link href={`${AUTH_LANDING_PAGE}?callbackUrl=${encodedCallbackUrl}`}>
                <ThemeBtn>
                    Log In <IonIcon icon={keyOutline} className="ml-1.5" />
                </ThemeBtn>
            </Link>
        </div>
    );
};

export default memo(NoAuthWall);