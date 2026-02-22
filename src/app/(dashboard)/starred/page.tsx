"use client";

import { Star, LayoutGrid, List } from "lucide-react";

export default function StarredPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        Starred Projects
                    </h1>
                    <p className="text-muted-foreground">Your most important extensions, all in one place.</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
                    <button className="p-1.5 bg-background rounded-md shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                    <button className="p-1.5 text-muted-foreground"><List className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 space-y-3 group hover:border-primary/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold">No starred projects</h3>
                        <p className="text-xs text-muted-foreground">Star a project in your library to see it here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
