"use client";

import { Search as SearchIcon, Command, Sparkles } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border border-border rounded-2xl p-6 shadow-xl flex items-center gap-4">
                    <SearchIcon className="w-6 h-6 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects, templates, or documentation..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-medium outline-none"
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-[10px] font-bold text-muted-foreground">
                        <Command className="w-3 h-3" />
                        K
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Researches</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "How to inject CSS with Chrome Extension",
                        "Manifest v3 background worker tutorial",
                        "Amazon price scraper examples",
                        "Twitter UI modification"
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/20 transition-all cursor-pointer flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
