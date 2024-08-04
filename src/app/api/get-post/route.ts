import { API_URL } from '@/actions/api';
import { getSessionUser } from '@/actions/auth-actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const user_id = params.get("user_id");
        const post_id = params.get("post_id");

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id, post_id }),
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || 'Failed to fetch orders',
        }, {
            status: 500,
        });
    }
}