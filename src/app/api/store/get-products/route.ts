import { STORE_API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const page = params.get("page") || 1;
    const limit = params.get("limit") || 10;

    try {
        const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/get-products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ page, limit }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error('Failed to fetch products');
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Failed to fetch products', error);

        return NextResponse.json({
            error: 'Failed to fetch posts',
        }, {
            status: 500,
        });
    }
}