'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full bg-background">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container relative z-10 text-center px-4">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-8 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        THE NEXT GENERATION OF DIGITAL ART
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight text-white"
                >
                    Discover & Collect <br />
                    <span className="text-gradient drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                        Extraordinary NFTs
                    </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Enter the metaverse of premium digital assets.
                    AI-powered creation, instant trading, and zero gas fees.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link href="/create" className="group relative px-10 py-5 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                        <span className="relative z-10 flex items-center gap-2">
                            Start Creating <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    <Link href="#explore" className="px-10 py-5 glass text-white text-lg font-bold rounded-full transition-all hover:scale-105 hover:bg-white/10 border border-white/20 backdrop-blur-xl">
                        Explore Market
                    </Link>
                </motion.div>

                {/* Floating 3D Elements */}
                {/* Using simple divs for now, but configured to look like floating platforms */}
                <motion.div
                    className="absolute -z-10 w-full h-full inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                >
                    {/* Abstract floating shapes can go here if needed, keeping it clean for now with just gradients */}
                </motion.div>
            </div>
        </section>
    );
}
