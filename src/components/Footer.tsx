'use client';

import Link from 'next/link';
import { Twitter, Github, Linkedin, Disc } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl pt-16 pb-8 overflow-hidden">
            {/* Ambient background */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-primary/5 blur-[100px] pointer-events-none" />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">AI NFT Market</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            The world&apos;s first AI-powered NFT marketplace. Create, collect, and trade digital assets with lightning speed and zero friction.
                        </p>

                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Disc className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Marketplace</h4>
                        <ul className="space-y-4">
                            <li><Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">All NFTs</Link></li>
                            <li><Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
                            <li><Link href="/artists" className="text-muted-foreground hover:text-primary transition-colors">Artists</Link></li>
                            <li><Link href="/rankings" className="text-muted-foreground hover:text-primary transition-colors">Rankings</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/partners" className="text-muted-foreground hover:text-primary transition-colors">Partners</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/newsletter" className="text-muted-foreground hover:text-primary transition-colors">Newsletter</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AI NFT Marketplace. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <a href="mailto:support@ntfgold.vercel.app" className="hover:text-white transition-colors">support@ntfgold.vercel.app</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
