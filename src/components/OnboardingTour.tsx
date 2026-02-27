"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronRight,
    ChevronLeft,
    Zap,
    Sparkles,
    Target,
    Code2,
    Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    highlightId?: string; // ID of the element to highlight
}

const steps: Step[] = [
    {
        id: "intro",
        title: "Welcome to Demi IO",
        description: "Your AI agent is ready to help you build Chrome extensions in minutes, not days.",
        icon: <Zap className="w-6 h-6 text-blue-500" />,
        position: { top: "50%", left: "50%" } // Center initial step
    },
    {
        id: "chat",
        highlightId: "agent-chat-panel",
        title: "The Agentic Core",
        description: "Describe what you want to build. From data scrapers to productivity tools, the AI handles the complex logic.",
        icon: <Sparkles className="w-6 h-6 text-purple-500" />,
        position: { top: "20%", left: "340px" }
    },
    {
        id: "selector",
        highlightId: "selector-intelligence-btn",
        title: "Selector Intelligence",
        description: "Need to interact with a specific website? Use our visual selector to capture elements with 100% accuracy.",
        icon: <Target className="w-6 h-6 text-red-500" />,
        position: { top: "15%", right: "80px" }
    },
    {
        id: "editor",
        highlightId: "code-editor-section",
        title: "No-Code, Full-Control",
        description: "Watch the code as it's generated. You can always jump in and tweak things manually if you're a pro.",
        icon: <Code2 className="w-6 h-6 text-blue-500" />,
        position: { bottom: "10%", left: "50%" }
    },
    {
        id: "publish",
        highlightId: "deploy-btn",
        title: "Launch Readiness",
        description: "When you're ready, we'll scan for security risks, generate your icons, and package everything for the Web Store.",
        icon: <Rocket className="w-6 h-6 text-orange-500" />,
        position: { top: "15%", right: "20px" }
    }
];

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [hasSeenTour, setHasSeenTour] = useState(true);

    useEffect(() => {
        const seen = localStorage.getItem('demi_onboarding_seen');
        if (!seen) {
            setHasSeenTour(false);
            setCurrentStep(0);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const completeTour = () => {
        localStorage.setItem('demi_onboarding_seen', 'true');
        setHasSeenTour(true);
        setCurrentStep(-1);
    };

    if (hasSeenTour || currentStep === -1) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Background Dim */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] pointer-events-auto"
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={step.id === "intro" ? {
                        top: step.position.top,
                        left: step.position.left,
                        transform: 'translate(-50%, -50%)'
                    } : {
                        ...step.position
                    }}
                    className={cn(
                        "absolute pointer-events-auto w-[320px] bg-white rounded-[32px] p-8 shadow-2xl border border-neutral-100 flex flex-col gap-6",
                        step.id === "intro" ? "relative" : ""
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100">
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-neutral-900 leading-tight">{step.title}</h3>
                            <div className="flex gap-1 mt-1">
                                {steps.map((_, i) => (
                                    <div key={i} className={cn(
                                        "h-1 rounded-full transition-all",
                                        i === currentStep ? "w-4 bg-blue-600" : "w-1 bg-neutral-200"
                                    )} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                        {step.description}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="p-3 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20"
                        >
                            {currentStep === steps.length - 1 ? "Start Building" : "Next Step"}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={completeTour}
                            className="p-3 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
