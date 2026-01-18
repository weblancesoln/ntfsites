import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ success: false, message: 'ID or Address required' }, { status: 400 });
    }

    // Try finding by ID first, then by address
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: id },
                { address: id }
            ]
        },
        include: {
            nftsOwned: true,
            nftsCreated: true,
            sentTransactions: { orderBy: { createdAt: 'desc' }, take: 5 },
            receivedTransactions: { orderBy: { createdAt: 'desc' }, take: 5 }
        }
    });

    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
}
