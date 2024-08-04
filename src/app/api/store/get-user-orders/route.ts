import { STORE_API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const user_id = params.get("user_id");

        if (!user_id) {
            return NextResponse.json({
                error: 'User ID not found',
            }, {
                status: 400,
            });
        }

        const page = params.get("page") || 1;
        const limit = params.get("limit") || 10;

        const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/get-user-orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user_id, page, limit }),
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