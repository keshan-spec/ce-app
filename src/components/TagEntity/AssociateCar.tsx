'use client';

import { PostTag } from "@/actions/post-actions";
import { Post } from "@/types/posts";
import clsx from "clsx";
import Link from "next/link";
import { useCallback, useMemo } from "react";

interface AssociatedCarProps {
    tags: PostTag[];
    post: Post;
    index: number;
}

const AssociatedCar: React.FC<AssociatedCarProps> = ({
    post,
    tags,
    index
}) => {
    const filteredTags = useMemo(() => {
        return tags.filter(tag => tag.type === 'car');
    }, [tags, post]);

    return (
        <div className="offcanvas offcanvas-bottom action-sheet rounded-t-lg" tabIndex={-1} id={`post-assoctiated-cars-${post.id}`}
            style={{
                visibility: 'visible',
            }} aria-modal="true" role="dialog">
            <div className="offcanvas-body">
                <ul className="listview image-listview media transparent flush pt-1">
                    {filteredTags.map((vehicle) => (
                        <li key={vehicle.entity_id} className={
                            clsx(
                                vehicle.media_id !== post.media[index].id && '!hidden',
                            )}>
                            <Link prefetch={true} href={`/profile/garage/${vehicle.entity_id}`} className="item">
                                <div className="imageWrapper">
                                    <img src={vehicle.entity.image} alt="image" className="max-w-24 mr-3 object-contain h-full" />
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                    <div>
                                        {vehicle.entity.name}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        Owned by {vehicle.entity.owner?.name}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    <li className="action-divider"></li>
                    <li>
                        <button className="btn btn-list text-danger" data-bs-dismiss="offcanvas">
                            <span>Close</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AssociatedCar;