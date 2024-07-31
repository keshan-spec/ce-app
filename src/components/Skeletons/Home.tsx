import { PostCardSkeleton } from "../Posts/PostCardSkeleton";

const HomePageSkeleton: React.FC = () => {
    return (
        <div className="w-full h-full bg-white">
            <div className="fixed w-full social-tabs !mt-0 z-50">
                <ul className="nav nav-tabs capsuled" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#latest-posts" role="tab" aria-selected="false">
                            Latest
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#following-posts" role="tab" aria-selected="true">
                            Following
                        </a>
                    </li>
                </ul>
            </div>
            <div className="h-10"></div>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
        </div>
    );
};

export default HomePageSkeleton;