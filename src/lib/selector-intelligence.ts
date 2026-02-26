"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MousePointer2, Sparkles, Tag } from "lucide-react";

interface SimulatedElementProps {
    selector: string;
    name: string;
    type: "text" | "currency" | "action" | "image" | "link";
    children: React.ReactNode;
    onSelect: (selector: any) => void;
    isSelected?: boolean;
    className?: string;
}

export function SimulatedElement({
    selector,
    name,
    type,
    children,
    onSelect,
    isSelected,
    className
}: SimulatedElementProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className= { cn("relative group/sim transition-all duration-300", className) }
    onMouseEnter = {() => setIsHovered(true)
}
onMouseLeave = {() => setIsHovered(false)}
onClick = {(e) => {
    e.stopPropagation();
    onSelect({ name, selector, type });
}}
        >
    {/* Outline logic */ }
    <AnimatePresence>
{
    isHovered && !isSelected && (
        <motion.div 
                        initial={ { opacity: 0, scale: 0.98 } }
    animate = {{ opacity: 1, scale: 1 }
}
exit = {{ opacity: 0, scale: 0.98 }}
className = "absolute -inset-2 border-2 border-dashed border-blue-400/40 rounded-xl pointer-events-none z-10"
    >
    <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md shadow-lg flex items-center gap-2" >
        <MousePointer2 className="w-2.5 h-2.5" />
            { selector }
            </div>
            </motion.div>
                )}
</AnimatePresence>

{
    isSelected && (
        <div className="absolute -inset-2 border-2 border-blue-600 rounded-xl pointer-events-none z-10 bg-blue-600/5 shadow-[0_0_30px_rgba(37,99,235,0.15)]" >
            <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md shadow-lg flex items-center gap-2" >
                <Tag className="w-2.5 h-2.5" />
                    Selected: { name }
    </div>
        </div>
            )
}

<div className={
    cn(
        "cursor-crosshair transition-all duration-300",
        isHovered ? "brightness-105" : "",
        isSelected ? "scale-[1.02]" : ""
    )
}>
    { children }
    </div>
    </div>
    );
}

export function TargetMockAmazon({ onSelect, selections }: { onSelect: (s: any) => void, selections: any[] }) {
    const isSelected = (selector: string) => selections.some(s => s.selector === selector);

    return (
        <div className= "p-12 space-y-16 max-w-4xl mx-auto" >
        <div className="flex flex-col md:flex-row gap-16" >
            {/* Product Image Selection */ }
            < div className = "w-full md:w-1/2" >
                <SimulatedElement
                        name="Main Product Image"
    selector = "#main-image"
    type = "image"
    isSelected = { isSelected("#main-image") }
    onSelect = { onSelect }
    className = "aspect-square bg-white border-2 border-neutral-100 rounded-[48px] flex items-center justify-center overflow-hidden group shadow-2xl shadow-black/5"
        >
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white" >
            <Sparkles className="w-20 h-20 text-neutral-200 group-hover:text-blue-200 transition-colors duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent" />
                    </div>
                    </SimulatedElement>
                    </div>

    {/* Product Info */ }
    <div className="w-full md:w-1/2 space-y-10" >
        <SimulatedElement
                        name="Product Title"
    selector = "h1#productTitle"
    type = "text"
    isSelected = { isSelected("h1#productTitle") }
    onSelect = { onSelect }
        >
        <h1 className="text-5xl font-black text-neutral-900 leading-tight tracking-tighter" >
            Aether < span className = "text-blue-600" > Dynamic </span> Pro X1
                </h1>
                < p className = "mt-4 text-neutral-400 font-medium text-lg" > High - Fidelity Audio Interface with Neural Processing </p>
                    </SimulatedElement>

                    < div className = "flex items-end gap-3" >
                        <SimulatedElement
                            name="Price Label"
    selector = ".a-price-whole"
    type = "currency"
    isSelected = { isSelected(".a-price-whole") }
    onSelect = { onSelect }
        >
        <div className="flex items-start text-6xl font-black text-neutral-900 tracking-tighter" >
            <span className="text-2xl mt-2 mr-1 text-blue-600 font-bold" > $ </span>
    299
        < span className = "text-2xl mt-2 ml-1 text-neutral-300 font-bold" > .99 </span>
            </div>
            </SimulatedElement>
            < div className = "mb-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest" > In Stock </div>
                </div>

                < div className = "space-y-4 pt-6 border-t border-neutral-100" >
                    <SimulatedElement
                            name="Add to Cart Action"
    selector = "#add-to-cart-button"
    type = "action"
    isSelected = { isSelected("#add-to-cart-button") }
    onSelect = { onSelect }
        >
        <button className="w-full py-6 bg-neutral-900 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-black/20 hover:bg-blue-600 transition-all duration-500 transform active:scale-95" >
            Add to Project Cart
                </button>
                </SimulatedElement>

                < p className = "text-center text-xs font-bold text-neutral-400 uppercase tracking-widest" > Ships from Demi Intelligence Labs </p>
                    </div>
                    </div>
                    </div>

    {/* Recommendations Grid */ }
    <div className="space-y-8 pt-16" >
        <h3 className="text-2xl font-black text-neutral-900 tracking-tight" > Similar Entities </h3>
            < div className = "grid grid-cols-1 md:grid-cols-3 gap-6" >
            {
                [1, 2, 3].map((i) => (
                    <SimulatedElement
                            key= { i }
                            name = {`Related Item ${i}`}
    selector = {`.recommendation:nth-child(${i})`
}
type = "link"
isSelected = { isSelected(`.recommendation:nth-child(${i})`)}
                            onSelect={onSelect}
                            className="bg-white border border-neutral-100 p-6 rounded-[32px] hover:shadow-xl hover:shadow-black/[0.02] transition-all"
                        >
                            <div className="aspect-video bg-neutral-50 rounded-2xl mb-4" />
                            <div className="h-4 w-3/4 bg-neutral-100 rounded-full mb-2" />
                            <div className="h-3 w-1/2 bg-neutral-50 rounded-full" />
                        </SimulatedElement>
                    ))}
                </div>
            </div>
        </div>
    );
}
