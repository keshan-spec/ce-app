'use client';
import Link from "next/link";

export const ProfileEditPanel: React.FC = () => {
    return (
        <div className="offcanvas offcanvas-bottom action-sheet" tabIndex={-1} id="profileActions" style={{ visibility: 'visible' }} aria-modal="true" role="dialog">
            <div className="offcanvas-body">

                <ul className="listview image-listview text flush pt-1">
                    <li>
                        <Link href="/profile/edit/images" className="item">
                            <div className="in">
                                <div>Profile Images</div>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/edit/social-links" className="item">
                            <div className="in">
                                <div>Social Links</div>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/edit/details" className="item">
                            <div className="in">
                                <div>My Details</div>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile/edit/username" className="item">
                            <div className="in">
                                <div>Change Username</div>
                            </div>
                        </Link>
                    </li>
                    <li className="action-divider"></li>
                    <li>
                        <a href="#" className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
                            <span>Close</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};