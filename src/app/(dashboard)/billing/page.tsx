"use client";

import { motion } from "framer-motion";
import {
    Check,
    Zap,
    Sparkles,
    Shield,
    Cpu,
    Clock,
    ArrowRight,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";

const tiers = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for hobbyists and first-time builders.",
        features: [
            "5,000 Monthly Credits",
            "3 Active projects",
            "Visual Selector (Standard)",
            "Community Support",
            "Public Showcase Access"
        ],
        button: "Current Plan",
        highlight: false
    },
    {
        name: "Professional",
        price: "$29",
        description: "For creators who need full agentic power.",
        features: [
            "25,000 Monthly Credits",
            "Unlimited projects",
            "Access to GPT-4o & Claude 3.5",
            "Priority AI Intelligence",
            "Advanced Branding & Export",
            "Priority Support"
        ],
        button: "Upgrade to Pro",
        highlight: true
    }
];

export default function BillingPage() {
    const { is_pro, available_credits, subscription_tier } = useSubscription();

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100"
                >
                    Plans & Billing
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
                    Scale your agentic <br /> <span className="text-blue-600">potential.</span>
                </h1>
                <p className="max-w-xl text-neutral-500 font-medium">
                    Choose the plan that fits your workflow. All plans include our core AI generation engine and Visual Selector.
                </p>
            </div>

            {/* Current Status Card (Small) */}
            <div className="flex justify-center">
                <div className="flex items-center gap-6 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200">
                    <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-xl shadow-sm border border-neutral-200">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
                            {subscription_tier === 'pro' ? 'Pro active' : 'Starter active'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 pr-4">
                        <CreditCard className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-bold text-neutral-500">
                            {available_credits.toLocaleString()} Credits Left
                        </span>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
                {tiers.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "relative flex flex-col p-10 rounded-[40px] border transition-all duration-300",
                            tier.highlight
                                ? "bg-white border-blue-600 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                                : "bg-neutral-50 border-neutral-200 hover:bg-white"
                        )}
                    >
                        {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                Recommended
                            </div>
                        )}

                        <div className="space-y-2 mb-8 text-center">
                            <h3 className="text-xl font-black text-neutral-900">{tier.name}</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-black text-neutral-900">{tier.price}</span>
                                <span className="text-neutral-400 font-medium text-sm">/mo</span>
                            </div>
                            <p className="text-sm text-neutral-500 font-medium">{tier.description}</p>
                        </div>

                        <div className="flex-1 space-y-4 mb-10">
                            {tier.features.map((feature, j) => (
                                <div key={j} className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                        tier.highlight ? "bg-blue-100" : "bg-neutral-200/50"
                                    )}>
                                        <Check className={cn("w-3 h-3", tier.highlight ? "text-blue-600" : "text-neutral-500")} />
                                    </div>
                                    <span className="text-xs font-bold text-neutral-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={cn(
                            "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            tier.highlight
                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95"
                                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                        )}
                            disabled={tier.name.toLowerCase() === subscription_tier}
                        >
                            {tier.name.toLowerCase() === subscription_tier ? "Active" : tier.button}
                            {!is_pro && tier.highlight && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Core Benefits */}
            <div className="pt-12 text-center space-y-8">
                <h2 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em]">Enterprise Power for Everyone</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto px-4">
                    {[
                        { icon: <Shield className="w-6 h-6 text-purple-600" />, title: "Safety Audits", desc: "Every extension is scanned for malware and manifest compliance." },
                        { icon: <Cpu className="w-6 h-6 text-blue-600" />, title: "State-of-the-Art", desc: "Access the latest vision and reasoning models directly in the browser." },
                        { icon: <Clock className="w-6 h-6 text-orange-600" />, title: "Rapid Iteration", desc: "Build, test, and publish in a single session. No external tools needed." }
                    ].map((benefit, i) => (
                        <div key={i} className="space-y-4 flex flex-col items-center">
                            <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100">
                                {benefit.icon}
                            </div>
                            <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">{benefit.title}</h4>
                            <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-[200px]">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
