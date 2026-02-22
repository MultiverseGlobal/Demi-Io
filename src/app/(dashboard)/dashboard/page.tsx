"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
    Zap,
    Download,
    Eye,
    ArrowUpRight,
    MoreHorizontal,
    Code2,
    FileJson,
    Calendar,
    Clock,
    Sparkles,
    Loader2,
    PlusCircle as PlusCircleIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const stats = [
    { label: "Active Extensions", value: "12", change: "+2 this week", icon: <Zap className="w-4 h-4" /> },
    { label: "Total Installs", value: "1.2k", change: "+14%", icon: <Download className="w-4 h-4" /> },
    { label: "Runtime Views", value: "45.8k", change: "+24%", icon: <Eye className="w-4 h-4" /> },
];

const recentGenerations = [
    { name: "Amazon Price Tracker", time: "2 hours ago", status: "Active", type: "Chrome" },
    { name: "Twitter Sentiment AI", time: "5 hours ago", status: "Draft", type: "Edge" },
    { name: "LinkedIn Lead Scraper", time: "Yesterday", status: "Active", type: "Chrome" },
];

export default function DashboardPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);

        try {
            console.log("Generating project for prompt:", prompt);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.warn("No active session found in Dashboard");
                alert("Please sign in to continue.");
                return;
            }

            console.log("Creating project in Supabase...");
            const { data: project, error: projError } = await supabase
                .from('projects')
                .insert({
                    user_id: session.user.id,
                    name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
                    description: prompt,
                })
                .select()
                .single();

            if (projError) {
                console.error("Project creation error:", projError);
                throw projError;
            }

            console.log("Project created, redirecting to:", project.id);
            router.push(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
        } catch (err: any) {
            console.error("Dashboard handleGenerate failed:", err);
            alert("Error creating project: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">

            <div className="space-y-12 h-full flex flex-col justify-center max-w-4xl mx-auto px-6 py-12 relative z-10">
                {/* Centered Prompt Vibe (Suno Style) */}
                <section className="text-center space-y-8 py-12 relative">
                    {/* Subtle Center Highlight - Reduced blur and opacity */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[100px] -z-10 pointer-events-none rounded-full opacity-20" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-700/50">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            Your 2026 Lovable Vibes are here →
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] brand-font">
                            Ready to build, Ben?
                        </h1>
                    </motion.div>

                    {/* Main Action Bar - Suno Style */}
                    <div className="max-w-2xl mx-auto w-full relative group">
                        <div className="relative glass-card bg-black/40 backdrop-blur-3xl border border-white/5 focus-within:border-white/20 rounded-[32px] p-5 flex flex-col gap-4 transition-all duration-300">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                                placeholder="What extension can I build for you today?"
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-neutral-400 text-base resize-none min-h-[60px] focus:outline-none"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl hover:bg-neutral-800/80 text-neutral-400 hover:text-white transition-all" title="Attach">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!prompt.trim() || isLoading}
                                        className="group/btn relative inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-black rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sub-actions */}
                    <div className="flex items-center justify-center gap-12 text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                        <button className="hover:text-white transition-colors">Recently viewed</button>
                        <button className="hover:text-white transition-colors">My projects</button>
                        <button className="hover:text-white transition-colors">Templates</button>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            onClick={() => router.push('/analytics')}
                            className="active:scale-95 cursor-pointer group relative overflow-hidden p-6 rounded-2xl border border-white/5 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                        >
                            <div className="relative flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-white transition-colors">{stat.label}</span>
                                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 group-hover:text-white text-neutral-400 transition-colors">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded-full">{stat.change}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

