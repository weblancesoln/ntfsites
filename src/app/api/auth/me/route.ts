import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ user: null });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string, email: string, role: string };

            // Optional: Fetch fresh user data from DB to ensure they still exist/aren't banned
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    address: true,
                    walletType: true
                }
            });

            if (!user) {
                return NextResponse.json({ user: null });
            }

            return NextResponse.json({ user });

        } catch {
            // Token invalid or expired
            return NextResponse.json({ user: null });
        }

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
