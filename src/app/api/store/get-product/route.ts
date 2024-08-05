import { STORE_API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const id = params.get("id");

        const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/get-product`, {
            cache: "force-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error('Failed to fetch product');
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch product',
        }, {
            status: 500,
        });
    }
}