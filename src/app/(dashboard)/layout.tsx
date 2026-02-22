"use client";

import { Sidebar } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Application Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Clean background - no heavy glows by default in dashboard */}
                <div className="absolute inset-0 bg-background -z-10" />

                {/* Search / Breadcrumb Bar (Integrated Header) */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                            <span>Workspace</span>
                            <span className="opacity-30">/</span>
                            <span className="text-blue-500 font-black">
                                {pathname === "/dashboard" ? "Home" :
                                    pathname === "/library" ? "Library" :
                                        pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search extensions..."
                                className="w-64 bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/30 transition-all focus:w-80 outline-none"
                            />
                        </div>

                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-neutral-500 hover:text-white transition-all border border-transparent hover:border-white/5">
                            <Bell className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-xs font-black hover:bg-neutral-200 transition-all shadow-xl shadow-white/5" title="Create New Extension"
                        >
                            <Plus className="w-4 h-4" />
                            New
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="p-6 md:p-8 xl:p-10 h-full max-w-7xl mx-auto w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
