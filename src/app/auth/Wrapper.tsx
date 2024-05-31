import { IonIcon } from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";

import Link from "next/link";

export const Wrapper = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const pathname = usePathname();

    return (
        <html lang="en">
            <body>
                <div className="appHeader no-border transparent position-absolute">
                    <div className="left">
                        <Link href="/auth" className="headerButton">
                            <IonIcon icon={chevronBackOutline} role="img" className="md hydrated" aria-label="chevron back outline" />
                        </Link>
                    </div>
                    <div className="pageTitle"></div>
                    <div className="right">
                        {pathname === "/auth/login" && (
                            <Link href="/auth/register" className="headerButton">
                                Sign up
                            </Link>
                        )}

                        {pathname === "/auth/register" && (
                            <Link href="/auth/login" className="headerButton">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {children}
            </body>
        </html>
    );
};