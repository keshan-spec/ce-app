import { API_URL } from '@/actions/api';
import { getSessionUser } from '@/actions/auth-actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const page = params.get("page") || 1;
        const paginate = params.get("paginate") === "true";
        const paramFilters = params.get("filters");
        let filters;

        if (paramFilters && paramFilters !== undefined) {
            filters = JSON.parse(paramFilters as string);
        }

        const user = await getSessionUser();

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-events-trending`, {
            method: "POST",
            cache: "force-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, page, per_page: 10, paginate, filters }),
        });


        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}