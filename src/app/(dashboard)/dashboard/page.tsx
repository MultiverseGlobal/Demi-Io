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
    PlusCircle as PlusCircleIcon,
    MousePointer2,
    X
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
    const [liveStats, setLiveStats] = useState(stats);
    const [history, setHistory] = useState<any[]>([]);
    const [hasImportedSelectors, setHasImportedSelectors] = useState(false);

    useEffect(() => {
        const checkImported = () => {
            const hasSelectors = !!localStorage.getItem('demi_last_selectors');
            setHasImportedSelectors(hasSelectors);
        };
        checkImported();

        const fetchDashboardData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Fetch Project Count
            const { count: projectCount } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id);

            // Fetch Total Installs (Mock logic for now, or fetch from extensions table if count is tracked)
            const { count: installCount } = await supabase
                .from('extensions')
                .select('*', { count: 'exact', head: true });

            setLiveStats([
                { label: "Active Extensions", value: (projectCount || 0).toString(), change: "Live", icon: <Zap className="w-4 h-4" /> },
                { label: "Total Installs", value: (installCount || 0).toString(), change: "Community", icon: <Download className="w-4 h-4" /> },
                { label: "Runtime Views", value: "45.8k", change: "+24%", icon: <Eye className="w-4 h-4" /> },
            ]);

            // Fetch Recent Generations
            const { data: recent } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', session.user.id)
                .order('updated_at', { ascending: false })
                .limit(3);

            if (recent) setHistory(recent);
        };

        fetchDashboardData();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Please sign in to continue.");
                return;
            }

            const selectors = localStorage.getItem('demi_last_selectors');
            const targetUrl = localStorage.getItem('demi_last_url');

            const { data: project, error: projError } = await supabase
                .from('projects')
                .insert({
                    user_id: session.user.id,
                    name: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
                    description: prompt,
                    metadata: {
                        target_url: targetUrl,
                        visual_selectors: selectors ? JSON.parse(selectors) : null
                    }
                })
                .select()
                .single();

            if (projError) throw projError;

            // Clear imported state after use
            localStorage.removeItem('demi_last_selectors');
            localStorage.removeItem('demi_last_url');

            router.push(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
        } catch (err: any) {
            alert("Error creating project: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">

            <div className="space-y-12 h-full flex flex-col justify-center max-w-4xl mx-auto px-6 py-12 relative z-10">
                {/* Centered Prompt Vibe (Suno Style) */}
                <section className="text-center space-y-10 py-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 blur-[120px] -z-10 pointer-events-none rounded-full opacity-30" />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Extension Factory v2.0
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 leading-tight">
                            Build your next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 italic">extension idea.</span>
                        </h1>
                    </motion.div>

                    {/* Main Action Bar - Suno Style */}
                    <div className="max-w-2xl mx-auto w-full relative group px-4 md:px-0">
                        <div className="relative glass-card bg-white/80 backdrop-blur-3xl border border-neutral-200 focus-within:border-blue-500/40 rounded-[28px] p-4 flex flex-col gap-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-300">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                                placeholder="Describe your extension idea in detail..."
                                className="w-full bg-transparent border-none focus:ring-0 text-neutral-900 placeholder:text-neutral-300 text-lg resize-none min-h-[80px] p-2 focus:outline-none font-medium leading-relaxed"
                            />
                            <div className="flex items-center justify-between px-2 pb-1">
                                <div className="flex gap-4 items-center">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600">
                                        <Code2 className="w-3.5 h-3.5" />
                                        Manifest v3
                                    </div>
                                    {hasImportedSelectors && (
                                        <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-100 rounded-lg text-[9px] font-black text-green-600 uppercase tracking-widest animate-pulse">
                                            <MousePointer2 className="w-3 h-3" />
                                            Visual Targets Loaded
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    localStorage.removeItem('demi_last_selectors');
                                                    localStorage.removeItem('demi_last_url');
                                                    setHasImportedSelectors(false);
                                                }}
                                                className="ml-1 hover:text-green-900 transition-colors"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isLoading}
                                    className="group/btn relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 active:scale-95 disabled:opacity-30"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Start Building</span>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sub-actions */}
                    <div className="flex items-center justify-center gap-12 text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                        <button onClick={() => setPrompt(history[0]?.description || "")} className="hover:text-neutral-900 transition-colors">Recently viewed</button>
                        <button onClick={() => router.push('/library')} className="hover:text-neutral-900 transition-colors">My projects</button>
                        <button onClick={() => router.push('/templates')} className="hover:text-neutral-900 transition-colors">Templates</button>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    {liveStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            onClick={() => router.push('/analytics')}
                            className="active:scale-95 cursor-pointer group relative overflow-hidden p-6 rounded-2xl border border-neutral-100 bg-white hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <div className="relative flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{stat.label}</span>
                                    <div className="p-2 rounded-xl bg-neutral-50 group-hover:bg-blue-100 group-hover:text-blue-600 text-neutral-400 transition-colors">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-full">{stat.change}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

