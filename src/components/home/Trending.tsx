'use client';

import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { NFTCard } from '@/components/NFTCard';
import { motion } from 'framer-motion';

interface TrendingProps {
    nfts: { id: string; title: string; price: number | null; imageUrl: string; owner: { address?: string | null; username?: string } }[];
}

// Fallback high-quality mock data for visual impact
const MOCK_NFTS = [
    {
        id: 'mock-1',
        title: 'Cosmic Perspective #42',
        price: 2.5,
        imageUrl: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&auto=format&fit=crop&q=60',
        owner: { address: '0x123...456', username: 'CryptoKing' }
    },
    {
        id: 'mock-2',
        title: 'Neon Genesis',
        price: 1.8,
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60',
        owner: { address: '0xabc...def', username: 'NeonArtist' }
    },
    {
        id: 'mock-3',
        title: 'Digital Dreams',
        price: 4.2,
        imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?w=800&auto=format&fit=crop&q=60',
        owner: { address: '0x789...012', username: 'DreamWeaver' }
    },
    {
        id: 'mock-4',
        title: 'Cyber Punk 2077',
        price: 3.1,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        owner: { address: '0xeff...333', username: 'CyberPunk' }
    }
];

export function Trending({ nfts }: TrendingProps) {
    // Use real data if available, otherwise use mock data for the showcase
    const displayNFTs = nfts.length > 0 ? nfts : MOCK_NFTS;

    return (
        <section id="explore" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-background z-0" />
            <div className="absolute top-40 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] opacity-50" />
            <div className="absolute bottom-40 left-0 w-80 h-80 bg-accent/20 rounded-full blur-[150px] opacity-30" />

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Flame className="w-5 h-5 animate-pulse" />
                            <span className="font-bold tracking-wider text-sm uppercase">Curated Picks</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-gradient">Trending NFTs</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md">
                            Explore the hottest digital collectibles on the market, curated for their uniqueness and potential.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/explore" className="btn btn-outline border-white/20 hover:border-primary/50 hover:bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 group transition-all">
                            View Collection
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayNFTs.map((nft, index) => (
                        <motion.div
                            key={nft.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <NFTCard
                                id={nft.id}
                                title={nft.title}
                                price={nft.price}
                                imageUrl={nft.imageUrl}
                                ownerAddress={nft.owner.address}
                                ownerName={nft.owner.username}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
