"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Library,
    Settings,
    CreditCard,
    Zap,
    ChevronLeft,
    HelpCircle,
    Search,
    Compass,
    Sparkles,
    FileCode,
    Users,
    UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
    isCollapsed?: boolean;
}

function SidebarItem({ icon, label, href, active, isCollapsed }: SidebarItemProps) {
    return (
        <Link href={href}>
            <div
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group relative font-medium",
                    active
                        ? "bg-secondary text-white"
                        : "text-neutral-400 hover:text-white hover:bg-secondary/50"
                )}
            >
                <div className={cn(
                    "shrink-0 transition-colors duration-200",
                    active ? "text-white" : "text-neutral-400 group-hover:text-white"
                )}>
                    {icon}
                </div>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm tracking-tight whitespace-nowrap"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = React.useState(false);

    const menuItems = [
        { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", href: "/dashboard" },
        { icon: <Library className="w-4 h-4" />, label: "My Library", href: "/library" },
        { icon: <Compass className="w-4 h-4" />, label: "Discover", href: "/discover" },
    ];

    const projectItems = [
        { icon: <FileCode className="w-4 h-4" />, label: "Code View", href: "/dashboard", activePaths: ["/project/"] },
        { icon: <Users className="w-4 h-4" />, label: "Public Shares", href: "/shares" },
    ];

    const supportItems = [
        { icon: <HelpCircle className="w-4 h-4" />, label: "Learn & Help", href: "/learn" },
        { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/settings" },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isHovered ? 260 : 72 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-screen border-r border-white/5 bg-[#050505] flex flex-col z-50 overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        >
            <div className="p-4 mb-4">
                <Link href="/" className="flex items-center gap-3 px-1.5 group overflow-hidden">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-black text-lg tracking-tighter text-white whitespace-nowrap"
                            >
                                DEMI <span className="text-blue-500">IO</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.href} title={!isHovered ? item.label : ""}>
                            <SidebarItem
                                {...item}
                                active={pathname === item.href}
                                isCollapsed={!isHovered}
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {isHovered ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                            >
                                Projects
                            </motion.p>
                        ) : (
                            <div className="h-px bg-border mx-3" />
                        )}
                    </AnimatePresence>
                    <div className="space-y-1">
                        {projectItems.map((item) => (
                            <div key={item.href} title={!isHovered ? item.label : ""}>
                                <SidebarItem
                                    {...item}
                                    active={pathname === item.href}
                                    isCollapsed={!isHovered}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {isHovered ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-3 text-[10px] font-semibold text-neutral-600 uppercase tracking-wider whitespace-nowrap"
                            >
                                Support
                            </motion.p>
                        ) : (
                            <div className="h-px bg-white/5 mx-3" />
                        )}
                    </AnimatePresence>
                    <div className="space-y-1">
                        {supportItems.map((item) => (
                            <div key={item.href} title={!isHovered ? item.label : ""}>
                                <SidebarItem
                                    {...item}
                                    active={pathname === item.href}
                                    isCollapsed={!isHovered}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-white/5 space-y-4 overflow-hidden">
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-2"
                        >
                            <div className="p-3 bg-secondary/50 rounded-xl border border-border group hover:border-primary/20 transition-all cursor-pointer">
                                <p className="text-xs font-bold mb-1 group-hover:text-primary transition-colors">Upgrade to Pro</p>
                                <p className="text-[10px] text-muted-foreground">Unlock more benefits</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border border-white/5 overflow-hidden shrink-0">
                            <UserCircle className="w-5 h-5 text-neutral-400" />
                        </div>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col"
                            >
                                <span className="text-xs font-bold truncate max-w-[100px]">Ben Eboh</span>
                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Online</span>
                            </motion.div>
                        )}
                    </div>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-muted-foreground"
                        >
                            <Link href="/learn" title="Learn & Tutorials" className="hover:text-primary transition-colors"><HelpCircle className="w-4 h-4" /></Link>
                            <Link href="/settings" title="Quick Settings" className="hover:text-primary transition-colors"><Settings className="w-4 h-4" /></Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}
