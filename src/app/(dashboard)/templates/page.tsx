"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Layout,
    Search,
    ChevronRight,
    ArrowRight,
    Star,
    Layers,
    Code2,
    Palette,
    Package
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const templates = [
    {
        id: "amazon-tracker",
        name: "Price Tracker Pro",
        description: "A high-performance manifest v3 tracker with real-time price change notifications.",
        category: "E-Commerce",
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        complexity: "Intermediate",
        uses: 4.2,
        color: "from-yellow-500/10 to-transparent"
    },
    {
        id: "linkedin-lead-gen",
        name: "Lead Scraper AI",
        description: "Extract professional contacts directly from LinkedIn with clean CSV export.",
        category: "Productivity",
        icon: <Layers className="w-8 h-8 text-blue-500" />,
        complexity: "Advanced",
        uses: 2.8,
        color: "from-blue-500/10 to-transparent"
    },
    {
        id: "seo-analyzer",
        name: "Deep SEO Auditor",
        description: "Instant on-page SEO audits with visual highlighting of issues.",
        category: "Marketing",
        icon: <Search className="w-8 h-8 text-green-500" />,
        complexity: "Beginner",
        uses: 1.5,
        color: "from-green-500/10 to-transparent"
    },
    {
        id: "ui-dark-mode",
        name: "Glassmorphism Injector",
        description: "Inject premium glassmorphism layouts into any legacy website UI.",
        category: "UI/UX",
        icon: <Palette className="w-8 h-8 text-purple-500" />,
        complexity: "Intermediate",
        uses: 3.1,
        color: "from-purple-500/10 to-transparent"
    },
    {
        id: "token-swap-widget",
        name: "Crypto Swap Radar",
        description: "Floating widget for real-time crypto price tracking and swap alerts.",
        category: "Web3",
        icon: <Star className="w-8 h-8 text-indigo-500" />,
        complexity: "Advanced",
        uses: 950,
        color: "from-indigo-500/10 to-transparent"
    }
];

export default function TemplatesPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredTemplates = selectedCategory === "all"
        ? templates
        : templates.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

    const handleUseTemplate = (template: typeof templates[0]) => {
        // Redirect to dashboard with a pre-filled prompt
        router.push(`/dashboard?prompt=${encodeURIComponent(`Build me a ${template.name}: ${template.description}`)}`);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Zap className="w-4 h-4 fill-current" />
                    Starter Kits
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    Kickstart your next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">manifest masterwork.</span>
                </h1>
                <p className="text-neutral-500 font-medium max-w-xl">
                    High-quality boilerplate templates built with best practices for MV3, optimized for performance and security.
                </p>
            </header>

            {/* Filter Chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                {["all", "E-Commerce", "Productivity", "Marketing", "UI/UX", "Web3"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
                            selectedCategory === cat
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-neutral-500 border-white/5 hover:border-white/20"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, i) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />

                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 flex flex-col h-full hover:border-white/20 transition-all duration-300">
                            {/* Icon & Category */}
                            <div className="flex justify-between items-start mb-8">
                                <div className={cn("p-4 rounded-2xl border border-white/5 bg-gradient-to-br", template.color)}>
                                    {template.icon}
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black tracking-widest text-neutral-500 uppercase border border-white/5">
                                    {template.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 flex-1">
                                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                                    {template.description}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black tracking-widest text-neutral-700 uppercase">Difficulty</span>
                                    <span className={cn(
                                        "text-[10px] font-bold",
                                        template.complexity === "Beginner" ? "text-green-500" :
                                            template.complexity === "Intermediate" ? "text-blue-500" : "text-purple-500"
                                    )}>
                                        {template.complexity}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleUseTemplate(template)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                                >
                                    Use Kit
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Call to Action */}
            <section className="mt-12 p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="relative z-10 space-y-2 text-center md:text-left">
                    <h2 className="text-3xl font-black tracking-tighter">Have a custom boilerplate?</h2>
                    <p className="text-blue-100 font-medium opacity-80">Submit your high-performance kits to the public factory.</p>
                </div>
                <button className="relative z-10 px-8 py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 flex items-center gap-3 group">
                    <Code2 className="w-4 h-4" />
                    Submit Template
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </section>
        </div>
    );
}
