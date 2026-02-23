"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: string;
    }[];
}

export function Carousel({ items }: CarouselProps) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % items.length);
    const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-3xl p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
                >
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl",
                        "bg-gradient-to-br", items[index].color
                    )}>
                        <div className="text-white scale-150">
                            {items[index].icon}
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <h3 className="text-3xl font-black tracking-tight text-white">{items[index].title}</h3>
                        <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
                            {items[index].description}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center md:justify-start gap-4 mt-8 relative z-20">
                <button
                    onClick={prev}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={next}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-white" />
                </button>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-2">
                {items.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 transition-all duration-300 rounded-full",
                            i === index ? "w-8 bg-blue-500" : "w-1.5 bg-white/10"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
