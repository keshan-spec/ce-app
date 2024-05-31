import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";

const Page = ({ searchParams }: {
    searchParams: {
        callbackUrl: string;
    };
}) => {
    return (
        <div className="app-landing-page !h-screen !w-screen bg-black">
            <div>
                <video className="video-background" autoPlay loop muted playsInline poster="">
                    <source src="/assets/video/video01.mp4" type="video/mp4" />
                </video>

                <div className="app-landing-page-container">
                    <img className="app-landing-page-logo" src="/assets/img/logo-large2.png?v=1.4" />
                </div>

                <div className="app-landing-page-buttons">
                    <Link href={`/auth/register?callbackUrl=${encodeURIComponent(searchParams.callbackUrl ?? DEFAULT_LOGIN_REDIRECT)}`} className="text-white">
                        <div data-location="/auth/register" className="btn btn-primary btn-lg btn-block">
                            Sign up
                        </div>
                    </Link>

                    <Link href={`/auth/login?callbackUrl=${encodeURIComponent(searchParams.callbackUrl ?? DEFAULT_LOGIN_REDIRECT)}`} className="text-black">
                        <div data-location="/auth/login" className="btn btn-primary btn-lg btn-block register">
                            Login
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;