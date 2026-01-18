'use client';

import { Rocket, Shield, Wand2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Wand2 className="w-8 h-8 text-purple-400" />,
        title: "AI Generation",
        description: "Create unique digital assets instantly using our advanced AI generation tools. No artistic skills required."
    },
    {
        icon: <Zap className="w-8 h-8 text-pink-400" />,
        title: "Instant Trading",
        description: "Experience lightning-fast transactions with our optimized internal credit system. Buy and sell in seconds."
    },
    {
        icon: <Shield className="w-8 h-8 text-blue-400" />,
        title: "Secure & Safe",
        description: "Your assets are protected by top-tier security protocols and verified smart contracts."
    },
    {
        icon: <Rocket className="w-8 h-8 text-orange-400" />,
        title: "Creator Reporting",
        description: "Detailed analytics and insights for creators to track performance and audience engagement."
    }
];

export function Features() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] -z-10" />

            <div className="container">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 text-3xl md:text-5xl font-bold"
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        We combine cutting-edge technology with user-centric design to provide the best NFT experience.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-8 rounded-2xl group"
                        >
                            <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:bg-primary/20 transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
