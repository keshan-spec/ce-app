import { API_URL } from '@/actions/api';
import { getSessionUser } from '@/actions/auth-actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const page = params.get("page") || 1;
    const user = await getSessionUser();

    try {
        const response = await fetch(`${API_URL}/wp-json/app/v1/get-posts?page=${page}&limit=10`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, following_only: true }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Failed to fetch posts', error);
        return NextResponse.json({
            error: 'Failed to fetch posts',
        }, {
            status: 500,
        });
    }
}