"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Zap,
    Globe,
    TrendingUp,
    Eye,
    Download,
    Loader2,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [forkingId, setForkingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (data) setProjects(data);
            setLoading(false);
        };

        fetchPublicProjects();
    }, []);

    const handleFork = async (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setForkingId(projectId);
        try {
            const res = await fetch('/api/project/fork', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId })
            });
            const data = await res.json();
            if (data.projectId) {
                router.push(`/project/${data.projectId}`);
            } else {
                alert(data.error || 'Failed to fork project');
            }
        } catch (err) {
            console.error('Fork error:', err);
            alert('An unexpected error occurred');
        } finally {
            setForkingId(null);
        }
    };

    const filteredProjects = projects.filter(p =>
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filter === "all" || p.status === filter)
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section / Trending */}
            <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/30 to-white border border-blue-100 p-8 md:p-12 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-40 hidden lg:block">
                    <Globe className="w-64 h-64 text-blue-200 animate-slow-spin" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-200">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Trending Now
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-neutral-900 leading-tight">
                        Discover the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 italic">community factory.</span>
                    </h1>
                    <p className="text-neutral-500 text-lg font-medium leading-relaxed">
                        Explore, fork, and learn from thousands of AI-generated extensions built by creators worldwide.
                    </p>
                </div>
            </section>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search community extensions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-2xl pl-14 pr-6 py-4.5 text-sm focus:border-blue-500/30 outline-none transition-all focus:bg-neutral-50 placeholder:text-neutral-300 shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {["all", "active", "templates"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border capitalize",
                                filter === f
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                                    : "bg-white text-neutral-500 border-neutral-200 hover:border-blue-300 hover:text-neutral-900 shadow-sm"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-[48px] text-center space-y-6">
                    <div className="p-6 bg-white rounded-full relative shadow-sm border border-neutral-100">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse" />
                        <Sparkles className="w-12 h-12 text-blue-600 relative z-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-neutral-900">No community gems found</h3>
                        <p className="text-neutral-500 font-medium">Be the first to share an extension with the world!</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white border border-neutral-200 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                            onClick={() => router.push(`/share/${project.id}`)}
                        >
                            <div className="p-8 space-y-6 cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                        <Zap className="w-7 h-7 fill-blue-500/20" />
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600 font-bold text-[10px] tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            1.2k
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Download className="w-3 h-3" />
                                            450
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight truncate">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-neutral-500 font-medium line-clamp-2 leading-relaxed h-[40px]">
                                        {project.description || "A powerful chrome extension generated by Demi AI."}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200" />
                                        <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Creator</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleFork(project.id, e)}
                                        disabled={forkingId === project.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all disabled:opacity-50 border border-neutral-200"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                                            {forkingId === project.id ? 'Forking...' : 'Fork'}
                                        </span>
                                        {forkingId === project.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                        ) : (
                                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-transform" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
