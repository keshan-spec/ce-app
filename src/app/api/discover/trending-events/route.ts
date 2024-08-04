import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const page = params.get("page") || 1;
    const paginate = params.get("paginate") === "true";
    const paramFilters = params.get("filters");
    const user_id = params.get("user_id");

    try {
        let filters;

        if (paramFilters && paramFilters !== undefined) {
            filters = JSON.parse(paramFilters as string);
        }

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-events-trending`, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user_id, page, per_page: 10, paginate, filters }),
        });


        const data = await response.json();

        if (!data) {
            throw new Error('Failed to fetch trending events');
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}