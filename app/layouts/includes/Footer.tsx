import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="appBottomMenu">
            <Link href="/" className={`item ${pathname == '/' ? 'active' : ''}`}>
                <div className="col">
                    <ion-icon name="home-outline"></ion-icon>
                    <strong>Home</strong>
                </div>
            </Link>

            <Link href="/discover" className={`item ${pathname == '/discover' ? 'active' : ''}`}>
                <div className="col">
                    <ion-icon name="search-outline"></ion-icon>
                    <strong>Discover</strong>
                </div>
            </Link>
            <Link href="/garage" className={`item ${pathname == '/garage' ? 'active' : ''}`}>
                <div className="col">
                    <ion-icon name="car-sport"></ion-icon>
                    <strong>Garage</strong>
                </div>
            </Link>
            <Link href="/posts" className={`item ${pathname == '/posts' ? 'active' : ''}`}>
                <div className="col">
                    <ion-icon name="id-card-outline"></ion-icon>
                    <strong>Social</strong>
                </div>
            </Link>

            <Link href="/profile" className={`item ${pathname == '/profile' ? 'active' : ''}`}>
                <div className="col">
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <strong>Profile</strong>
                </div>
            </Link>
        </div>
    );
};