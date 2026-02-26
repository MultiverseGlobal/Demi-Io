"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    ArrowRight,
    Zap,
    Shield,
    History,
    Loader2,
    LayoutGrid,
    List,
    Trash2,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeStatus, setActiveStatus] = useState("All");

    const categories = ["All", "Productivity", "E-commerce", "Social", "DevTools", "AI"];
    const statuses = ["All", "Draft", "Active", "Archived"];

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (data) setProjects(data);
            setLoading(false);
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.metadata?.category === activeCategory;
        const matchesStatus = activeStatus === "All" || p.status === activeStatus.toLowerCase();

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this extension?")) return;
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (!error) {
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">My Extensions</h1>
                    <p className="text-neutral-500 font-medium">Manage and deploy your high-performance extensions.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    New Project
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-blue-500/30 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex p-1 bg-neutral-100 rounded-2xl border border-neutral-200 h-[54px] items-center">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2.5 rounded-xl transition-all",
                            viewMode === 'grid' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-900"
                        )}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2.5 rounded-xl transition-all",
                            viewMode === 'list' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-900"
                        )}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
                {/* Filters Bar */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                activeCategory === cat
                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid/List View */}
                {filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-[40px] text-center space-y-4">
                        <div className="p-4 bg-white rounded-full shadow-sm border border-neutral-100">
                            <Zap className="w-12 h-12 text-blue-500 animate-pulse-slow" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">No extensions yet</h3>
                            <p className="text-neutral-500">Create your first manifest v3 extension to see it here.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="text-blue-500 font-bold hover:underline"
                        >
                            Initialize first project →
                        </button>
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-3"
                    )}>
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className={cn(
                                    "group bg-white border border-neutral-100 hover:border-blue-500/20 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/5",
                                    viewMode === 'grid' ? "p-8 rounded-[32px] flex flex-col gap-6 h-full" : "p-4 rounded-2xl flex items-center justify-between"
                                )}
                                onClick={() => window.location.href = `/project/${project.id}`}
                            >
                                <div className={cn("flex gap-5", viewMode === 'list' && "items-center flex-1")}>
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0">
                                        <Zap className="w-6 h-6 fill-blue-500/20" />
                                    </div>
                                    <div className="space-y-1 truncate pr-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-black text-neutral-900 group-hover:text-blue-600 transition-colors truncate">{project.name}</h3>
                                            {project.status === 'active' && (
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Active" />
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-500 font-medium line-clamp-2">{project.description || "Experimental Chrome Extension"}</p>
                                        <div className="pt-2 flex items-center gap-2">
                                            <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100">
                                                {project.metadata?.category || "Uncategorized"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex items-center gap-4",
                                    viewMode === 'grid' ? "mt-auto pt-6 border-t border-white/5" : "flex-shrink-0"
                                )} onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mr-auto">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 border border-neutral-100 rounded-full">
                                            <Shield className="w-3 h-3 text-green-500" />
                                            MV3
                                        </div>
                                        {viewMode === 'grid' && (
                                            <span className="opacity-50">
                                                {new Date(project.updated_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded-xl transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/10 hover:bg-blue-500 transition-all active:scale-95"
                                            onClick={() => window.location.href = `/project/${project.id}`}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            );
}
