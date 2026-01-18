import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { address } = await request.json();

        if (!address) {
            return NextResponse.json({ success: false, message: 'Address required' }, { status: 400 });
        }

        // Upsert User
        const user = await prisma.user.upsert({
            where: { address },
            update: { balance: { increment: 10 } },
            create: {
                address,
                balance: 10
            },
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
