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
                <header className="h-20 border-b border-neutral-100 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl z-40 shadow-sm shadow-black/[0.01]">
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
                                className="w-64 bg-neutral-100 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/30 transition-all focus:w-80 outline-none text-neutral-900 placeholder:text-neutral-400"
                            />
                        </div>

                        <button className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all border border-transparent hover:border-neutral-200">
                            <Bell className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10 active:scale-95" title="Create New Extension"
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
