import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const page = params.get("page") || 1;
        const limit = params.get("limit") || 10;
        const garageId = params.get("garageId");
        const tagged = params.get("tagged") === 'true';

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ garage_id: garageId, page, limit, tagged }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw new Error('Failed to fetch users posts');
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