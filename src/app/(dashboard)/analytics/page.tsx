import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Users,
    Activity,
    Zap,
    Shield,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const usageData = [
    { day: "Mon", generations: 45, credits: 1200 },
    { day: "Tue", generations: 52, credits: 1450 },
    { day: "Wed", generations: 38, credits: 980 },
    { day: "Thu", generations: 65, credits: 1800 },
    { day: "Fri", generations: 48, credits: 1300 },
    { day: "Sat", generations: 24, credits: 650 },
    { day: "Sun", generations: 31, credits: 820 },
];

const healthMetrics = [
    { name: "Auth Bypass", status: "pass", projects: 12 },
    { name: "Unsafe Eval", status: "warning", projects: 2 },
    { name: "Permission Bloat", status: "pass", projects: 14 },
    { name: "CSRF Risk", status: "pass", projects: 14 },
];

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<"usage" | "health">("usage");

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-neutral-900">Intelligence Analytics</h1>
                    <p className="text-neutral-500 font-medium">Monitoring fleet performance and security across 14 extensions.</p>
                </div>
                <div className="flex bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
                    <button
                        onClick={() => setActiveTab('usage')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'usage' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        Usage View
                    </button>
                    <button
                        onClick={() => setActiveTab('health')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'health' ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        Fleet Health
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Generations"
                    value="303"
                    change="+24%"
                    trend="up"
                    icon={<Zap className="w-4 h-4 text-blue-500" />}
                />
                <StatCard
                    label="Credits Burned"
                    value="12.4k"
                    change="-8%"
                    trend="down"
                    icon={<BarChart3 className="w-4 h-4 text-purple-500" />}
                />
                <StatCard
                    label="Policy Compliance"
                    value="94%"
                    change="+2%"
                    trend="up"
                    icon={<Shield className="w-4 h-4 text-green-500" />}
                />
                <StatCard
                    label="Generation Success"
                    value="99.2%"
                    change="Stable"
                    trend="neutral"
                    icon={<CheckCircle2 className="w-4 h-4 text-blue-600" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'usage' ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-neutral-100 p-8 rounded-[40px] shadow-sm flex flex-col gap-8"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-neutral-900">Weekly Generation Volume</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Generations</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-blue-100 rounded-full" />
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Credits (x10)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-end justify-between h-64 px-4 gap-4">
                                {usageData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                                        <div className="relative w-full flex flex-col items-center gap-0.5">
                                            {/* Hover tooltip placeholder */}
                                            <div className="absolute -top-12 bg-neutral-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {d.generations} Gen · {d.credits} Cr
                                            </div>

                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(d.credits / 2000) * 100}%` }}
                                                className="w-full bg-blue-50 rounded-t-xl"
                                                transition={{ delay: i * 0.05, duration: 1 }}
                                            />
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(d.generations / 100) * 100}%` }}
                                                className="w-full bg-blue-600 rounded-t-xl absolute bottom-0"
                                                transition={{ delay: i * 0.1, duration: 1 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-neutral-100 p-8 rounded-[40px] shadow-sm flex flex-col gap-6"
                        >
                            <h3 className="text-xl font-black text-neutral-900">Fleet Security Audit</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {healthMetrics.map((m, i) => (
                                    <div key={i} className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{m.name}</span>
                                            <p className="text-lg font-black text-neutral-900">{m.projects} Projects</p>
                                        </div>
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center",
                                            m.status === 'pass' ? "bg-green-50 text-green-500 border border-green-100" : "bg-yellow-50 text-yellow-500 border border-yellow-100"
                                        )}>
                                            {m.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-blue-600 rounded-3xl text-white flex items-center justify-between mt-4">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black">Scan In Progress</h4>
                                    <p className="text-sm text-blue-100 font-medium">Continuous guardrail monitoring is active for all extensions.</p>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse">
                                    <Shield className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar Activity */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 rounded-[40px] p-8 text-white space-y-6 h-full shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Clock className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Real-time Hub
                            </h3>
                            <div className="space-y-6">
                                <ActivityItem
                                    time="2m ago"
                                    desc="New Manifest generated for 'E-com Optimizer'"
                                    icon={<Zap className="w-3 h-3 text-blue-400" />}
                                />
                                <ActivityItem
                                    time="14m ago"
                                    desc="Security Scan passed: 'Social Feed Pro'"
                                    icon={<Shield className="w-3 h-3 text-green-400" />}
                                />
                                <ActivityItem
                                    time="1h ago"
                                    desc="User fork: 'AdBlock Elite' (3.2k downloads)"
                                    icon={<TrendingUp className="w-3 h-3 text-purple-400" />}
                                />
                                <ActivityItem
                                    time="3h ago"
                                    desc="Credit reload: +5,000 credits applied"
                                    icon={<Clock className="w-3 h-3 text-orange-400" />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, trend, icon }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[32px] border border-neutral-100 bg-white hover:border-blue-100 transition-all flex flex-col gap-3 shadow-sm group"
        >
            <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
                <div className="p-2 bg-neutral-50 rounded-xl group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-neutral-900">{value}</span>
                <div className={cn(
                    "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",
                    trend === 'up' ? "text-green-600 bg-green-50" :
                        trend === 'down' ? "text-red-600 bg-red-50" :
                            "text-neutral-400 bg-neutral-50"
                )}>
                    {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                    {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </div>
            </div>
        </motion.div>
    );
}

function ActivityItem({ time, desc, icon }: any) {
    return (
        <div className="flex gap-4 group cursor-default">
            <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-300 group-hover:text-white transition-colors leading-relaxed">{desc}</p>
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{time}</span>
            </div>
        </div>
    );
}
