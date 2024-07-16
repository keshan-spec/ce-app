'use client';
import { getGarageById } from "@/actions/garage-actions";
import { useUser } from "@/hooks/useUser";
import { Garage } from "@/types/garage";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { GaragePosts } from "./GaragePosts";
import { MiniPostSkeleton } from "../Sections/Feed";

interface GarageViewProps {
    garageId: string;
}

const formatOwnership = (ownedSince: string, ownedUntil: string | null) => {
    const ownedSinceDate = new Date(ownedSince);
    const ownedUntilDate = ownedUntil ? new Date(ownedUntil).getFullYear() : 'Present';

    return `Owned from ${ownedSinceDate.getFullYear()} - ${ownedUntilDate}`;
};

export const GarageView: React.FC<GarageViewProps> = ({
    garageId
}) => {
    const { user } = useUser();

    const { data, error, isLoading, isFetching } = useQuery<Garage | null, Error>({
        queryKey: ["view-garage", garageId],
        queryFn: () => getGarageById(garageId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    console.log(data);

    if (isLoading || isFetching) {
        return <GarageViewSkeleton />;
    }

    if (error || !data) {
        return <div>Error loading garage</div>;
    }

    return (
        <>
            <div className="vehicle-profile-background" style={{
                backgroundImage: `url(${data?.cover_photo})`,
            }}>
                <Link className="vehicle-profile-image"
                    href={`/profile/${data?.owner_id}`}
                    style={{
                        backgroundImage: `url(${data?.owner?.profile_image})`,
                    }}
                />
            </div>

            <div className="section mt-1 mb-2">
                <div className="profile-garage-intro text-center">
                    <h1 className="flex flex-col mb-1">
                        <>{data.colour} {data?.make} {data?.model}</>
                        {data.variant && (
                            <>
                                <small className="text-xs opacity-60 m-0 font-medium">{data.variant}</small>
                            </>
                        )}
                    </h1>

                    <p className="garage-owned-information">
                        {formatOwnership(data?.owned_since, data?.owned_until)}
                    </p>
                    <p className="garage-vehicle-description">
                        {data?.short_description}
                    </p>
                    {(user && user.id === data?.owner_id) && (
                        <div className="profile-link" data-location="profile-vehicle-edit.php">Edit Vehicle</div>
                    )}
                </div>
            </div>


            <GaragePosts garageId={garageId} />
        </>
    );
};

const GarageViewSkeleton: React.FC = () => {
    return (
        <>
            <div className="vehicle-profile-background animate-pulse bg-gray-200">
                <div className="vehicle-profile-image bg-gray-300"></div>
            </div>

            <div className="section mt-1 mb-2">
                <div className="flex flex-col items-center text-center">
                    <div className="animate-pulse w-full h-8 bg-gray-300 rounded-lg mb-1"></div>
                    <div className="animate-pulse w-1/2 h-4 bg-gray-300 rounded-lg mb-1"></div>
                    <div className="animate-pulse w-1/3 h-4 bg-gray-300 rounded-lg mb-1"></div>
                    <div className="animate-pulse w-1/3 h-4 bg-gray-300 rounded-lg mb-1"></div>
                </div>
            </div>

            <div className="section full">
                <div className="wide-block transparent p-0">
                    <ul className="nav nav-tabs lined iconed" role="tablist">
                        <li className="nav-item">
                            <div className="nav-link">
                                <div className="animate-pulse w-1/2 h-4 bg-gray-300 rounded-lg mb-1"></div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link">
                                <div className="animate-pulse w-1/2 h-4 bg-gray-300 rounded-lg mb-1"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <MiniPostSkeleton />
        </>
    );
};