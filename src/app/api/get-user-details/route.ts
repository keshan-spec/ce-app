import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const id = params.get("id");

        let url = `${API_URL}/wp-json/app/v1/get-user-profile-next`;
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
        });

        const data = await response.json();
        if (response.status !== 200) throw new Error(data.message);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch product',
        }, {
            status: 500,
        });
    }
}