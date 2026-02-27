import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string; role: string };

        if (decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { message } = await request.json();

        if (typeof message !== 'string') {
            return NextResponse.json({ error: 'Message must be a string' }, { status: 400 });
        }

        const setting = await prisma.setting.upsert({
            where: { key: 'withdraw_error_message' },
            update: { value: message },
            create: { key: 'withdraw_error_message', value: message }
        });

        return NextResponse.json({ success: true, message: setting.value });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Update withdraw error message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
