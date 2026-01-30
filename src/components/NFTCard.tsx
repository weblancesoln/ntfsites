'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NFTProps {
    id: string;
    title: string;
    price: number | null;
    imageUrl: string;
    ownerAddress?: string | null;
    ownerName?: string;
}

export function NFTCard({ id, title, price, imageUrl, ownerAddress, ownerName }: NFTProps) {
    return (
        <Link href={`/nft/${id}`} className="group block h-full">
            <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] border border-white/10 hover:border-primary/50 relative">

                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    {imageUrl ? (
                        <>
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/5">
                            No Image
                        </div>
                    )}

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                        ERC-721
                    </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-xl font-bold mb-1 w-full truncate text-white group-hover:text-primary transition-colors drop-shadow-md">{title}</h3>
                    <p className="text-sm text-white/70 mb-4 truncate font-medium">
                        @{ownerAddress
                            ? `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`
                            : ownerName
                        }
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex flex-col">
                            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Price</span>
                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                {price ? `${price} ETH` : 'Not listed'}
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
