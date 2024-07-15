'use client';
import { useUser } from "@/hooks/useUser";
import { Garage } from "@/types/garage";
import { getGarageById } from "@/actions/garage-actions";
import { useQuery } from "@tanstack/react-query";

interface EditGarageProps {
    garage_id: string;
}

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

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}

            {data && (
                <>
                    {JSON.stringify(data)}
                </>
            )}
        </>
    );
};