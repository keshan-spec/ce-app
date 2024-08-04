import { API_URL } from '@/actions/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${API_URL}/wp-json/app/v1/get-event-categories`, {
            method: "GET",
            cache: "force-cache",
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}