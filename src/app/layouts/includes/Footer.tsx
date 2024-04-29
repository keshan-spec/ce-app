import { IonIcon } from "@ionic/react";
import { homeOutline, searchOutline, carSport, idCardOutline, personCircleOutline } from "ionicons/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="appBottomMenu">
            <Link href="/" className={`item ${pathname == '/' ? 'active' : ''}`}>
                <div className="col">
                    <IonIcon icon={homeOutline} />
                    <strong>Home</strong>
                </div>
            </Link>

            <Link href="/discover" className={`item ${pathname == '/discover' ? 'active' : ''}`}>
                <div className="col">
                    <IonIcon icon={searchOutline} />
                    <strong>Discover</strong>
                </div>
            </Link>
            <Link href="/garage" className={`item ${pathname == '/garage' ? 'active' : ''}`}>
                <div className="col">
                    <IonIcon icon={carSport} />
                    <strong>Garage</strong>
                </div>
            </Link>
            <Link href="/posts" className={`item ${pathname == '/posts' ? 'active' : ''}`}>
                <div className="col">
                    <IonIcon icon={idCardOutline} />
                    <strong>Social</strong>
                </div>
            </Link>

            <Link href="/profile" className={`item ${pathname == '/profile' ? 'active' : ''}`}>
                <div className="col">
                    <IonIcon icon={personCircleOutline} />
                    <strong>Profile</strong>
                </div>
            </Link>
        </div>
    );
};