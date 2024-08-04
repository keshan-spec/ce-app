import { API_URL } from '@/actions/api';
import { getSessionUser } from '@/actions/auth-actions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            throw new Error('Session user not found');
        }

        const response = await fetch(`${API_URL}/wp-json/app/v1/get-notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: 'Failed to fetch notification count',
        }, {
            status: 500,
        });
    }
}