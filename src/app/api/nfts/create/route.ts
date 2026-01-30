import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-prod';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');

        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
            userId = decoded.userId;
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, imageUrl, price } = body;

        if (!title || !imageUrl) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        // Create NFT linked to session user
        const nft = await prisma.nFT.create({
            data: {
                title,
                description,
                imageUrl,
                price: parseFloat(price) || 0,
                isListed: true,
                ownerId: userId,
                creatorId: userId,
            },
        });

        // Record Mint Transaction
        await prisma.transaction.create({
            data: {
                type: 'MINT',
                amount: 0,
                nftId: nft.id,
                toId: userId,
            },
        });

        return NextResponse.json({ success: true, nft });
    } catch (error) {
        console.error('Mint error:', error);
        return NextResponse.json({ success: false, message: 'Mint failed' }, { status: 500 });
    }
}
