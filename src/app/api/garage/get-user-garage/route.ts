import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const page = params.get("page") || 1;
        const limit = params.get("limit") || 10;
        const profileId = params.get("profileId");
        const tagged = params.get("tagged") === 'true';

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-user-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: profileId, page, limit, tagged }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            return NextResponse.json([]);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || 'Failed to fetch users posts',
        }, {
            status: 500,
        });
    }
}