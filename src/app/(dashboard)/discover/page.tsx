"use client";

import { motion } from "framer-motion";
import { Globe, Heart, Download, Eye, Zap, Sparkles } from "lucide-react";

const extensions = [
    { title: "SaaS Price Optimizer", author: "alex_dev", installs: "1.2k", likes: 450, icon: <Zap className="w-5 h-5 text-yellow-500" /> },
    { title: "Discord Theme Customizer", author: "theme_lord", installs: "8.5k", likes: 2.1e3, icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { title: "LinkedIn Auto-Connect", author: "growth_hacker", installs: "4.2k", likes: 890, icon: <Globe className="w-5 h-5 text-blue-500" /> },
];

export default function DiscoverPage() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Discover</h1>
                <p className="text-muted-foreground">Explore trending extensions built by the Demi community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extensions.map((ext, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-white dark:hover:bg-secondary/40 hover:border-primary/30 transition-all group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                                {ext.icon}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                                <Eye className="w-3.5 h-3.5" />
                                12.4k views
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{ext.title}</h3>
                        <p className="text-xs text-muted-foreground mb-6">by @{ext.author}</p>

                        <div className="flex items-center gap-6 pt-4 border-t border-border">
                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <Download className="w-3.5 h-3.5 text-muted-foreground" />
                                {ext.installs}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <Heart className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                                {ext.likes}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
