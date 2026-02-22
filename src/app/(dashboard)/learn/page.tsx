"use client";

import { BookOpen, Play, Github, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";

const guides = [
    { title: "Extension Fundamentals", time: "5 min", type: "Reading" },
    { title: "Building your first Generator", time: "12 min", type: "Video" },
    { title: "Mastering Manifest v3", time: "8 min", type: "Reading" },
    { title: "Handling Permissions safely", time: "6 min", type: "Reading" },
];

export default function LearnPage() {
    return (
        <div className="max-w-4xl space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Learn</h1>
                <p className="text-muted-foreground">Master the art of high-speed extension building.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Getting Started</h2>
                    <div className="space-y-4">
                        {guides.map((guide, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                        {guide.type === "Video" ? <Play className="w-4 h-4 text-primary" /> : <BookOpen className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold">{guide.title}</h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">{guide.type} • {guide.time}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Community & Support</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 rounded-2xl bg-primary text-white space-y-4">
                            <h3 className="font-bold text-lg leading-tight">Join our builder community on Discord</h3>
                            <button className="w-full py-2 bg-white text-primary rounded-lg font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Join Now
                            </button>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Github className="w-5 h-5" />
                                <span className="text-sm font-bold">Open Source Docs</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
