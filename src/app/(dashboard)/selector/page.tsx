"use client";

import { useState, useRef, useEffect } from "react";
import {
    Globe,
    MousePointer2,
    Code2,
    Sparkles,
    ArrowRight,
    Loader2,
    ShieldCheck,
    Layout,
    Search,
    Copy,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SelectorPage() {
    const [url, setUrl] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedSelectors, setCapturedSelectors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleStartCapture = async () => {
        if (!url) return;
        setLoading(true);
        // Simulate fetching site and injecting picker
        setTimeout(() => {
            setIsCapturing(true);
            setLoading(false);
            // Add some mock data for the demo
            if (url.includes("amazon")) {
                setCapturedSelectors([
                    { name: "Price Label", selector: "#corePrice_feature_div .a-price-whole", type: "currency" },
                    { name: "Product Title", selector: "#productTitle", type: "text" }
                ]);
            }
        }, 1500);
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleExport = () => {
        if (capturedSelectors.length === 0) return;
        localStorage.setItem('demi_last_selectors', JSON.stringify(capturedSelectors));
        localStorage.setItem('demi_last_url', url);
        router.push(`/dashboard?import_selectors=true`);
    };

    return (
        <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
                        <MousePointer2 className="w-4 h-4" />
                        Intelligence Tooling
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-neutral-900">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Selector Workspace.</span>
                    </h1>
                    <p className="text-neutral-500 font-medium">Map target elements visually to bake high-fidelity intelligence into your projects.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sandboxed Session</span>
                    </div>
                </div>
            </div>

            {/* URL Input Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Globe className="w-5 h-5 text-neutral-600 group-focus-within:text-blue-500 transition-all" />
                </div>
                <input
                    type="url"
                    placeholder="https://www.target-website.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-[24px] pl-16 pr-[200px] py-6 text-sm font-medium focus:border-blue-500/40 outline-none transition-all focus:bg-neutral-50 placeholder:text-neutral-300 shadow-sm"
                />
                <button
                    onClick={handleStartCapture}
                    disabled={loading || !url}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-white text-black rounded-[18px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Visual Capture"}
                </button>
            </div>

            {/* Workspace Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                {/* Visual Viewport */}
                <div className="lg:col-span-2 relative bg-white border border-neutral-200 rounded-[40px] overflow-hidden flex flex-col group shadow-sm">
                    <div className="h-12 border-b border-neutral-100 bg-neutral-50/50 flex items-center px-6 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/20" />
                        </div>
                        <div className="mx-auto flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-lg border border-neutral-200">
                            <Layout className="w-3 h-3 text-neutral-400" />
                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{url || "No site loaded"}</span>
                        </div>
                    </div>

                    <div className="flex-1 relative bg-neutral-50 overflow-auto no-scrollbar">
                        <AnimatePresence mode="wait">
                            {!isCapturing ? (
                                <div className="h-full flex items-center justify-center p-12 text-center">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="space-y-6 max-w-sm"
                                    >
                                        <div className="w-20 h-20 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center justify-center mx-auto relative">
                                            <div className="absolute inset-0 bg-blue-500/5 blur-2xl animate-pulse rounded-full" />
                                            <MousePointer2 className="w-10 h-10 text-blue-600 relative z-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-neutral-900">Visual Engine Ready</h3>
                                            <p className="text-sm text-neutral-500 font-medium">Enter a URL to begin point-and-click selector extraction for your project.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 space-y-12 min-w-[800px]"
                                >
                                    {/* Simulated Amazon-like Page */}
                                    <div className="flex gap-12">
                                        <div className="w-1/2 aspect-square bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden flex items-center justify-center group/img relative cursor-crosshair">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                            <Sparkles className="w-12 h-12 text-neutral-800" />
                                        </div>

                                        <div className="w-1/2 space-y-8">
                                            <div
                                                onClick={() => setCapturedSelectors(prev => [...prev, { name: "Title", selector: "#productTitle", type: "text" }])}
                                                className="p-4 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 cursor-crosshair transition-all group/el"
                                            >
                                                <h1 className="text-3xl font-black text-neutral-900 mb-2">Alpha Dynamic Pro X1</h1>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/el:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#productTitle</span>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => setCapturedSelectors(prev => [...prev, { name: "Price", selector: ".a-price-whole", type: "currency" }])}
                                                className="p-4 rounded-2xl hover:bg-green-50 border border-transparent hover:border-green-100 cursor-crosshair transition-all group/price"
                                            >
                                                <div className="text-4xl font-black text-neutral-900 flex items-start">
                                                    <span className="text-lg mt-1 mr-1">$</span>
                                                    299
                                                    <span className="text-lg mt-1 ml-1 text-neutral-400">.99</span>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover/price:opacity-100 transition-opacity mt-2">
                                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">.a-price-whole</span>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() => setCapturedSelectors(prev => [...prev, { name: "Add to Cart", selector: "#add-to-cart-button", type: "action" }])}
                                                className="p-6 bg-blue-600 text-white rounded-[24px] shadow-lg shadow-blue-600/10 font-black text-center cursor-crosshair hover:bg-blue-700 transition-all group/btn"
                                            >
                                                Add to Project Cart
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover/btn:opacity-100 transition-opacity mt-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">#add-to-cart-button</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Injection Toast */}
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                                            <span className="text-xs font-bold text-blue-700">Demi Injected: Click any element to map its selector.</span>
                                        </div>
                                        <button className="text-[10px] font-black text-blue-600 px-3 py-1 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">Configure Proxy</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Captured Selectors Panel */}
                <div className="bg-white border border-neutral-200 rounded-[40px] flex flex-col overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-neutral-100 space-y-1 bg-neutral-50/50">
                        <h2 className="text-lg font-black text-neutral-900 px-1">Captured Selectors</h2>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest px-1">Identity Inventory</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {capturedSelectors.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                <Code2 className="w-12 h-12 text-neutral-800" />
                                <p className="text-xs text-neutral-600 font-medium leading-relaxed">No selectors captured yet. Click elements in the visual view to extract identities.</p>
                            </div>
                        ) : (
                            capturedSelectors.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-5 bg-neutral-50 border border-neutral-200 rounded-3xl hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest tracking-[0.2em]">{s.type}</span>
                                            <h4 className="text-sm font-black text-neutral-900">{s.name}</h4>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(s.selector, i)}
                                            className="p-2 bg-white rounded-xl border border-neutral-100 hover:border-blue-200 transition-all text-neutral-400 hover:text-blue-600 shadow-sm"
                                        >
                                            {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                    <code className="block w-full p-3 bg-white border border-neutral-100 rounded-xl text-[10px] font-mono text-neutral-400 truncate group-hover:text-blue-600 transition-colors">
                                        {s.selector}
                                    </code>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                        <button
                            onClick={handleExport}
                            disabled={capturedSelectors.length === 0}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10 active:scale-95 disabled:opacity-30"
                        >
                            Export to Project
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
