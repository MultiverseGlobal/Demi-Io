"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    Check,
    ArrowUpRight,
    History,
    Download
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: "$0",
        priceId: "", // Free plan
        description: "Perfect for exploring intent compilation.",
        features: ["5 Generates / month", "Standard Compiler", "Community Support", "Manifest v3 Only"],
        current: true,
    },
    {
        id: "pro",
        name: "Pro",
        price: "$29",
        priceId: "price_H5ggYyTqXwZ8jL", // Replace with real Stripe Price ID
        description: "For serious builders who need speed.",
        features: ["Unlimited Generates", "High-Performance Mode", "Priority Support", "Chrome & Edge Support", "Custom Templates"],
        current: false,
        recommended: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        priceId: "price_H5ggYyTqXwZ8jK", // Replace with real Stripe Price ID
        description: "Scale your ideas to the entire team.",
        features: ["Bulk Distribution", "Private Registry", "OIDC Integration", "Dedicated Support", "SLA Guarantee"],
        current: false,
    }
];

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handlePlanSelect = async (plan: typeof plans[0]) => {
        if (plan.current || !plan.priceId) return;

        setIsLoading(plan.id);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, priceId: plan.priceId })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to start checkout');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            {/* Header */}
            <section>
                <h1 className="text-3xl font-black tracking-tight text-foreground mb-1 uppercase">Billing & Usage</h1>
                <p className="text-muted-foreground text-sm font-medium italic">Manage your subscription and track your compilation credits.</p>
            </section>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all",
                            plan.recommended
                                ? "bg-card border-2 border-primary shadow-xl shadow-primary/5 scale-105 z-10"
                                : "bg-card border border-border shadow-sm"
                        )}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 right-0 p-2">
                                <span className="text-[9px] font-black uppercase bg-primary text-white px-3 py-1 rounded-bl-xl rounded-tr-lg tracking-widest">Recommended</span>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-lg font-black text-foreground mb-2 tracking-tight uppercase">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                                <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">/mo</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">{plan.description}</p>
                        </div>

                        <div className="flex-1 space-y-4 mb-10">
                            {plan.features.map((feature, fi) => (
                                <div key={fi} className="flex gap-3 items-center">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-primary bg-primary/10">
                                        <Check className="w-2.5 h-2.5" />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePlanSelect(plan)}
                            disabled={isLoading !== null}
                            className={cn(
                                "w-full py-4 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest",
                                plan.current
                                    ? "bg-secondary text-muted-foreground cursor-default"
                                    : plan.recommended
                                        ? "bg-primary text-white hover:opacity-90"
                                        : "bg-foreground text-background hover:opacity-90",
                                isLoading === plan.id && "animate-pulse"
                            )}
                        >
                            {isLoading === plan.id ? "Loading..." : plan.current ? "Current Plan" : `Select ${plan.name}`}
                            {!plan.current && isLoading !== plan.id && <ArrowUpRight className="w-3.5 h-3.5" />}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Payment History */}
            <section className="space-y-6 pt-12">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-black text-foreground tracking-[0.2em] uppercase flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        Payment History
                    </h2>
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 uppercase tracking-widest transition-colors">
                        Download All
                    </button>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    {[
                        { date: "Jan 04, 2026", amount: "$29.00", status: "Paid", invoice: "INV-2026-001" },
                        { date: "Dec 04, 2025", amount: "$29.00", status: "Paid", invoice: "INV-2025-012" },
                    ].map((inv, i) => (
                        <div key={i} className={cn(
                            "p-5 flex items-center justify-between group hover:bg-secondary/50 transition-colors",
                            i !== 1 && "border-b border-border"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-secondary rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground tracking-tight">{inv.invoice}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{inv.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className="text-sm font-black text-foreground">{inv.amount}</span>
                                <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">{inv.status}</span>
                                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                    <Download className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
