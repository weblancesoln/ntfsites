import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        if (!address) {
            return NextResponse.json({ success: false, message: 'Address required' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { address },
        });

        if (!existingUser) {
            return NextResponse.json({ success: false, message: 'User not found. Please register first.' }, { status: 404 });
        }

        // Update User Balance
        const user = await prisma.user.update({
            where: { address },
            data: { balance: { increment: 10 } },
        });

        // Record Transaction
        await prisma.transaction.create({
            data: {
                type: 'DEPOSIT',
                amount: 10,
                toId: user.id,
            },
        });

        return NextResponse.json({ success: true, balance: user.balance });
    } catch (error) {
        console.error('Faucet error:', error);
        return NextResponse.json({ success: false, message: 'Faucet failed' }, { status: 500 });
    }
}
