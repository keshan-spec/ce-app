import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const garageId = params.get("garageId");

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage`, {
            method: "POST",
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ garage_id: garageId }),
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