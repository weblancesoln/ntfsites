import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { userId, amount } = await request.json();

        if (!userId || !amount) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
        }

        // Update User Balance
        const user = await prisma.user.update({
            where: { id: userId },
            data: { balance: { increment: val } }
        });

        // Record Transaction
        await prisma.transaction.create({
            data: {
                type: 'CREDIT',
                amount: val,
                toId: user.id,
            },
        });

        return NextResponse.json({ success: true, balance: user.balance });
    } catch (error) {
        console.error('Credit error:', error);
        return NextResponse.json({ success: false, message: 'Credit failed' }, { status: 500 });
    }
}
