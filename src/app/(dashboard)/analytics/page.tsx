"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, ArrowUpRight, Zap } from "lucide-react";

const stats = [
    { label: "Daily Active Users", value: "2,841", change: "+12.5%", icon: <Users className="w-4 h-4" /> },
    { label: "Extension Loads", value: "45,203", change: "+18.2%", icon: <Activity className="w-4 h-4" /> },
    { label: "API Success Rate", value: "99.9%", change: "+0.1%", icon: <Zap className="w-4 h-4" /> },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Track your extension performance and user engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-border bg-card/50 flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                            {stat.icon}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black">{stat.value}</span>
                            <span className="text-xs font-bold text-green-500">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-8 rounded-2xl border border-border bg-card/50 min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold">Usage Trends</h3>
                        <p className="text-sm text-muted-foreground">Detailed usage charts will appear here.</p>
                    </div>
                </div>
                <div className="p-8 rounded-2xl border border-border bg-card/50 min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold">Conversion Rate</h3>
                        <p className="text-sm text-muted-foreground">Installation conversion metrics coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
