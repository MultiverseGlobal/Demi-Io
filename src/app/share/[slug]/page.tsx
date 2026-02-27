"use client";

import { useState, useEffect } from "react";
import {
    Download,
    Zap,
    Shield,
    Sparkles,
    Globe,
    ArrowRight,
    Loader2,
    Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";

export default function SharePage({ params }: { params: { slug: string } }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedProject = async () => {
            const { data: share, error: shareError } = await supabase
                .from('project_shares')
                .select('project_id')
                .eq('share_slug', params.slug)
                .eq('is_public', true)
                .single();

            if (shareError || !share) {
                setError("Project not found or is private.");
                setLoading(false);
                return;
            }

            const { data: proj, error: projError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', share.project_id)
                .single();

            if (projError) {
                setError(projError.message);
            } else {
                setProject(proj);
            }
            setLoading(false);
        };

        fetchSharedProject();
    }, [params.slug]);

    const handleDownload = async () => {
        if (!project?.latest_code) return;
        const zip = new JSZip();
        Object.entries(project.latest_code as Record<string, string>).forEach(([file, content]) => {
            zip.file(file, content);
        });
        const blob = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.name}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
            <div className="p-4 bg-red-500/10 text-red-400 rounded-full mb-6">
                <Shield className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-neutral-500 max-w-sm">{error}</p>
            <a href="/" className="mt-8 text-blue-500 font-bold flex items-center gap-2 hover:underline">
                Back to Demi IO <ArrowRight className="w-4 h-4" />
            </a>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-blue-500/30 font-sans">
            {/* Header / Nav */}
            <nav className="h-20 border-b border-neutral-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <Zap className="w-6 h-6 text-blue-600 fill-current" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-neutral-900">DEMI <span className="text-blue-500">IO</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/login" className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors">Login</a>
                    <a href="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                        Create your own
                    </a>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* Hero Info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
                                <Globe className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest text-[10px]">Public Showcase</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tight leading-tight text-neutral-900">{project.name}</h1>
                            <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed">
                                {project.description || "A custom Chrome Extension built with Demi IO. Fully functional and manifest v3 compliant."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/30 active:scale-95 group"
                            >
                                <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Download .zip
                            </button>
                            <button
                                onClick={() => window.location.href = `/?fork=${project.id}`}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-neutral-200 hover:border-blue-200 text-neutral-900 rounded-2xl font-black text-lg transition-all shadow-sm active:scale-95 group"
                            >
                                <Sparkles className="w-6 h-6 text-blue-500 group-hover:rotate-12 transition-transform" />
                                Clone & Edit
                            </button>
                        </div>
                    </div>

                    {/* Stats / Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Manifest", value: "v3", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
                            { label: "Files", value: Object.keys(project.latest_code).length, icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Version", value: "1.0.0", icon: Zap, color: "text-blue-600", bg: "bg-blue-50" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 bg-white border border-neutral-100 rounded-3xl flex items-center gap-4 shadow-sm">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</div>
                                    <div className="text-xl font-black text-neutral-900">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Installation Guide Integration */}
                    <div className="p-10 bg-white border border-neutral-100 rounded-[40px] space-y-8 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Info className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-neutral-900">Installation Guide</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { step: "1", text: "Download and unzip the source folder." },
                                { step: "2", text: "Open chrome://extensions in your browser." },
                                { step: "3", text: "Turn on Developer mode (top right)." },
                                { step: "4", text: "Click 'Load unpacked' and select the unzipped folder." }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4 p-5 bg-neutral-50 border border-neutral-100 rounded-3xl items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-blue-600/20 flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <p className="text-neutral-600 font-bold text-sm leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-neutral-200 text-center space-y-4">
                <div className="flex items-center justify-center gap-3 opacity-30">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="text-sm font-black tracking-tighter text-neutral-900">DEMI <span className="text-blue-500">IO</span></span>
                </div>
                <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Built with Demi IO - The AI Extension Factory</p>
            </footer>
        </div>
    );
}
