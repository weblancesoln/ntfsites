'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function CallToAction() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto glass p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="mb-8 inline-flex p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of creators and collectors shaping the future of digital ownership.
                        Create, trade, and collect efficiently.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/create" className="btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-bold bg-white text-black hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
                            Start Creating Now
                        </Link>
                        <Link href="/register" className="glass w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                            Create Account <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
