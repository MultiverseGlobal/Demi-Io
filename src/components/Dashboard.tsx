"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    History, Settings, HelpCircle, Download, Code2, FileJson,
    ExternalLink, ChevronLeft, LayoutDashboard, Terminal,
    Database, ShieldCheck, Box, Trash2, Plus
} from "lucide-react";

interface DashboardProps {
    prompt: string;
    extensionData: any;
    onBack: () => void;
}

export function Dashboard({ prompt, extensionData, onBack }: DashboardProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setHistory(data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this project?")) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) alert("Error deleting project: " + error.message);
            else fetchHistory();
        }
    };

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 flex flex-col p-4 z-20">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-8 h-8 bg-accent-gradient rounded-lg flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Demi IO</span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto">
                    <div className="px-2 mb-4">
                        <SidebarItem icon={<History className="w-4 h-4" />} label="Recent" active />
                    </div>

                    <div className="space-y-1">
                        {isLoadingHistory ? (
                            <div className="px-3 py-2 text-xs text-muted-foreground animate-pulse">Loading projects...</div>
                        ) : history.length > 0 ? history.map((item) => (
                            <div key={item.id} className="group relative">
                                <a href={`/project/${item.id}`} className="block">
                                    <SidebarItem
                                        active={item.id === extensionData?.id}
                                        icon={<Box className="w-4 h-4" />}
                                        label={item.name || "Untitled Project"}
                                    />
                                </a>
                                <button
                                    onClick={(e) => handleDeleteProject(e, item.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )) : (
                            <div className="px-3 py-2 text-xs text-muted-foreground">No projects yet.</div>
                        )}
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-primary hover:bg-primary/5 transition-colors mt-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>

                    <div className="pt-4 px-2 space-y-1">
                        <SidebarItem icon={<Terminal className="w-4 h-4" />} label="Prompt Engine" />
                        <SidebarItem icon={<Database className="w-4 h-4" />} label="Storage" />
                        <SidebarItem icon={<ShieldCheck className="w-4 h-4" />} label="Permissions" />
                    </div>
                </nav>

                <div className="pt-4 border-t border-border space-y-1">
                    <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" />
                    <SidebarItem icon={<HelpCircle className="w-4 h-4" />} label="Support" />
                    <button
                        onClick={onBack}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mt-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Landing
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                {/* Glow behind content */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

                {/* Top Header */}
                <header className="h-14 border-b border-border bg-background/20 backdrop-blur-md flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4 text-sm font-medium overflow-hidden">
                        <span className="text-muted-foreground shrink-0">Projects</span>
                        <span className="text-border shrink-0">/</span>
                        <span className="truncate max-w-[300px]">{prompt || "New Extension"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={extensionData?.downloadUrl}
                            download
                            className="flex items-center gap-2 px-4 py-1.5 bg-foreground text-background rounded-lg text-sm font-bold hover:opacity-90 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download ZIP
                        </a>
                        <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Workspace */}
                <div className="flex-1 p-8 overflow-y-auto z-10">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Project Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold">Generation Successful</h2>
                                <p className="text-sm text-muted-foreground">Your Chrome extension is ready for installation.</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-xs font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified Manifest v3
                            </div>
                        </motion.div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* File Editor Preview */}
                                <div className="bg-secondary/30 border border-border rounded-2xl overflow-hidden">
                                    <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                                                <Code2 className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                                                content.js
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <FileJson className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
                                                manifest.json
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 font-mono text-sm text-foreground/80 leading-relaxed overflow-x-auto">
                                        <pre>
                                            {`// Created by Demi IO
console.log("Demi IO Extension Active!");

// Target: ${prompt}
// Patterns: Page Modifier, DOM Listener

const elements = document.querySelectorAll('span');
elements.forEach(el => {
  if (el.innerText.includes('$')) {
    el.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
    el.style.border = '1px solid #a855f7';
    el.style.borderRadius = '4px';
    el.style.padding = '2px 4px';
  }
});`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Instructions Card */}
                                <div className="glass-card p-6 rounded-2xl space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-primary" />
                                        How to install
                                    </h3>
                                    <ol className="text-sm text-muted-foreground space-y-3 list-decimal list-inside">
                                        <li>Download the ZIP file.</li>
                                        <li>Unzip it on your computer.</li>
                                        <li>Open <code className="text-foreground font-bold">chrome://extensions</code></li>
                                        <li>Enable <b>Developer Mode</b>.</li>
                                        <li>Click <b>Load unpacked</b> and select the folder.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            active
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        )}>
            {icon}
            {label}
        </button>
    );
}
