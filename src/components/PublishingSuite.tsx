"use client";

import { useState, useEffect } from "react";
import {
    X,
    Shield,
    Sparkles,
    Image as ImageIcon,
    Type,
    ArrowRight,
    Download,
    CheckCircle2,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SafetyIssue } from "@/lib/intelligence";

interface PublishingSuiteProps {
    isOpen: boolean;
    onClose: () => void;
    files: Record<string, string>;
    guardrailIssues: SafetyIssue[];
    onDownload: (additionalFiles: Record<string, string>) => void;
    projectName: string;
}

export function PublishingSuite({ isOpen, onClose, files, guardrailIssues, onDownload, projectName }: PublishingSuiteProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
    const [description, setDescription] = useState("");
    const [generatedIcons, setGeneratedIcons] = useState<Record<string, string>>({});

    const criticalIssues = guardrailIssues.filter(i => i.severity === 'critical');

    const handleGenerateAssets = async () => {
        setIsGeneratingAssets(true);
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setDescription(`The ${projectName} extension provides a high-performance solution for modern web workflows. Built with Demi IO, it features seamless Manifest V3 integration, optimized performance, and a security-first architecture.`);

        setGeneratedIcons({
            "icon16.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWklEQVQ4y2NgGAWjYBSMgoEBZgYGhncMDIzvQMzAgB/A+A7E//79Y8BlAPM7EDNQM8AI0P/P0DAAxKAGMP830DYAxID8f4amAYI0wEAGDAbAGBgwGIADAAGMAQAAdGIRALC/L/MAAAAASUVORK5CYII=",
            "icon48.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqklEQVR4nO3ZMQ7CQAwFwa7TUpIn4f5XoKWkpI5pGf8pLMTunS1nBvKPrMofYoyTfS86+SIm9r3o5IsY3vOqYmHfV9Uw0Pez6qHAtp9VbwVuv6oeCRz7VfX7FvT3VsBvBfxWwG8F/FbAbwX8VsBvBfz+C/7eCvitgN8K+K2A3wr4rYDfCvitgN8K+K2A3xr6XlX/v3/7WvR9M7S9qv7f374S+l5V/7/361X9f/7Oq4rtBeX7R+00N114AAAAAElFTkSuQmCC",
            "icon128.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsUlEQVR4nO3ZMQ7CQAwFwa7TUpIn4f5XoKWkpI5pGf8pLMTunS1nBvKPrMofYoyTfS86+SIm9r3o5IsY3vOqYmHfV9Uw0Pez6qHAtp9VbwVuv6oeCRz7VfX7FvT3VsBvBfxWwG8F/FbAbwX8VsBvBfz+C/7eCvitgN8K+K2A3wr4rYDfCvitgN8K+K2A3xr6XlX/v3/7WvR9M7S9qv7f374S+l5V/7/361X9f/7Oq4rtBeX7R+00N114AAAAAElFTkSuQmCC"
        });

        setIsGeneratingAssets(false);
        setStep(3);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full"
            >
                {/* Header */}
                <header className="p-8 border-b border-neutral-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                            <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-neutral-900 leading-tight">Publishing Suite</h2>
                            <p className="text-sm text-neutral-500 font-medium">Step {step} of 3: {step === 1 ? 'Manifest Audit' : step === 2 ? 'Branding Assets' : 'Final Package'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-neutral-100 rounded-2xl transition-all">
                        <X className="w-6 h-6 text-neutral-400" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-neutral-900">Safety & Compliance Check</h3>
                                    <p className="text-neutral-500">We scanned your manifest and code against Web Store policies.</p>
                                </div>

                                {guardrailIssues.length === 0 ? (
                                    <div className="p-8 bg-green-50 border border-green-100 rounded-[32px] flex flex-col items-center text-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-green-900">All Systems Clear</h4>
                                            <p className="text-sm text-green-700 font-medium">Your extension follows core security best practices.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {guardrailIssues.map((issue, i) => (
                                            <div key={i} className={cn(
                                                "p-5 rounded-3xl border flex items-start gap-4",
                                                issue.severity === 'critical' ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
                                            )}>
                                                <div className={cn(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm",
                                                    issue.severity === 'critical' ? "text-red-500" : "text-yellow-500"
                                                )}>
                                                    <AlertTriangle className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-black text-neutral-900">{issue.title}</h4>
                                                    <p className="text-xs text-neutral-500 leading-relaxed">{issue.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={criticalIssues.length > 0}
                                    className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                                >
                                    Proceed to Branding
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                {criticalIssues.length > 0 && (
                                    <p className="text-center text-[10px] font-bold text-red-500 uppercase tracking-widest">Resolve critical issues to continue</p>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10 text-center"
                            >
                                <div className="space-y-2">
                                    <div className="w-20 h-20 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center justify-center mx-auto mb-6">
                                        <ImageIcon className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900">Generate Visual Identity</h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto font-medium">Demi will create professional icons and a store description for your extension.</p>
                                </div>

                                <button
                                    onClick={handleGenerateAssets}
                                    disabled={isGeneratingAssets}
                                    className="w-full py-6 bg-neutral-900 text-white rounded-[28px] font-black hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] group"
                                >
                                    {isGeneratingAssets ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Designing Assets...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            AI Asset Generation
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex -space-x-4">
                                            {Object.entries(generatedIcons).map(([name, data], i) => (
                                                <div key={name} className="w-16 h-16 rounded-2xl bg-white border-4 border-blue-50 shadow-sm flex items-center justify-center overflow-hidden">
                                                    <img src={data} alt={name} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-blue-900">Branding Generated</h4>
                                            <p className="text-xs text-blue-700 font-bold uppercase tracking-widest">3 Icon sizes included</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-900">
                                            <Type className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Store Description</span>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-blue-100 text-sm text-neutral-600 leading-relaxed font-medium">
                                            {description}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onDownload({
                                            ...generatedIcons,
                                            "STORE_DESCRIPTION.txt": description
                                        });
                                        onClose();
                                    }}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-[0.98]"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Production Bundle
                                </button>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 text-neutral-400 hover:text-neutral-600 font-bold text-sm transition-colors"
                                >
                                    Regenerate Assets
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
