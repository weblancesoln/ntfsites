import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BuyButton } from '@/components/BuyButton';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function NFTDetail({ params }: Props) {
    const { id } = await params;

    let nft;
    try {
        nft = await prisma.nFT.findUnique({
            where: { id },
            include: { owner: true, creator: true }
        });
    } catch (error) {
        console.error('NFT detail fetch error:', error);
        return notFound();
    }

    if (!nft) return notFound();

    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
                    {nft.imageUrl ? (
                        <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">No Image</div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">{nft.title}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                            <div>
                                <p className="text-xs text-[hsl(var(--text-secondary))]">Creator</p>
                                <p className="text-sm font-mono text-[hsl(var(--primary))]">
                                    {nft.creator.address
                                        ? `${nft.creator.address.slice(0, 6)}...${nft.creator.address.slice(-4)}`
                                        : nft.creator.username
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500" />
                            <div>
                                <p className="text-xs text-[hsl(var(--text-secondary))]">Current Owner</p>
                                <p className="text-sm font-mono text-[hsl(var(--primary))]">
                                    {nft.owner.address
                                        ? `${nft.owner.address.slice(0, 6)}...${nft.owner.address.slice(-4)}`
                                        : nft.owner.username
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 mb-8">
                        <p className="text-[hsl(var(--text-secondary))] mb-2">Current Price</p>
                        <div className="text-3xl font-bold mb-6">
                            {nft.price ? `${nft.price} ETH` : 'Not Listed'}
                        </div>

                        {nft.isListed && nft.price && (
                            <BuyButton
                                nftId={nft.id}
                                price={nft.price}
                                ownerAddress={nft.owner.address || nft.owner.id}
                            />
                        )}
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-bold mb-2">Description</h3>
                        <p className="text-[hsl(var(--text-secondary))] whitespace-pre-wrap">{nft.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
