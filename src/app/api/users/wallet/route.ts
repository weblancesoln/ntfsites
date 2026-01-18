import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const { address, walletType } = await req.json();

        if (!address || !walletType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                address,
                walletType
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                address: updatedUser.address,
                walletType: updatedUser.walletType
            }
        });

    } catch (error) {
        console.error('Wallet update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
