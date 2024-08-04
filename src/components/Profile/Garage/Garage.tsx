'use client';
import { getUserGarage } from "@/api-functions/garage";
import { Garage as GarageType } from "@/types/garage";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { memo, useMemo } from "react";

const NcImage = dynamic(() => import("@/components/Image/Image"), { ssr: false });

interface GarageProps {
    profileId: string;
    edit?: boolean;
}

const Garage: React.FC<GarageProps> = ({
    profileId,
    edit = false
}) => {
    const { data, error, isLoading, isFetching } = useQuery<GarageType[] | null, Error>({
        queryKey: ["user-garage", profileId],
        queryFn: () => getUserGarage(profileId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    const garage = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                current: [],
                past: [],
            };
        }

        // split the garage data into current and past vehicles
        const current = data?.filter((garage) => garage.primary_car === true || !garage.owned_until);
        const past = data?.filter((garage) => garage.primary_car === false && garage.owned_until);

        return {
            current,
            past,
        };
    }, [data]);

    if (error instanceof Error) {
        return <p className="text-red-500">{error.message}</p>;
    }

    return (
        <div className="tab-pane fade show active min-h-screen" id="garage" role="tabpanel">
            <div className="listview-title garage-sub-title mt-2">Current Vehicles</div>
            <ul className="listview image-listview media transparent flush pt-1">
                {isLoading || isFetching ? <GarageItemSkeleton /> : null}

                {garage.current?.map((garage) => (
                    <li key={garage.id}>
                        <Link prefetch={true} href={edit ? `/garage/edit/${garage.id}` : `/profile/garage/${garage.id}`} className="item">
                            <div className="imageWrapper">
                                <NcImage
                                    src={garage.cover_photo} alt="image"
                                    className="max-w-24 max-h-10 mr-3 object-contain h-full w-full"
                                    imageDimension={{
                                        width: 80,
                                        height: 50,
                                    }}
                                />
                            </div>
                            <div className="in">
                                <div>
                                    {garage.make} {garage.model}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {(!isLoading && garage.current?.length === 0) && (
                <div className="text-center mt-2">No current vehicles</div>
            )}

            <div className="listview-title garage-sub-title mt-2">Past Vehicles</div>
            <ul className="listview image-listview media transparent flush pt-1">
                {isLoading || isFetching ? <GarageItemSkeleton /> : null}

                {garage.past?.map((garage) => (
                    <li key={garage.id}>
                        <Link prefetch={true} href={garage.status === 'deleted' ? '' : `/profile/garage/${garage.id}`} className={clsx(
                            "item",
                            garage.status === 'deleted' ? "opacity-50" : ""
                        )}>
                            <div className="imageWrapper">
                                <NcImage
                                    src={garage.cover_photo} alt="image"
                                    className="max-w-24 max-h-10 mr-3 object-contain h-full w-full"
                                    imageDimension={{
                                        width: 80,
                                        height: 50,
                                    }}
                                />
                            </div>
                            <div className="in">
                                <div>
                                    {garage.make} {garage.model} {garage.status === 'deleted' ? '(Deleted)' : ''}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {(!isLoading && garage.past?.length === 0) && (
                <div className="text-center mt-2">No past vehicles</div>
            )}
        </div>
    );

};

export const GarageItemSkeleton: React.FC = memo(() => {
    return (
        <>
            <li>
                <div className="flex w-full items-center mb-1 animate-pulse">
                    <div className="w-24 h-20 ml-5 bg-gray-300 " />
                    <div className="bg-gray-300 w-1/2 h-4 ml-2 rounded" />
                </div>
            </li>
            <li>
                <div className="flex w-full items-center mb-1 animate-pulse">
                    <div className="w-24 h-20 ml-5 bg-gray-300" />
                    <div className="bg-gray-300 w-1/2 h-4 ml-2 rounded" />
                </div>
            </li>
        </>
    );
});

export default Garage;