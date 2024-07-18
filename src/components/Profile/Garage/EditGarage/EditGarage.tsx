'use client';
import { useUser } from "@/hooks/useUser";
import { Garage } from "@/types/garage";
import { getGarageById } from "@/actions/garage-actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import { AddVehicle, GarageFormType, vehicleMakes } from "../AddVehicle";
import { useMemo } from "react";

interface EditGarageProps {
    garage_id: string;
}

const findKeyByValue = (object: any, value: any) => {
    return Object.keys(object).find(key => object[key] === value);
};

export const EditGarage: React.FC<EditGarageProps> = ({
    garage_id
}) => {
    const { user, isLoggedIn } = useUser();
    const { data, error, isLoading, isFetching } = useQuery<Garage | null, Error>({
        queryKey: [`edit-garage`, garage_id],
        queryFn: () => getGarageById(garage_id),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    if (!isLoggedIn || !user) {
        return <NoAuthWall redirectTo={`/garage/edit/${garage_id}`} />;
    }

    if (data && data.owner_id !== user.id) {
        return <div>You do not have permission to edit this garage.</div>;
    }

    const vehicleValues: GarageFormType = useMemo(() => {
        return {
            make: findKeyByValue(vehicleMakes, data?.make) || '',
            model: data?.model || '',
            ownedFrom: data?.owned_since || '',
            ownedTo: data?.owned_until || '',
            registration: data?.registration || '',
            variant: data?.variant || '',
            vehicle_period: data?.owned_until ? 'past' : 'current',
            allow_tagging: data?.allow_tagging && data?.allow_tagging === '1' ? true : false,
            colour: data?.colour || '',
            cover_photo: data?.cover_photo ? [{
                type: 'jpeg',
                url: data?.cover_photo || '',
                filename: 'cover_photo.jpg',
            }] : null,
        };
    }, [data]);

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-red-500">{error.message}</div>
                </div>
            )}

            {(data && !isLoading) && (
                <AddVehicle isEditing vehicleValues={vehicleValues} garageId={garage_id} />
            )}
        </>
    );
};