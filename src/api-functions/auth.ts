import { BASE_URL } from "@/actions/api";
import { UserResponse } from "@/actions/auth-actions";

export const getUserDetails = async (id: string): Promise<UserResponse | null> => {
    try {
        let response = await fetch(`${BASE_URL}/api/get-user-details?id=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.status !== 200) throw new Error(data.message);
        return data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};