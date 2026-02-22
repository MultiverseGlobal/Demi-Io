"use client";

import { motion } from "framer-motion";
import { Layout, Plus, Search, Filter, Box } from "lucide-react";

const templates = [
    { name: "Empty Manifest v3", category: "Basics", color: "bg-blue-500/10 text-blue-500" },
    { name: "Content Script Injector", category: "Core", color: "bg-purple-500/10 text-purple-500" },
    { name: "Popup React UI", category: "Frontend", color: "bg-green-500/10 text-green-500" },
    { name: "Background Listener", category: "Core", color: "bg-yellow-500/10 text-yellow-500" },
    { name: "Options Page Builder", category: "UI", color: "bg-red-500/10 text-red-500" },
    { name: "Storage Manager", category: "Data", color: "bg-indigo-500/10 text-indigo-500" },
];

export default function TemplatesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight">Templates</h1>
                    <p className="text-muted-foreground">Start fast with pre-built extension skeletons.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold hover:opacity-90 transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    Custom Template
                </button>
            </div>

            <div className="flex items-center gap-4 py-4 border-b border-border">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Search templates..." className="w-full bg-secondary/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-xs font-bold hover:bg-secondary">
                    <Filter className="w-3.5 h-3.5" />
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border border-border bg-card/50 hover:border-primary/20 transition-all cursor-pointer flex items-center gap-4 group"
                    >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${template.color}`}>
                            <Box className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{template.name}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{template.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
