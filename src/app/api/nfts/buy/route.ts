import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ success: false, message: 'Login required to purchase' }, { status: 401 });
        }

        let buyerId: string;
        try {
            const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
            buyerId = decoded.userId;
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
        }

        const { nftId } = await request.json();

        if (!nftId) {
            return NextResponse.json({ success: false, message: 'NFT ID required' }, { status: 400 });
        }

        // Transaction logic using Prisma transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Get NFT and Owner
            const nft = await tx.nFT.findUnique({
                where: { id: nftId },
                include: { owner: true } // Need owner to credit them
            });

            if (!nft || !nft.isListed || !nft.price) {
                throw new Error('NFT not listed or invalid');
            }

            // 2. Get Buyer
            const buyer = await tx.user.findUnique({
                where: { id: buyerId }
            });

            if (!buyer) {
                throw new Error('Buyer account not found');
            }

            if (buyer.balance < nft.price) {
                throw new Error('Insufficient balance');
            }

            if (buyer.id === nft.ownerId) {
                throw new Error('Cannot buy your own NFT');
            }

            // 3. Transfer Funds
            await tx.user.update({
                where: { id: buyer.id },
                data: { balance: { decrement: nft.price } }
            });

            await tx.user.update({
                where: { id: nft.ownerId },
                data: { balance: { increment: nft.price } }
            });

            // 4. Transfer Ownership
            const updatedNft = await tx.nFT.update({
                where: { id: nft.id },
                data: {
                    ownerId: buyer.id,
                    isListed: false // Delist after sale
                }
            });

            // 5. Record Transaction
            await tx.transaction.create({
                data: {
                    type: 'SALE',
                    amount: nft.price,
                    nftId: nft.id,
                    fromId: nft.ownerId,
                    toId: buyer.id
                }
            });

            return updatedNft;
        });

        return NextResponse.json({ success: true, nft: result });

    } catch (error: unknown) {
        console.error('Buy error:', error);
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Purchase failed' }, { status: 500 });
    }
}
